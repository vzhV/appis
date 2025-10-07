/**
 * Utility functions for interacting with GitHub repositories
 */

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
  } catch (e) {
    throw new Error('axios is required');
  }

  try {
    const mainUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    const mainRes = await axios.get(mainUrl);
    if (mainRes.status === 200 && typeof mainRes.data === 'string') {
      readmeContent = mainRes.data;
      return readmeContent;
    }
  } catch (e) {
    // ignore and try master
  }

  try {
    const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
    const masterRes = await axios.get(masterUrl);
    if (masterRes.status === 200 && typeof masterRes.data === 'string') {
      readmeContent = masterRes.data;
      return readmeContent;
    }
  } catch (e) {
    // ignore
  }

  return null;
}
