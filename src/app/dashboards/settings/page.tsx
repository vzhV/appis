'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NavigationLayout from '@/components/layout/NavigationLayout';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { UpdateSettingsRequest } from '@/types/logs-settings';
import { logUserAction, logPageView } from '@/utils/logger';

function SettingsContent() {
  const { settings, isLoading, error, updateSettings } = useSettingsContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState({
    theme: 'dark' as 'light' | 'dark' | 'auto',
    notifications: {
      email: true,
      push: true,
      api_alerts: true,
    },
    api_preferences: {
      default_limit: 1000,
      auto_refresh: true,
    },
    dashboard_preferences: {
      default_view: 'overview' as 'overview' | 'keys' | 'analytics',
      items_per_page: 10,
    },
  });

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        theme: settings.theme,
        notifications: settings.notifications,
        api_preferences: settings.api_preferences,
        dashboard_preferences: settings.dashboard_preferences,
      });
    }
  }, [settings]);

  // Log page view
  useEffect(() => {
    logPageView('settings');
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updates: UpdateSettingsRequest = {
        theme: formData.theme,
        notifications: formData.notifications,
        api_preferences: formData.api_preferences,
        dashboard_preferences: formData.dashboard_preferences,
      };

      const success = await updateSettings(updates);
      
      if (success) {
        setSaveMessage({ type: 'success', message: 'Settings saved successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
        
        // Log the settings update
        await logUserAction('update_settings', {
          updated_fields: Object.keys(updates),
          theme: updates.theme,
          notifications: updates.notifications,
          api_preferences: updates.api_preferences,
          dashboard_preferences: updates.dashboard_preferences,
        });
      } else {
        setSaveMessage({ type: 'error', message: 'Failed to save settings. Please try again.' });
      }
      } catch {
      setSaveMessage({ type: 'error', message: 'An error occurred while saving settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value,
      },
    }));
    
    // Apply theme change immediately for preview
    if (section === 'theme' && field === 'theme') {
      const root = document.documentElement;
      root.classList.remove('dark', 'light');
      
      if (value === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--theme-bg', '#111827');
        root.style.setProperty('--theme-text', '#ffffff');
        root.style.setProperty('--theme-card-bg', 'rgba(31, 41, 55, 0.8)');
        root.style.setProperty('--theme-border', 'rgba(75, 85, 99, 0.5)');
      } else if (value === 'light') {
        root.classList.add('light');
        root.style.setProperty('--theme-bg', '#ffffff');
        root.style.setProperty('--theme-text', '#111827');
        root.style.setProperty('--theme-card-bg', 'rgba(249, 250, 251, 0.8)');
        root.style.setProperty('--theme-border', 'rgba(209, 213, 219, 0.5)');
      } else if (value === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.style.setProperty('--theme-bg', '#111827');
          root.style.setProperty('--theme-text', '#ffffff');
          root.style.setProperty('--theme-card-bg', 'rgba(31, 41, 55, 0.8)');
          root.style.setProperty('--theme-border', 'rgba(75, 85, 99, 0.5)');
        } else {
          root.classList.add('light');
          root.style.setProperty('--theme-bg', '#ffffff');
          root.style.setProperty('--theme-text', '#111827');
          root.style.setProperty('--theme-card-bg', 'rgba(249, 250, 251, 0.8)');
          root.style.setProperty('--theme-border', 'rgba(209, 213, 219, 0.5)');
        }
      }
    }
  };

  const testNotification = (type: 'email' | 'push' | 'api_alerts') => {
    if ((window as any).addNotification) {
      (window as any).addNotification({
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Test`,
        message: `This is a test ${type} notification. If you can see this, ${type} notifications are enabled.`,
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <NavigationLayout pageTitle="Settings" pageSubtitle="Pages / Settings">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </NavigationLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <NavigationLayout pageTitle="Settings" pageSubtitle="Pages / Settings">
          <div className="p-6 text-center">
            <div className="text-red-400 mb-2">Error loading settings</div>
            <div className="text-gray-400 text-sm">{error}</div>
          </div>
        </NavigationLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <NavigationLayout pageTitle="Settings" pageSubtitle="Pages / Settings">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
                <p className="text-gray-300">
                  Customize your experience and manage your preferences.
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className={`p-4 rounded-lg ${
              saveMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-400/30 text-green-300' 
                : 'bg-red-500/10 border border-red-400/30 text-red-300'
            }`}>
              {saveMessage.message}
            </div>
          )}

          {/* Theme Settings */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme as any }))}
                      className={`p-3 rounded-lg border transition-colors ${
                        formData.theme === theme
                          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                          : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-sm font-medium capitalize">{theme}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {theme === 'auto' ? 'Follow system' : `${theme} theme`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Email Notifications</div>
                  <div className="text-gray-400 text-sm">Receive notifications via email</div>
                  <button
                    onClick={() => testNotification('email')}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Test Email Notification
                  </button>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Push Notifications</div>
                  <div className="text-gray-400 text-sm">Receive push notifications in browser</div>
                  <button
                    onClick={() => testNotification('push')}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Test Push Notification
                  </button>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.push}
                    onChange={(e) => handleInputChange('notifications', 'push', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">API Alerts</div>
                  <div className="text-gray-400 text-sm">Get notified about API usage and errors</div>
                  <button
                    onClick={() => testNotification('api_alerts')}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Test API Alert
                  </button>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notifications.api_alerts}
                    onChange={(e) => handleInputChange('notifications', 'api_alerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* API Preferences */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">API Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default API Key Limit</label>
                <input
                  type="number"
                  value={formData.api_preferences.default_limit}
                  onChange={(e) => handleInputChange('api_preferences', 'default_limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="1000000"
                />
                <div className="text-gray-400 text-sm mt-1">Default monthly request limit for new API keys</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">Auto Refresh</div>
                  <div className="text-gray-400 text-sm">Automatically refresh data in dashboard</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.api_preferences.auto_refresh}
                    onChange={(e) => handleInputChange('api_preferences', 'auto_refresh', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Dashboard Preferences */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Dashboard Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Default View</label>
                <select
                  value={formData.dashboard_preferences.default_view}
                  onChange={(e) => handleInputChange('dashboard_preferences', 'default_view', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">Overview</option>
                  <option value="keys">API Keys</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Items Per Page</label>
                <select
                  value={formData.dashboard_preferences.items_per_page}
                  onChange={(e) => handleInputChange('dashboard_preferences', 'items_per_page', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
        </div>
      </div>
    </NavigationLayout>
    </ProtectedRoute>
  );
}

export default function SettingsPage() {
  return <SettingsContent />;
}