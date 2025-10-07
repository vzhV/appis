import axiosInstance from '@/lib/api/axios-instance';
import type { 
  CreateApiKeyRequest, 
  UpdateApiKeyRequest, 
  ApiKeyResponse, 
  ApiKeysListResponse 
} from '@/types/api-keys';

export const apiKeysApi = {
  /**
   * Get all API keys for the authenticated user
   */
  async getAll(): Promise<ApiKeysListResponse> {
    const response = await axiosInstance.get<ApiKeysListResponse>('/api/api-keys');
    return response.data;
  },

  /**
   * Create a new API key
   */
  async create(request: CreateApiKeyRequest): Promise<ApiKeyResponse> {
    const response = await axiosInstance.post<ApiKeyResponse>('/api/api-keys', request);
    return response.data;
  },

  /**
   * Update an existing API key
   */
  async update(request: UpdateApiKeyRequest): Promise<ApiKeyResponse> {
    const response = await axiosInstance.put<ApiKeyResponse>('/api/api-keys', request);
    return response.data;
  },

  /**
   * Delete an API key by ID
   */
  async delete(id: string): Promise<ApiKeyResponse> {
    const response = await axiosInstance.delete<ApiKeyResponse>(`/api/api-keys?id=${id}`);
    return response.data;
  },

  /**
   * Validate an API key
   */
  async validate(key: string): Promise<{ valid: boolean; message?: string }> {
    const response = await axiosInstance.post<{ valid: boolean; message?: string }>('/api/validate-api-key', { key });
    return response.data;
  },
};
