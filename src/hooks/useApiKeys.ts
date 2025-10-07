import { useState, useEffect, useCallback } from 'react';
import { apiKeysApi } from '@/lib/api/api-keys-api';
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest } from '@/types/api-keys';
import { useAuth } from '@/contexts/AuthContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { logApiKeyAction } from '@/utils/logger';

interface UseApiKeysReturn {
  readonly apiKeys: readonly ApiKey[];
  readonly isLoading: boolean;
  readonly createApiKey: (request: CreateApiKeyRequest) => Promise<boolean>;
  readonly updateApiKey: (request: UpdateApiKeyRequest) => Promise<boolean>;
  readonly deleteApiKey: (id: string) => Promise<boolean>;
}

export const useApiKeys = (): UseApiKeysReturn => {
  const { session } = useAuth();
  const { settings } = useSettingsContext();
  const [apiKeys, setApiKeys] = useState<readonly ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper function to show notifications
  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success'): void => {
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({
        type: 'api_alerts',
        title,
        message,
        duration: 5000,
      });
    }
  };

  // Fetch API keys from the API
  useEffect(() => {
    const fetchApiKeys = async (): Promise<void> => {
      if (!session?.access_token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiKeysApi.getAll();
        if (response.success) {
          setApiKeys(response.data);
        }
      } catch (error) {
        // Error handled by toast notification
      } finally {
        setIsLoading(false);
      }
    };

    void fetchApiKeys();
  }, [session?.access_token]);

  const createApiKey = useCallback(async (request: CreateApiKeyRequest): Promise<boolean> => {
    try {
      // Apply default limit from settings if not specified
      const requestWithDefaults: CreateApiKeyRequest = {
        ...request,
        monthlyLimit: request.monthlyLimit || settings?.api_preferences?.default_limit || 1000,
      };

      const response = await apiKeysApi.create(requestWithDefaults);
      if (response.success) {
        setApiKeys(prev => [response.data, ...prev]);
        showNotification('API Key Created', 'API key created successfully');
        
        // Log the creation
        await logApiKeyAction('create_key', response.data.id, request.name, {
          key_type: request.type,
          monthly_limit: requestWithDefaults.monthlyLimit,
        });
        return true;
      } else {
        showNotification('API Key Creation Failed', `Failed to create API key: ${response.error}`, 'error');
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || error.message
        : 'Error creating API key';
      showNotification('API Key Creation Failed', errorMessage, 'error');
      return false;
    }
  }, [settings]);

  const updateApiKey = useCallback(async (request: UpdateApiKeyRequest): Promise<boolean> => {
    try {
      const response = await apiKeysApi.update(request);
      if (response.success) {
        setApiKeys(prev => prev.map(key => 
          key.id === request.id ? response.data : key
        ));
        showNotification('API Key Updated', 'API key updated successfully');
        // Log the update
        await logApiKeyAction('edit_key', request.id, request.name, {
          key_type: request.type,
          monthly_limit: request.monthlyLimit,
        });
        return true;
      } else {
        showNotification('API Key Update Failed', `Failed to update API key: ${response.error}`, 'error');
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || error.message
        : 'Error updating API key';
      showNotification('API Key Update Failed', errorMessage, 'error');
      return false;
    }
  }, []);

  const deleteApiKey = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Get the key name before deletion for logging
      const keyToDelete = apiKeys.find(key => key.id === id);
      
      const response = await apiKeysApi.delete(id);
      if (response.success) {
        setApiKeys(prev => prev.filter(key => key.id !== id));
        showNotification('API Key Deleted', 'API key deleted successfully');
        // Log the deletion
        await logApiKeyAction('delete_key', id, keyToDelete?.name, {
          key_type: keyToDelete?.type,
        });
        return true;
      } else {
        showNotification('API Key Deletion Failed', `Failed to delete API key: ${response.error}`, 'error');
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || error.message
        : 'Error deleting API key';
      showNotification('API Key Deletion Failed', errorMessage, 'error');
      return false;
    }
  }, [apiKeys]);

  return {
    apiKeys,
    isLoading,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  };
};