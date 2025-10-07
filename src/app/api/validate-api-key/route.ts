import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../../../utils/api-key-validation';

// POST /api/validate-api-key - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    const validationResult = await validateApiKey(apiKey);

    if (!validationResult.isValid) {
      if (validationResult.error === 'API key is required') {
        return NextResponse.json(
          { success: false, error: validationResult.error },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        success: true,
        isValid: false,
        message: validationResult.error
      });
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      message: 'Valid API key, /protected can be accessed',
      data: {
        id: validationResult.apiKeyData!.id,
        name: validationResult.apiKeyData!.name,
        type: validationResult.apiKeyData!.type,
        usage: validationResult.apiKeyData!.usage,
        monthlyLimit: validationResult.apiKeyData!.monthly_limit
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
