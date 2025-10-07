import axiosInstance from '@/lib/api/axios-instance';
import type { UserSettings } from '@/types/logs-settings';

export interface LogsSettingsResponse {
  success: boolean;
  data: UserSettings;
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
  async updateSettings(settings: Partial<UserSettings>): Promise<LogsSettingsResponse> {
    const response = await axiosInstance.put<LogsSettingsResponse>('/api/logs', settings);
    return response.data;
  },
};
