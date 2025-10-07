// Types for Activity Logs and Settings
export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    api_alerts: boolean;
  };
  api_preferences: {
    default_limit: number;
    auto_refresh: boolean;
  };
  dashboard_preferences: {
    default_view: 'overview' | 'keys' | 'analytics';
    items_per_page: number;
  };
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface LogFilters {
  action?: string;
  resource_type?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface CreateLogRequest {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: Partial<UserSettings['notifications']>;
  api_preferences?: Partial<UserSettings['api_preferences']>;
  dashboard_preferences?: Partial<UserSettings['dashboard_preferences']>;
}

// Log action types
export type LogAction = 
  | 'create_key'
  | 'edit_key'
  | 'delete_key'
  | 'toggle_key'
  | 'login'
  | 'logout'
  | 'update_settings'
  | 'view_dashboard'
  | 'view_keys'
  | 'view_analytics'
  | 'view_logs'
  | 'api_request'
  | 'api_limit_reached'
  | 'api_error';

export type ResourceType = 
  | 'api_key'
  | 'user'
  | 'settings'
  | 'dashboard'
  | 'analytics'
  | 'logs';
