import axiosInstance from '@/lib/api/axios-instance';
import type { LogsSettings } from '@/types/logs-settings';

export interface LogsSettingsResponse {
  success: boolean;
  data: LogsSettings;
  error?: string;
}

export const logsApi = {
  /**
   * Get logs settings for the authenticated user
   */
  async getSettings(): Promise<LogsSettingsResponse> {
    const response = await axiosInstance.get<LogsSettingsResponse>('/api/logs');
    return response.data;
  },

  /**
   * Update logs settings
   */
  async updateSettings(settings: Partial<LogsSettings>): Promise<LogsSettingsResponse> {
    const response = await axiosInstance.put<LogsSettingsResponse>('/api/logs', settings);
    return response.data;
  },
};
