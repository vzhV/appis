import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

// POST /api/validate-api-key - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Query Supabase to check if the API key exists and is active
    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select('id, name, key, type, is_active, usage, monthly_limit, last_used')
      .eq('key', apiKey.trim())
      .eq('is_active', true)
      .single();

    if (error) {
      // If no record found, it's an invalid key
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          isValid: false,
          message: 'Invalid API key'
        });
      }
      
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to validate API key' },
        { status: 500 }
      );
    }

    if (!apiKeyData) {
      return NextResponse.json({
        success: true,
        isValid: false,
        message: 'Invalid API key'
      });
    }

    // Check if API key has exceeded monthly limit (if set)
    if (apiKeyData.monthly_limit && apiKeyData.usage >= apiKeyData.monthly_limit) {
      return NextResponse.json({
        success: true,
        isValid: false,
        message: 'API key has exceeded monthly limit'
      });
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

    return NextResponse.json({
      success: true,
      isValid: true,
      message: 'Valid API key, /protected can be accessed',
      data: {
        id: apiKeyData.id,
        name: apiKeyData.name,
        type: apiKeyData.type,
        usage: apiKeyData.usage + 1,
        monthlyLimit: apiKeyData.monthly_limit
      }
    });

  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
