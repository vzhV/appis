import { NextRequest, NextResponse } from 'next/server';
import { validateApiKeyFromHeader, createApiKeyErrorResponse } from '../../../utils/api-key-validation';
import { authenticateUser, createUnauthorizedResponse } from '../../../utils/auth-middleware';
import { fetchGithubRepoInfo } from '../../../utils/github';
import { generateRepositorySummary } from '../../../utils/summarization';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user first
    const authResult = await authenticateUser(request);
    if (!authResult.user) {
      return createUnauthorizedResponse(authResult.error || 'Authentication required');
    }

    // Validate API key belongs to the authenticated user
    const validationResult = await validateApiKeyFromHeader(request);
    if (!validationResult.isValid) {
      return createApiKeyErrorResponse(validationResult);
    }

    // Additional check: ensure the API key belongs to the authenticated user
    if (validationResult.apiKeyData?.user_id !== authResult.user.id) {
      return NextResponse.json(
        { success: false, error: 'API key does not belong to authenticated user' },
        { status: 403 }
      );
    }

    // Parse request body to get GitHub URL
    const body = await request.json();
    const { githubUrl } = body;

    if (!githubUrl || typeof githubUrl !== 'string' || githubUrl.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Fetch comprehensive repository information from GitHub
    const repoInfo = await fetchGithubRepoInfo(githubUrl.trim());

    if (!repoInfo.readmeContent) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch README content from the repository' },
        { status: 404 }
      );
    }

    // Generate summary using enhanced summarization
    const summarizationResult = await generateRepositorySummary(repoInfo.readmeContent);

    return NextResponse.json({
      success: true,
      data: {
        githubUrl,
        owner: repoInfo.owner,
        repo: repoInfo.repo,
        stars: repoInfo.stars,
        latestVersion: repoInfo.latestVersion,
        summary: summarizationResult.summary,
        coolFacts: summarizationResult.cool_facts
      }
    });

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process GitHub repository' },
      { status: 500 }
    );
  }
}