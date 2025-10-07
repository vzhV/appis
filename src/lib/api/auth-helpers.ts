import { supabase } from '@/lib/supabase';

/**
 * Get authentication headers for API requests
 * @returns Promise<HeadersInit> - Headers with Authorization token
 * @throws Error if no valid session is available
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }
  
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Get authentication headers with API key for API requests
 * @param apiKey - The API key to include in headers
 * @returns Promise<HeadersInit> - Headers with Authorization token and API key
 * @throws Error if no valid session is available
 */
export async function getAuthHeadersWithApiKey(apiKey: string): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }
  
  return {
    'Authorization': `Bearer ${session.access_token}`,
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
  };
}

/**
 * Make an authenticated fetch request
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = await getAuthHeaders();
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * Make an authenticated fetch request with API key
 * @param url - The URL to fetch
 * @param apiKey - The API key to include
 * @param options - Fetch options
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedFetchWithApiKey(
  url: string, 
  apiKey: string, 
  options: RequestInit = {}
): Promise<Response> {
  const headers = await getAuthHeadersWithApiKey(apiKey);
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}
