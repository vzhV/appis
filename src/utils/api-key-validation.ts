import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase';
import { AuthenticatedUser } from './auth-middleware';

export interface ApiKeyValidationResult {
  isValid: boolean;
  apiKeyData?: {
    id: string;
    name: string;
    key: string;
    type: string;
    is_active: boolean;
    usage: number;
    monthly_limit: number | null;
    last_used: string | null;
    user_id: string;
  };
  error?: string;
}

/**
 * Validates an API key from the request headers
 * @param request - The NextRequest object
 * @returns Promise<ApiKeyValidationResult>
 */
export async function validateApiKeyFromHeader(request: NextRequest): Promise<ApiKeyValidationResult> {
  try {
    // Get API key from x-api-key header
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return {
        isValid: false,
        error: 'API key is required'
      };
    }

    return await validateApiKey(apiKey.trim());
  } catch (error) {
    console.error('Error validating API key from header:', error);
    return {
      isValid: false,
      error: 'Failed to validate API key'
    };
  }
}

/**
 * Validates an API key string (public validation - no user check)
 * @param apiKey - The API key string to validate
 * @returns Promise<ApiKeyValidationResult>
 */
export async function validateApiKey(apiKey: string): Promise<ApiKeyValidationResult> {
  try {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return {
        isValid: false,
        error: 'API key is required'
      };
    }

    if (!supabaseAdmin) {
      return {
        isValid: false,
        error: 'Database connection not available'
      };
    }

    // Query Supabase to check if the API key exists and is active
    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, key, type, is_active, usage, monthly_limit, last_used, user_id')
      .eq('key', apiKey.trim())
      .eq('is_active', true)
      .single();

    if (error) {
      // If no record found, it's an invalid key
      if (error.code === 'PGRST116') {
        return {
          isValid: false,
          error: 'Invalid API key'
        };
      }
      
      console.error('Supabase error:', error);
      return {
        isValid: false,
        error: 'Failed to validate API key'
      };
    }

    if (!apiKeyData) {
      return {
        isValid: false,
        error: 'Invalid API key'
      };
    }

    if (apiKeyData.monthly_limit && apiKeyData.usage >= apiKeyData.monthly_limit) {
      return {
        isValid: false,
        error: 'API key has exceeded monthly limit'
      };
    }

    // Update last_used timestamp and increment usage
    const { error: updateError } = await supabaseAdmin
      .from('api_keys')
      .update({
        last_used: new Date().toISOString(),
        usage: apiKeyData.usage + 1
      })
      .eq('id', apiKeyData.id);

    if (updateError) {
      console.error('Error updating API key usage:', updateError);
      // Don't fail the validation if usage update fails
    }

    return {
      isValid: true,
      apiKeyData: {
        ...apiKeyData,
        usage: apiKeyData.usage + 1 // Return updated usage count
      }
    };

  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      isValid: false,
      error: 'Failed to validate API key'
    };
  }
}

/**
 * Validates an API key string with user ownership check
 * @param apiKey - The API key string to validate
 * @param user - The authenticated user
 * @returns Promise<ApiKeyValidationResult>
 */
export async function validateApiKeyForUser(apiKey: string, user: AuthenticatedUser): Promise<ApiKeyValidationResult> {
  try {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return {
        isValid: false,
        error: 'API key is required'
      };
    }

    if (!supabaseAdmin) {
      return {
        isValid: false,
        error: 'Database connection not available'
      };
    }

    // Query Supabase to check if the API key exists, is active, and belongs to the user
    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, key, type, is_active, usage, monthly_limit, last_used, user_id')
      .eq('key', apiKey.trim())
      .eq('is_active', true)
      .eq('user_id', user.id)
      .single();

    if (error) {
      // If no record found, it's an invalid key or doesn't belong to user
      if (error.code === 'PGRST116') {
        return {
          isValid: false,
          error: 'Invalid API key or access denied'
        };
      }
      
      console.error('Supabase error:', error);
      return {
        isValid: false,
        error: 'Failed to validate API key'
      };
    }

    if (!apiKeyData) {
      return {
        isValid: false,
        error: 'Invalid API key or access denied'
      };
    }

    if (apiKeyData.monthly_limit && apiKeyData.usage >= apiKeyData.monthly_limit) {
      return {
        isValid: false,
        error: 'API key has exceeded monthly limit'
      };
    }

    // Update last_used timestamp and increment usage
    const { error: updateError } = await supabaseAdmin
      .from('api_keys')
      .update({
        last_used: new Date().toISOString(),
        usage: apiKeyData.usage + 1
      })
      .eq('id', apiKeyData.id);

    if (updateError) {
      console.error('Error updating API key usage:', updateError);
      // Don't fail the validation if usage update fails
    }

    return {
      isValid: true,
      apiKeyData: {
        ...apiKeyData,
        usage: apiKeyData.usage + 1 // Return updated usage count
      }
    };

  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      isValid: false,
      error: 'Failed to validate API key'
    };
  }
}

/**
 * Creates a standardized error response for API key validation failures
 * @param validationResult - The validation result
 * @returns NextResponse with appropriate error status
 */
export function createApiKeyErrorResponse(validationResult: ApiKeyValidationResult): NextResponse {
  if (validationResult.error === 'API key is required') {
    return NextResponse.json(
      { success: false, error: validationResult.error },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { success: false, error: validationResult.error },
    { status: 500 }
  );
}
