import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { LogFilters, CreateLogRequest } from '@/types/logs-settings';

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  if (!supabaseAdmin) {
    return null;
  }
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return null;
    }
    return user;
    } catch {
      console.error('Error getting user from token');
      return null;
    }
}

// GET /api/logs - Get user's activity logs
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const filters: LogFilters = {
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const action = searchParams.get('action');
    const resource_type = searchParams.get('resource_type');
    const date_from = searchParams.get('date_from');
    const date_to = searchParams.get('date_to');

    if (action) filters.action = action;
    if (resource_type) filters.resource_type = resource_type;
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;

    let query = supabaseAdmin
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.action) {
      query = query.eq('action', filters.action);
    }
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    // Apply pagination
    query = query.range(filters.offset!, filters.offset! + filters.limit! - 1);

    const { data: logs, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        limit: filters.limit,
        offset: filters.offset,
        hasMore: logs.length === filters.limit
      }
    });
    } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/logs - Create a new activity log
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const body: CreateLogRequest = await request.json();
    const { action, resource_type, resource_id, details } = body;

    if (!action || !resource_type) {
      return NextResponse.json(
        { success: false, error: 'Action and resource_type are required' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    const { data: log, error } = await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to create log' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: log
    });
    } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
