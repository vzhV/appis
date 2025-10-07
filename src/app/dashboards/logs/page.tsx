'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NavigationLayout from '@/components/layout/NavigationLayout';
import { useLogs } from '@/hooks/useLogsSettings';
import { LogFilters } from '@/types/logs-settings';
import { logPageView } from '@/utils/logger';

function LogsContent() {
  const { logs, isLoading, error, hasMore, loadLogs, loadMore } = useLogs();
  const [filters, setFilters] = useState<LogFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Log page view
  useEffect(() => {
    logPageView('logs');
  }, []);

  const handleFilterChange = (key: keyof LogFilters, value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value as any;
    }
    setFilters(newFilters);
  };

  const applyFilters = () => {
    loadLogs({ ...filters, limit: 20, offset: 0 });
  };

  const clearFilters = () => {
    setFilters({});
    loadLogs({ limit: 20, offset: 0 });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActionDisplay = (action: string) => {
    const actionMap: Record<string, { label: string; color: string; icon: string; bgColor: string }> = {
      create_key: { 
        label: 'Created API Key', 
        color: 'text-green-400', 
        icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
        bgColor: 'bg-green-500/10 border-green-400/30'
      },
      edit_key: { 
        label: 'Updated API Key', 
        color: 'text-blue-400', 
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
        bgColor: 'bg-blue-500/10 border-blue-400/30'
      },
      delete_key: { 
        label: 'Deleted API Key', 
        color: 'text-red-400', 
        icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        bgColor: 'bg-red-500/10 border-red-400/30'
      },
      toggle_key: { 
        label: 'Toggled API Key', 
        color: 'text-yellow-400', 
        icon: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v4a2 2 0 002 2h2a2 2 0 002-2V7m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2',
        bgColor: 'bg-yellow-500/10 border-yellow-400/30'
      },
      login: { 
        label: 'Signed In', 
        color: 'text-green-400', 
        icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
        bgColor: 'bg-green-500/10 border-green-400/30'
      },
      logout: { 
        label: 'Signed Out', 
        color: 'text-gray-400', 
        icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
        bgColor: 'bg-gray-500/10 border-gray-400/30'
      },
      update_settings: { 
        label: 'Updated Settings', 
        color: 'text-purple-400', 
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
        bgColor: 'bg-purple-500/10 border-purple-400/30'
      },
      view_dashboard: { 
        label: 'Viewed Dashboard', 
        color: 'text-blue-400', 
        icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4',
        bgColor: 'bg-blue-500/10 border-blue-400/30'
      },
      view_keys: { 
        label: 'Viewed API Keys', 
        color: 'text-blue-400', 
        icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z',
        bgColor: 'bg-blue-500/10 border-blue-400/30'
      },
      view_analytics: { 
        label: 'Viewed Analytics', 
        color: 'text-blue-400', 
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        bgColor: 'bg-blue-500/10 border-blue-400/30'
      },
      view_logs: { 
        label: 'Viewed Activity Logs', 
        color: 'text-blue-400', 
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-blue-500/10 border-blue-400/30'
      },
      api_request: { 
        label: 'API Request', 
        color: 'text-cyan-400', 
        icon: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
        bgColor: 'bg-cyan-500/10 border-cyan-400/30'
      },
      api_limit_reached: { 
        label: 'API Limit Reached', 
        color: 'text-orange-400', 
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
        bgColor: 'bg-orange-500/10 border-orange-400/30'
      },
      api_error: { 
        label: 'API Error', 
        color: 'text-red-400', 
        icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-red-500/10 border-red-400/30'
      },
    };
    return actionMap[action] || { 
      label: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
      color: 'text-gray-400', 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-gray-500/10 border-gray-400/30'
    };
  };

  const getResourceTypeDisplay = (resourceType: string) => {
    const resourceMap: Record<string, string> = {
      api_key: 'API Key',
      user: 'User Account',
      settings: 'Settings',
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      logs: 'Activity Logs',
    };
    return resourceMap[resourceType] || resourceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // const _getActionIcon = (action: string) => {
    const icons: Record<string, string> = {
      create_key: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      edit_key: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      delete_key: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      toggle_key: 'M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v4a2 2 0 002 2h2a2 2 0 002-2V7m-6 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2',
      login: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
      logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
      update_settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      view_dashboard: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4',
      view_keys: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z',
      view_analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      view_logs: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      api_request: 'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      api_limit_reached: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
      api_error: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return icons[action] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  };

  return (
    <ProtectedRoute>
      <NavigationLayout pageTitle="Activity Logs" pageSubtitle="Pages / Logs">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Activity Logs</h2>
                <p className="text-gray-300">
                  Monitor all activities and track changes across your account.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{logs.length}</div>
                  <div className="text-sm text-gray-400">Total Logs</div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Logs</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Action</label>
                  <select
                    value={filters.action || ''}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Actions</option>
                    <option value="create_key">Create Key</option>
                    <option value="edit_key">Edit Key</option>
                    <option value="delete_key">Delete Key</option>
                    <option value="toggle_key">Toggle Key</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                    <option value="update_settings">Update Settings</option>
                    <option value="view_dashboard">View Dashboard</option>
                    <option value="view_keys">View Keys</option>
                    <option value="view_analytics">View Analytics</option>
                    <option value="view_logs">View Logs</option>
                    <option value="api_request">API Request</option>
                    <option value="api_limit_reached">API Limit Reached</option>
                    <option value="api_error">API Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Resource Type</label>
                  <select
                    value={filters.resource_type || ''}
                    onChange={(e) => handleFilterChange('resource_type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    <option value="api_key">API Key</option>
                    <option value="user">User</option>
                    <option value="settings">Settings</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="analytics">Analytics</option>
                    <option value="logs">Logs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Logs List */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-700/50">
            {isLoading && logs.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="text-red-400 mb-2">Error loading logs</div>
                <div className="text-gray-400 text-sm">{error}</div>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-400 mb-2">No logs found</div>
                <div className="text-gray-500 text-sm">Activity logs will appear here as you use the application.</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {logs.map((log) => {
                  const actionDisplay = getActionDisplay(log.action);
                  return (
                    <div key={log.id} className="p-6 hover:bg-gray-700/30 transition-colors group">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl ${actionDisplay.bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
                            <svg className={`w-6 h-6 ${actionDisplay.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={actionDisplay.icon} />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-white font-semibold text-lg">
                                  {actionDisplay.label}
                                </h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionDisplay.bgColor} ${actionDisplay.color}`}>
                                  {getResourceTypeDisplay(log.resource_type)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                <span className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{formatDate(log.created_at)}</span>
                                </span>
                                {log.ip_address && (
                                  <span className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                                    </svg>
                                    <span>{log.ip_address}</span>
                                  </span>
                                )}
                                {log.resource_id && (
                                  <span className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    <span className="font-mono text-xs">{log.resource_id.slice(0, 8)}...</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                              <div className="flex items-center space-x-2 mb-2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-gray-300 text-sm font-medium">Details</span>
                              </div>
                              <div className="text-gray-300 text-sm">
                                <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-800/50 p-3 rounded border">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && logs.length > 0 && (
              <div className="p-6 border-t border-gray-700/50 text-center">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </NavigationLayout>
    </ProtectedRoute>
  );
}

export default function LogsPage() {
  return <LogsContent />;
}
