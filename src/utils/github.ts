/**
 * Utility functions for interacting with GitHub repositories
 */

export interface GitHubRepoInfo {
  readmeContent: string | null;
  stars: number;
  latestVersion: string | null;
  owner: string;
  repo: string;
}

/**
 * Fetches comprehensive information from a GitHub repository
 * @param githubUrl - The GitHub repository URL
 * @returns Promise<GitHubRepoInfo> - Repository information including README, stars, and latest version
 */
export async function fetchGithubRepoInfo(githubUrl: string): Promise<GitHubRepoInfo> {
  if (!githubUrl || typeof githubUrl !== 'string') {
    throw new Error('githubUrl is required');
  }

  // Extract owner and repo from the githubUrl
  // Example: https://github.com/owner/repo
  const match = githubUrl.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/
  );
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  const owner = match[1];
  const repo = match[2];

  let axios;
  try {
    axios = (await import('axios')).default;
  } catch {
    throw new Error('axios is required');
  }

  // Fetch README content
  const readmeContent = await fetchGithubReadme(githubUrl);

  // Fetch repository metadata from GitHub API
  let stars = 0;
  let latestVersion: string | null = null;

  try {
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Summarizer-App'
      }
    });

    if (repoResponse.status === 200) {
      stars = repoResponse.data.stargazers_count || 0;
    }
  } catch (_error) {
    console.warn('Failed to fetch repository metadata:', _error);
  }

  // Fetch latest release/tag
  try {
    const releasesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Summarizer-App'
      }
    });

    if (releasesResponse.status === 200) {
      latestVersion = releasesResponse.data.tag_name || null;
    }
  } catch {
    // If no releases, try to get the latest tag
    try {
      const tagsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Summarizer-App'
        }
      });

      if (tagsResponse.status === 200 && tagsResponse.data.length > 0) {
        latestVersion = tagsResponse.data[0].name || null;
      }
    } catch (tagError) {
      console.warn('Failed to fetch repository tags:', tagError);
    }
  }

  return {
    readmeContent,
    stars,
    latestVersion,
    owner,
    repo
  };
}

/**
 * Fetches the README content from a GitHub repository
 * @param githubUrl - The GitHub repository URL
 * @returns Promise<string | null> - The README content or null if not found
 */
export async function fetchGithubReadme(githubUrl: string): Promise<string | null> {
  if (!githubUrl || typeof githubUrl !== 'string') {
    throw new Error('githubUrl is required');
  }

  // Extract owner and repo from the githubUrl
  // Example: https://github.com/owner/repo
  const match = githubUrl.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/
  );
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  const owner = match[1];
  const repo = match[2];

  // Try to fetch README.md from main or master branch using axios
  let readmeContent: string | null = null;
  let axios;
  try {
    axios = (await import('axios')).default;
  } catch {
    throw new Error('axios is required');
  }

  try {
    const mainUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    const mainRes = await axios.get(mainUrl);
    if (mainRes.status === 200 && typeof mainRes.data === 'string') {
      readmeContent = mainRes.data;
      return readmeContent;
    }
  } catch {
    // ignore and try master
  }

  try {
    const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
    const masterRes = await axios.get(masterUrl);
    if (masterRes.status === 200 && typeof masterRes.data === 'string') {
      readmeContent = masterRes.data;
      return readmeContent;
    }
  } catch {
    // ignore
  }

  return null;
}
