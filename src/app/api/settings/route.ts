import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { UpdateSettingsRequest } from '@/types/logs-settings';

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
  } catch (err) {
    console.error('Error getting user from token:', err);
    return null;
  }
}

// GET /api/settings - Get user settings
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

    // Try to get existing settings
    let settings;
    const { data: existingSettings, error: settingsError } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If no settings exist, create default ones
    if (settingsError && settingsError.code === 'PGRST116') {
      const { data: newSettings, error: createError } = await supabaseAdmin
        .from('user_settings')
        .insert({
          user_id: user.id,
          theme: 'dark',
          notifications: {
            email: true,
            push: true,
            api_alerts: true
          },
          api_preferences: {
            default_limit: 1000,
            auto_refresh: true
          },
          dashboard_preferences: {
            default_view: 'overview',
            items_per_page: 10
          }
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { success: false, error: 'Failed to create settings' },
          { status: 500 }
        );
      }

      settings = newSettings;
    } else if (settingsError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch settings' },
        { status: 500 }
      );
    } else {
      settings = existingSettings;
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
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

    const body: UpdateSettingsRequest = await request.json();
    const { theme, notifications, api_preferences, dashboard_preferences } = body;

    // Get current settings first
    const { data: currentSettings, error: fetchError } = await supabaseAdmin
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch current settings' },
        { status: 500 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (theme !== undefined) updateData.theme = theme;
    if (notifications !== undefined) {
      updateData.notifications = {
        ...(currentSettings?.notifications || {}),
        ...notifications
      };
    }
    if (api_preferences !== undefined) {
      updateData.api_preferences = {
        ...(currentSettings?.api_preferences || {}),
        ...api_preferences
      };
    }
    if (dashboard_preferences !== undefined) {
      updateData.dashboard_preferences = {
        ...(currentSettings?.dashboard_preferences || {}),
        ...dashboard_preferences
      };
    }

    // Update or create settings
    let result;
    if (currentSettings) {
      const { data, error } = await supabaseAdmin
        .from('user_settings')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to update settings' },
          { status: 500 }
        );
      }
      result = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from('user_settings')
        .insert({
          user_id: user.id,
          theme: theme || 'dark',
          notifications: {
            email: true,
            push: true,
            api_alerts: true,
            ...notifications
          },
          api_preferences: {
            default_limit: 1000,
            auto_refresh: true,
            ...api_preferences
          },
          dashboard_preferences: {
            default_view: 'overview',
            items_per_page: 10,
            ...dashboard_preferences
          }
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { success: false, error: 'Failed to create settings' },
          { status: 500 }
        );
      }
      result = data;
    }

    // Log the settings update
    await supabaseAdmin
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action: 'update_settings',
        resource_type: 'settings',
        details: { updated_fields: Object.keys(updateData) },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
