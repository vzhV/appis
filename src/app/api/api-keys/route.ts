import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

// GET /api/api-keys - Get all API keys
export async function GET(request: NextRequest) {
  try {
    const { data: apiKeys, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch API keys' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: apiKeys });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
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

    const generateApiKey = () => {
      const prefix = type === 'production' ? 'ak_prod_' : 'ak_dev_';
      const randomString = Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
      return prefix + randomString;
    };

    const newApiKeyData = {
      name: name.trim(),
      key: generateApiKey(),
      type: type,
      usage: 0,
      monthly_limit: monthlyLimit || null,
      is_active: true,
    };

    const { data: newApiKey, error } = await supabaseAdmin
      .from('api_keys')
      .insert(newApiKeyData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: newApiKey }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// PUT /api/api-keys - Update an API key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, type, monthlyLimit, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
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

    const { data: updatedApiKey, error } = await supabaseAdmin
      .from('api_keys')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
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
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data: deletedApiKey, error } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
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
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}