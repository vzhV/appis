'use client';

import { LogAction, ResourceType, CreateLogRequest } from '@/types/logs-settings';

class Logger {
  private static instance: Logger;
  private isEnabled: boolean = true;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  private async getAuthHeaders(): Promise<HeadersInit | null> {
    try {
      // Get session from Supabase
      const { supabase } = await import('../../lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.warn('No authentication token available for logging');
        return null;
      }
      
      return {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.warn('Failed to get authentication headers for logging:', error);
      return null;
    }
  }

  public async log(
    action: LogAction,
    resourceType: ResourceType,
    resourceId?: string,
    details?: Record<string, any>
  ): Promise<boolean> {
    if (!this.isEnabled) {
      return true;
    }

    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        console.warn('Cannot log activity - no authentication available:', action);
        return false;
      }

      const logData: CreateLogRequest = {
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details,
      };

      const response = await fetch('/api/logs', {
        method: 'POST',
        headers,
        body: JSON.stringify(logData),
      });

      if (!response.ok) {
        console.warn('Failed to log activity:', action, 'Status:', response.status);
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Error logging activity:', error);
      return false;
    }
  }

  // Convenience methods for common actions
  public async logApiKeyAction(
    action: 'create_key' | 'edit_key' | 'delete_key' | 'toggle_key',
    keyId: string,
    keyName?: string,
    additionalDetails?: Record<string, any>
  ): Promise<boolean> {
    return this.log(action, 'api_key', keyId, {
      key_name: keyName,
      ...additionalDetails,
    });
  }

  public async logUserAction(
    action: 'login' | 'logout' | 'update_settings',
    details?: Record<string, any>
  ): Promise<boolean> {
    return this.log(action, 'user', undefined, details);
  }

  public async logPageView(
    page: 'dashboard' | 'keys' | 'analytics' | 'logs' | 'settings',
    additionalDetails?: Record<string, any>
  ): Promise<boolean> {
    // Make page view logging completely non-blocking
    // Don't wait for the result to prevent navigation issues
    this.log(`view_${page}`, page, undefined, additionalDetails).catch(() => {
      // Silently fail - page view logging should never block navigation
    });
    return true;
  }

  public async logApiRequest(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime?: number,
    additionalDetails?: Record<string, any>
  ): Promise<boolean> {
    return this.log('api_request', 'api_key', undefined, {
      endpoint,
      method,
      status_code: statusCode,
      response_time: responseTime,
      ...additionalDetails,
    });
  }

  public async logApiError(
    endpoint: string,
    method: string,
    error: string,
    additionalDetails?: Record<string, any>
  ): Promise<boolean> {
    return this.log('api_error', 'api_key', undefined, {
      endpoint,
      method,
      error,
      ...additionalDetails,
    });
  }

  public async logApiLimitReached(
    keyId: string,
    keyName?: string,
    limit?: number,
    additionalDetails?: Record<string, any>
  ): Promise<boolean> {
    return this.log('api_limit_reached', 'api_key', keyId, {
      key_name: keyName,
      limit,
      ...additionalDetails,
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export convenience functions
export const logActivity = logger.log.bind(logger);
export const logApiKeyAction = logger.logApiKeyAction.bind(logger);
export const logUserAction = logger.logUserAction.bind(logger);
export const logPageView = logger.logPageView.bind(logger);
export const logApiRequest = logger.logApiRequest.bind(logger);
export const logApiError = logger.logApiError.bind(logger);
export const logApiLimitReached = logger.logApiLimitReached.bind(logger);
