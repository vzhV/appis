import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase';

export interface AuthenticatedUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface AuthMiddlewareResult {
  user: AuthenticatedUser | null;
  error: string | null;
  status: number;
}

/**
 * Middleware to authenticate users from request headers
 * @param request - The NextRequest object
 * @returns Promise<AuthMiddlewareResult>
 */
export async function authenticateUser(request: NextRequest): Promise<AuthMiddlewareResult> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: 'Authentication required. Please provide a valid Bearer token.',
        status: 401
      };
    }

    const token = authHeader.substring(7);
    
    if (!supabaseAdmin) {
      return {
        user: null,
        error: 'Server configuration error.',
        status: 500
      };
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return {
        user: null,
        error: 'Invalid authentication token.',
        status: 401
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata || {}
      },
      error: null,
      status: 200
    };
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return {
      user: null,
      error: 'Authentication failed.',
      status: 500
    };
  }
}

/**
 * Helper function to create unauthorized response
 */
export function createUnauthorizedResponse(message: string = 'Authentication required') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Helper function to create forbidden response
 */
export function createForbiddenResponse(message: string = 'Access denied') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}
