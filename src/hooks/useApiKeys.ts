import { useState, useEffect } from 'react';
import axios from 'axios';
import { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest, ToastMessage } from '@/types/api-keys';
import { showToast } from '@/utils/api-keys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch API keys from the API
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get('/api/api-keys');
        if (response.data.success) {
          setApiKeys(response.data.data);
        } else {
          console.error('Failed to fetch API keys:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const createApiKey = async (request: CreateApiKeyRequest): Promise<boolean> => {
    try {
      const response = await axios.post('/api/api-keys', request);
      if (response.data.success) {
        setApiKeys(prev => [response.data.data, ...prev]);
        showToast('API key created successfully', 'success', setToast);
        return true;
      } else {
        console.error('Failed to create API key:', response.data.error);
        showToast('Failed to create API key: ' + response.data.error, 'error', setToast);
        return false;
      }
    } catch (error: any) {
      console.error('Error creating API key:', error);
      const errorMessage = error.response?.data?.error || 'Error creating API key';
      showToast(errorMessage, 'error', setToast);
      return false;
    }
  };

  const updateApiKey = async (request: UpdateApiKeyRequest): Promise<boolean> => {
    try {
      const response = await axios.put('/api/api-keys', request);
      if (response.data.success) {
        setApiKeys(prev => 
          prev.map(key => 
            key.id === request.id ? { ...response.data.data } : key
          )
        );
        showToast('API key updated successfully', 'success', setToast);
        return true;
      } else {
        showToast('Failed to update API key: ' + response.data.error, 'error', setToast);
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error updating API key';
      showToast(errorMessage, 'error', setToast);
      return false;
    }
  };

  const toggleApiKey = async (id: string): Promise<boolean> => {
    try {
      const key = apiKeys.find(k => k.id === id);
      if (!key) return false;

      const response = await axios.put('/api/api-keys', { id, isActive: !key.is_active });
      if (response.data.success) {
        setApiKeys(prev => 
          prev.map(k => 
            k.id === id ? { ...k, is_active: !k.is_active } : k
          )
        );
        return true;
      } else {
        console.error('Failed to toggle API key:', response.data.error);
        showToast('Failed to toggle API key: ' + response.data.error, 'error', setToast);
        return false;
      }
    } catch (error: any) {
      console.error('Error toggling API key:', error);
      const errorMessage = error.response?.data?.error || 'Error toggling API key';
      showToast(errorMessage, 'error', setToast);
      return false;
    }
  };

  const deleteApiKey = async (id: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`/api/api-keys?id=${id}`);
      if (response.data.success) {
        setApiKeys(prev => prev.filter(key => key.id !== id));
        showToast('API key deleted successfully', 'success', setToast);
        return true;
      } else {
        console.error('Failed to delete API key:', response.data.error);
        showToast('Failed to delete API key: ' + response.data.error, 'error', setToast);
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting API key:', error);
      const errorMessage = error.response?.data?.error || 'Error deleting API key';
      showToast(errorMessage, 'error', setToast);
      return false;
    }
  };

  return {
    apiKeys,
    isLoading,
    toast,
    setToast,
    createApiKey,
    updateApiKey,
    toggleApiKey,
    deleteApiKey,
  };
};
