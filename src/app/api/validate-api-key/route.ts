import { NextRequest, NextResponse } from 'next/server';
import { validateApiKeyForUser } from '../../../utils/api-key-validation';
import { authenticateUser, createUnauthorizedResponse } from '../../../utils/auth-middleware';

// POST /api/validate-api-key - Validate an API key (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user first
    const authResult = await authenticateUser(request);
    if (!authResult.user) {
      return createUnauthorizedResponse(authResult.error || 'Authentication required');
    }

    const body = await request.json();
    const { apiKey } = body;

    // Validate the API key belongs to the authenticated user
    const validationResult = await validateApiKeyForUser(apiKey, authResult.user);

    if (!validationResult.isValid) {
      if (validationResult.error === 'API key is required') {
        return NextResponse.json(
          { success: false, error: validationResult.error },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        isValid: false,
        message: validationResult.error
      });
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      message: 'Valid API key, /protected can be accessed',
      data: {
        id: validationResult.apiKeyData!.id,
        name: validationResult.apiKeyData!.name,
        type: validationResult.apiKeyData!.type,
        usage: validationResult.apiKeyData!.usage,
        monthlyLimit: validationResult.apiKeyData!.monthly_limit,
        userId: validationResult.apiKeyData!.user_id
      }
    });

  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
