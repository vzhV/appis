'use client';

import { useState, useEffect } from 'react';
import { ActivityLog, LogFilters, CreateLogRequest, UserSettings, UpdateSettingsRequest } from '@/types/logs-settings';
import { authenticatedFetch, getAuthHeaders } from '@/lib/api/auth-helpers';

interface UseLogsResult {
  logs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadLogs: (filters?: LogFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  createLog: (logData: CreateLogRequest) => Promise<boolean>;
}

export function useLogs(): UseLogsResult {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<LogFilters>({
    limit: 20,
    offset: 0
  });

  const loadLogs = async (filters?: LogFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.action) queryParams.append('action', filters.action);
      if (filters?.resource_type) queryParams.append('resource_type', filters.resource_type);
      if (filters?.date_from) queryParams.append('date_from', filters.date_from);
      if (filters?.date_to) queryParams.append('date_to', filters.date_to);
      queryParams.append('limit', String(filters?.limit || 20));
      queryParams.append('offset', String(filters?.offset || 0));

      const response = await authenticatedFetch(`/api/logs?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const result = await response.json();
      
      if (result.success) {
        setLogs(result.data);
        setHasMore(result.pagination.hasMore);
        setCurrentFilters(filters || { limit: 20, offset: 0 });
      } else {
        throw new Error(result.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextOffset = currentFilters.offset! + currentFilters.limit!;
      const queryParams = new URLSearchParams();
      if (currentFilters.action) queryParams.append('action', currentFilters.action);
      if (currentFilters.resource_type) queryParams.append('resource_type', currentFilters.resource_type);
      if (currentFilters.date_from) queryParams.append('date_from', currentFilters.date_from);
      if (currentFilters.date_to) queryParams.append('date_to', currentFilters.date_to);
      queryParams.append('limit', String(currentFilters.limit));
      queryParams.append('offset', String(nextOffset));

      const response = await authenticatedFetch(`/api/logs?${queryParams}`);

      if (!response.ok) {
        throw new Error('Failed to fetch more logs');
      }

      const result = await response.json();
      
      if (result.success) {
        setLogs(prev => [...prev, ...result.data]);
        setHasMore(result.pagination.hasMore);
        setCurrentFilters(prev => ({ ...prev, offset: nextOffset }));
      } else {
        throw new Error(result.error || 'Failed to fetch more logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createLog = async (logData: CreateLogRequest): Promise<boolean> => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        throw new Error('Failed to create log');
      }

      const result = await response.json();
      return result.success;
    } catch (err) {
      console.error('Error creating log:', err);
      return false;
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return {
    logs,
    isLoading,
    error,
    hasMore,
    loadLogs,
    loadMore,
    createLog,
  };
}

interface UseSettingsResult {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: UpdateSettingsRequest) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch('/api/settings');

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: UpdateSettingsRequest): Promise<boolean> => {
    try {
      const response = await authenticatedFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const result = await response.json();
      
      if (result.success) {
        setSettings(result.data);
        return true;
      } else {
        throw new Error(result.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings,
  };
}
