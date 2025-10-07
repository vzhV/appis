export type ApiKeyType = 'development' | 'production';

export type ToastType = 'success' | 'error';

export interface ApiKey {
  readonly id: string;
  readonly name: string;
  readonly key: string;
  readonly type: ApiKeyType;
  readonly usage: number;
  readonly monthly_limit?: number | null;
  readonly created_at: string;
  readonly last_used?: string | null;
  readonly is_active: boolean;
}

export interface CreateApiKeyRequest {
  readonly name: string;
  readonly type: ApiKeyType;
  readonly monthlyLimit?: number | null;
}

export interface UpdateApiKeyRequest {
  readonly id: string;
  readonly name: string;
  readonly type: ApiKeyType;
  readonly monthlyLimit?: number | null;
  readonly isActive: boolean;
}

export interface ApiKeyResponse {
  readonly success: boolean;
  readonly data: ApiKey;
  readonly error?: string;
}

export interface ApiKeysListResponse {
  readonly success: boolean;
  readonly data: readonly ApiKey[];
  readonly error?: string;
}

export interface ToastMessage {
  readonly message: string;
  readonly type: ToastType;
}
