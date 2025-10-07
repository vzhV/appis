import axiosInstance from '@/lib/api/axios-instance';

export interface SettingsResponse {
  success: boolean;
  data: any;
  error?: string;
}

export const settingsApi = {
  /**
   * Get user settings
   */
  async getSettings(): Promise<SettingsResponse> {
    const response = await axiosInstance.get<SettingsResponse>('/api/settings');
    return response.data;
  },

  /**
   * Update user settings
   */
  async updateSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    const response = await axiosInstance.put<SettingsResponse>('/api/settings', settings);
    return response.data;
  },
};
