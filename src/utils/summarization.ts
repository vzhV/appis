/**
 * Generates a summary and cool facts for a GitHub repository from its README content.
 * @param readmeContent - The README content as a string
 * @returns Promise with summary and cool facts
 */
export async function generateRepositorySummary(readmeContent: string): Promise<{
  summary: string;
  cool_facts: string[];
}> {
  // Simple implementation without external dependencies
  const lines = readmeContent.split('\n').filter(line => line.trim().length > 0);
  
  // Extract first few meaningful lines as summary
  const summaryLines = lines
    .filter(line => !line.startsWith('#') && line.trim().length > 20)
    .slice(0, 3);
  
  const summary = `${summaryLines.join(' ').substring(0, 200)}...`;
  
  // Generate some basic cool facts based on content
  const coolFacts: string[] = [];
  
  if (readmeContent.includes('TypeScript') || readmeContent.includes('typescript')) {
    coolFacts.push('Built with TypeScript for type safety');
  }
  
  if (readmeContent.includes('React') || readmeContent.includes('react')) {
    coolFacts.push('Uses React for modern UI development');
  }
  
  if (readmeContent.includes('Next.js') || readmeContent.includes('next')) {
    coolFacts.push('Powered by Next.js framework');
  }
  
  if (readmeContent.includes('API') || readmeContent.includes('api')) {
    coolFacts.push('Includes API endpoints for data access');
  }
  
  if (readmeContent.includes('database') || readmeContent.includes('Database')) {
    coolFacts.push('Database integration for data persistence');
  }
  
  // Add some default facts if none were found
  if (coolFacts.length === 0) {
    coolFacts.push('Open source project');
    coolFacts.push('Well documented codebase');
    coolFacts.push('Modern development practices');
  }
  
  return {
    summary,
    cool_facts: coolFacts.slice(0, 5) // Limit to 5 facts
  };
}