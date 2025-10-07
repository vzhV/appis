import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest): Promise<any | null> {
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
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// GET /api/api-keys - Get user's API keys only
export async function GET(request: NextRequest): Promise<NextResponse> {
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

    const { data: apiKeys, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch API keys' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: apiKeys });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, type, monthlyLimit } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!type || !['development', 'production'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Type must be either development or production' },
        { status: 400 }
      );
    }

    const generateApiKey = (): string => {
      const prefix = type === 'production' ? 'ak_prod_' : 'ak_dev_';
      const randomString = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      return prefix + randomString;
    };

    const newApiKeyData = {
      name: name.trim(),
      key: generateApiKey(),
      type,
      usage: 0,
      monthly_limit: monthlyLimit || null,
      is_active: true,
      user_id: user.id, // Associate with the authenticated user
    };

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Use supabaseAdmin to bypass RLS for API key creation
    const { data: newApiKey, error } = await supabaseAdmin
      .from('api_keys')
      .insert(newApiKeyData)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: newApiKey }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// PUT /api/api-keys - Update an API key
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, type, monthlyLimit, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    // First verify the API key belongs to the user
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { data: existingKey, error: fetchError } = await supabaseAdmin
      .from('api_keys')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    if (existingKey.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: 'Name must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (type !== undefined) {
      if (!['development', 'production'].includes(type)) {
        return NextResponse.json(
          { success: false, error: 'Type must be either development or production' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (monthlyLimit !== undefined) {
      if (monthlyLimit !== null && (typeof monthlyLimit !== 'number' || monthlyLimit < 1)) {
        return NextResponse.json(
          { success: false, error: 'Monthly limit must be a positive number or null' },
          { status: 400 }
        );
      }
      updateData.monthly_limit = monthlyLimit;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return NextResponse.json(
          { success: false, error: 'isActive must be a boolean' },
          { status: 400 }
        );
      }
      updateData.is_active = isActive;
    }

    const { data: updatedApiKey, error } = await supabaseAdmin!
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id) // Double-check user ownership
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to update API key' },
        { status: 500 }
      );
    }

    if (!updatedApiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedApiKey });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys - Delete an API key
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data: deletedApiKey, error } = await supabaseAdmin!
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Only delete user's own API keys
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete API key' },
        { status: 500 }
      );
    }

    if (!deletedApiKey) {
      return NextResponse.json(
        { success: false, error: 'API key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedApiKey });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}