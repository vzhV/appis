'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NavigationLayout from '@/components/layout/NavigationLayout';
import Toast from '@/components/ui/Toast';
import CreateEditModal from '@/components/modals/CreateEditModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import ApiKeysTable from '@/components/dashboard/ApiKeysTable';
import { useApiKeys } from '@/hooks/useApiKeys';
import { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest } from '@/types/api-keys';
import { copyToClipboard } from '@/utils/api-keys';
import { logPageView } from '@/utils/logger';

function ApiKeysContent() {
  const { } = useAuth();
  const { settings } = useSettingsContext();
  const {
    apiKeys,
    isLoading,
    toast,
    setToast,
    createApiKey,
    updateApiKey,
    deleteApiKey,
  } = useApiKeys();

  // Log page view
  useEffect(() => {
    logPageView('keys');
  }, []);

  // Get default limit from settings
  const defaultLimit = settings?.api_preferences?.default_limit || 1000;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'development' | 'production'>('development');
  const [newKeyLimit, setNewKeyLimit] = useState(defaultLimit);
  const [hasLimit, setHasLimit] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [deleteConfirmKey, setDeleteConfirmKey] = useState<ApiKey | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    const request: CreateApiKeyRequest = {
      name: newKeyName,
      type: newKeyType,
      monthlyLimit: hasLimit ? newKeyLimit : null,
    };

    const success = await createApiKey(request);
    if (success) {
      setNewKeyName('');
      setNewKeyType('development');
      setNewKeyLimit(1000);
      setHasLimit(false);
      setShowCreateForm(false);
    }
  };

  const handleUpdateKey = async () => {
    if (!editingKey || !newKeyName.trim()) return;

    const request: UpdateApiKeyRequest = {
      id: editingKey.id,
      name: newKeyName,
      type: newKeyType,
      monthlyLimit: hasLimit ? newKeyLimit : null,
      isActive: editingKey.is_active,
    };

    const success = await updateApiKey(request);
    if (success) {
      setShowCreateForm(false);
      setEditingKey(null);
      setNewKeyName('');
      setNewKeyType('development');
      setNewKeyLimit(1000);
      setHasLimit(false);
    }
  };

  const handleEditKey = (key: ApiKey) => {
    setEditingKey(key);
    setNewKeyName(key.name);
    setNewKeyType(key.type);
    setNewKeyLimit(key.monthly_limit || 1000);
    setHasLimit(!!key.monthly_limit);
  };

  const handleDeleteKey = async (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (key) {
      setDeleteConfirmKey(key);
    }
  };

  const confirmDeleteKey = async () => {
    if (!deleteConfirmKey || deleteConfirmName !== deleteConfirmKey.name) return;

    const success = await deleteApiKey(deleteConfirmKey.id);
    if (success) {
      setDeleteConfirmKey(null);
      setDeleteConfirmName('');
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    await copyToClipboard(text, setToast);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <NavigationLayout pageTitle="API Keys Management" pageSubtitle="Pages / API Keys">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </NavigationLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <NavigationLayout pageTitle="API Keys Management" pageSubtitle="Pages / API Keys">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  API Keys Management
                </h2>
                <p className="text-gray-300">
                  Create, manage, and monitor your API keys with advanced security features.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{apiKeys.length}</div>
                  <div className="text-sm text-gray-400">Total Keys</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">
                    {apiKeys.filter(key => key.is_active).length}
                  </div>
                  <div className="text-sm text-gray-400">Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Section */}
          <ApiKeysTable
            apiKeys={apiKeys}
            onCreateKey={() => setShowCreateForm(true)}
            onEditKey={handleEditKey}
            onDeleteKey={handleDeleteKey}
            onCopyKey={handleCopyToClipboard}
          />
        </div>

        {/* Modals */}
        <CreateEditModal
          showCreateForm={showCreateForm}
          editingKey={editingKey}
          newKeyName={newKeyName}
          setNewKeyName={setNewKeyName}
          newKeyType={newKeyType}
          setNewKeyType={setNewKeyType}
          newKeyLimit={newKeyLimit}
          setNewKeyLimit={setNewKeyLimit}
          hasLimit={hasLimit}
          setHasLimit={setHasLimit}
          onClose={() => {
            setShowCreateForm(false);
            setEditingKey(null);
            setNewKeyName('');
            setNewKeyType('development');
            setNewKeyLimit(1000);
            setHasLimit(false);
          }}
          onSubmit={editingKey ? handleUpdateKey : handleCreateKey}
        />

        <DeleteConfirmationModal
          deleteConfirmKey={deleteConfirmKey}
          deleteConfirmName={deleteConfirmName}
          setDeleteConfirmName={setDeleteConfirmName}
          onClose={() => {
            setDeleteConfirmKey(null);
            setDeleteConfirmName('');
          }}
          onConfirm={confirmDeleteKey}
        />

        {/* Toast */}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </NavigationLayout>
    </ProtectedRoute>
  );
}

export default function ApiKeysPage() {
  return <ApiKeysContent />;
}
