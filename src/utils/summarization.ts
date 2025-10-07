/**
 * Converts markdown text to plain text by removing markdown syntax
 * @param markdownText - The markdown text to convert
 * @returns Plain text version
 */
function markdownToPlainText(markdownText: string): string {
  return markdownText
    // Remove headers (# ## ###)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic (**text** or *text*)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks ```
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules ---
    .replace(/^---+$/gm, '')
    // Remove list markers (- * +)
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    // Remove numbered list markers (1. 2. etc.)
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes >
    .replace(/^>\s*/gm, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/gm, '')
    .trim();
}

/**
 * Generates a comprehensive summary and cool facts for a GitHub repository from its README content.
 * @param readmeContent - The README content as a string
 * @returns Promise with summary and cool facts
 */
export async function generateRepositorySummary(readmeContent: string): Promise<{
  summary: string;
  cool_facts: string[];
}> {
  // Convert markdown to plain text
  const plainTextContent = markdownToPlainText(readmeContent);
  
  // Split into lines and filter meaningful content
  const lines = plainTextContent.split('\n').filter(line => line.trim().length > 0);
  
  // Extract meaningful content for summary (not headers, not too short)
  const meaningfulLines = lines
    .filter(line => {
      const trimmed = line.trim();
      // Skip very short lines, lines that look like headers, or lines that are just symbols
      return trimmed.length > 20 && 
             !trimmed.match(/^[A-Z\s]+$/) && // Skip all-caps lines (likely headers)
             !trimmed.match(/^[•\-\*\+]\s*$/) && // Skip empty list items
             !trimmed.match(/^[\d\.\s]+$/) && // Skip numbered lists
             trimmed.length < 500; // Skip very long lines (likely code blocks)
    });
  
  // Create a comprehensive summary without shortening
  let summary = '';
  
  // Try to find a good description (usually in the first few meaningful lines)
  const descriptionLines = meaningfulLines.slice(0, 5);
  summary = descriptionLines.join(' ').trim();
  
  // If summary is too short, add more content
  if (summary.length < 100 && meaningfulLines.length > 5) {
    const additionalLines = meaningfulLines.slice(5, 10);
    summary += ' ' + additionalLines.join(' ').trim();
  }
  
  // Clean up the summary
  summary = summary
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
  
  // If we still don't have enough content, use the first part of the README
  if (summary.length < 50) {
    summary = plainTextContent.substring(0, 500).trim();
  }
  
  // Generate comprehensive cool facts based on content analysis
  const coolFacts: string[] = [];
  
  // Technology detection
  const technologies = [
    { keyword: 'TypeScript', fact: 'Built with TypeScript for enhanced type safety' },
    { keyword: 'typescript', fact: 'Built with TypeScript for enhanced type safety' },
    { keyword: 'React', fact: 'Uses React for modern user interface development' },
    { keyword: 'react', fact: 'Uses React for modern user interface development' },
    { keyword: 'Next.js', fact: 'Powered by Next.js for full-stack React applications' },
    { keyword: 'next', fact: 'Powered by Next.js for full-stack React applications' },
    { keyword: 'Vue', fact: 'Built with Vue.js for reactive user interfaces' },
    { keyword: 'vue', fact: 'Built with Vue.js for reactive user interfaces' },
    { keyword: 'Angular', fact: 'Uses Angular for enterprise-grade applications' },
    { keyword: 'angular', fact: 'Uses Angular for enterprise-grade applications' },
    { keyword: 'Node.js', fact: 'Backend powered by Node.js runtime' },
    { keyword: 'node', fact: 'Backend powered by Node.js runtime' },
    { keyword: 'Python', fact: 'Developed using Python programming language' },
    { keyword: 'python', fact: 'Developed using Python programming language' },
    { keyword: 'Go', fact: 'Built with Go for high-performance applications' },
    { keyword: 'golang', fact: 'Built with Go for high-performance applications' },
    { keyword: 'Rust', fact: 'Developed in Rust for memory safety and performance' },
    { keyword: 'rust', fact: 'Developed in Rust for memory safety and performance' },
  ];
  
  technologies.forEach(({ keyword, fact }) => {
    if (plainTextContent.toLowerCase().includes(keyword.toLowerCase()) && !coolFacts.some(f => f.includes(fact.split(' ')[2]))) {
      coolFacts.push(fact);
    }
  });
  
  // Feature detection
  if (plainTextContent.toLowerCase().includes('api') || plainTextContent.toLowerCase().includes('rest')) {
    coolFacts.push('Includes RESTful API endpoints for data access');
  }
  
  if (plainTextContent.toLowerCase().includes('database') || plainTextContent.toLowerCase().includes('sql')) {
    coolFacts.push('Database integration for persistent data storage');
  }
  
  if (plainTextContent.toLowerCase().includes('docker') || plainTextContent.toLowerCase().includes('container')) {
    coolFacts.push('Containerized with Docker for easy deployment');
  }
  
  if (plainTextContent.toLowerCase().includes('test') || plainTextContent.toLowerCase().includes('testing')) {
    coolFacts.push('Comprehensive testing suite for reliability');
  }
  
  if (plainTextContent.toLowerCase().includes('ci/cd') || plainTextContent.toLowerCase().includes('github actions')) {
    coolFacts.push('Automated CI/CD pipeline for continuous integration');
  }
  
  if (plainTextContent.toLowerCase().includes('documentation') || plainTextContent.toLowerCase().includes('docs')) {
    coolFacts.push('Well-documented codebase with comprehensive guides');
  }
  
  if (plainTextContent.toLowerCase().includes('open source') || plainTextContent.toLowerCase().includes('opensource')) {
    coolFacts.push('Open source project promoting collaboration');
  }
  
  if (plainTextContent.toLowerCase().includes('license') && plainTextContent.toLowerCase().includes('mit')) {
    coolFacts.push('MIT licensed for maximum flexibility');
  }
  
  // Add some default facts if none were found
  if (coolFacts.length === 0) {
    coolFacts.push('Open source project with active community');
    coolFacts.push('Well-structured codebase following best practices');
    coolFacts.push('Modern development workflow and tooling');
    coolFacts.push('Comprehensive documentation and examples');
  }
  
  return {
    summary,
    cool_facts: coolFacts.slice(0, 6) // Limit to 6 facts for better display
  };
}