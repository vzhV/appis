export interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'development' | 'production';
  usage: number;
  monthly_limit?: number;
  created_at: string;
  last_used?: string;
  is_active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  type: 'development' | 'production';
  monthlyLimit?: number | null;
}

export interface UpdateApiKeyRequest {
  id: string;
  name: string;
  type: 'development' | 'production';
  monthlyLimit?: number | null;
  isActive: boolean;
}

export interface ApiKeyResponse {
  success: boolean;
  data: ApiKey;
  error?: string;
}

export interface ApiKeysListResponse {
  success: boolean;
  data: ApiKey[];
  error?: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}
