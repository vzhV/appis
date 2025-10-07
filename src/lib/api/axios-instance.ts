import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

// Create a centralized axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL || '' : '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      try {
        // Import supabase dynamically to avoid SSR issues
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          config.headers.set('Authorization', `Bearer ${session.access_token}`);
        }
      } catch (error) {
        // Silently fail if we can't get the session
        console.warn('Failed to get auth token for request:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Only redirect to login for specific API endpoints that require authentication
      // Skip redirect for logging endpoints to prevent navigation loops
      if (typeof window !== 'undefined') {
        const requestUrl = error.config?.url || '';
        const isLoggingEndpoint = requestUrl.includes('/api/logs');
        const isSettingsEndpoint = requestUrl.includes('/api/settings');
        
        // Don't redirect for logging or settings API calls to prevent loops
        if (!isLoggingEndpoint && !isSettingsEndpoint) {
          const currentPath = window.location.pathname;
          const isDashboardPage = currentPath.startsWith('/dashboards') || currentPath.startsWith('/playground');
          
          if (!isDashboardPage) {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
