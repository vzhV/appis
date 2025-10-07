'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationLayout from '@/components/layout/NavigationLayout';

interface ValidationResult {
  isValid: boolean;
  message: string;
  data?: {
    id: string;
    name: string;
    type: string;
    usage: number;
    monthlyLimit?: number;
  };
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={
      <NavigationLayout 
        pageTitle="Protected Area" 
        pageSubtitle="Pages / Protected"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
              <p className="text-gray-600">
                Please wait while we process your request...
              </p>
            </div>
          </div>
        </div>
      </NavigationLayout>
    }>
      <ProtectedPageContent />
    </Suspense>
  );
}

function ProtectedPageContent() {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters for validation result
    const isValid = searchParams.get('valid');
    const message = searchParams.get('message');
    
    if (!isValid || !message) {
      // No validation parameters found, redirect to playground
      router.push('/playground');
      return;
    }

    const decodedMessage = decodeURIComponent(message);
    const isValidBool = isValid === 'true';
    
    const result: ValidationResult = {
      isValid: isValidBool,
      message: decodedMessage
    };
    
    setValidationResult(result);
    
    // Show notification
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({
        type: 'api_alerts',
        title: isValidBool ? 'API Key Valid' : 'API Key Invalid',
        message: result.message,
        duration: 5000,
      });
    }
  }, [router, searchParams]);

  const handleGoBack = () => {
    router.push('/playground');
  };


  return (
    <NavigationLayout 
      pageTitle="Protected Area" 
      pageSubtitle="Pages / Protected"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              validationResult?.isValid 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              {validationResult?.isValid ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Protected Area</h2>
            <p className="text-gray-600">
              {validationResult?.isValid 
                ? 'Welcome! Your API key is valid and you can access this protected area.'
                : 'Access denied. Your API key is not valid.'
              }
            </p>
          </div>

          <div className={`p-4 rounded-lg border mb-6 ${
            validationResult?.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              {validationResult?.isValid ? (
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div>
                <h3 className={`text-sm font-medium mb-1 ${
                  validationResult?.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  Validation Result
                </h3>
                <p className={`text-sm ${
                  validationResult?.isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {validationResult?.message}
                </p>
              </div>
            </div>
          </div>

          {validationResult?.isValid && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Protected Content</h3>
              <p className="text-sm text-blue-700 mb-3">
                This is a protected area that requires a valid API key to access. 
                Your API key has been validated and you can now make authenticated requests to our protected endpoints.
              </p>
              
              {validationResult.data && (
                <div className="bg-white rounded border border-blue-200 p-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="ml-2 text-gray-800">{validationResult.data.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="ml-2 text-gray-800 capitalize">{validationResult.data.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Usage:</span>
                      <span className="ml-2 text-gray-800">{validationResult.data.usage}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Monthly Limit:</span>
                      <span className="ml-2 text-gray-800">
                        {validationResult.data.monthlyLimit ? validationResult.data.monthlyLimit : 'Unlimited'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Try Another Key
            </button>
            {validationResult?.isValid && (
              <button
                onClick={() => router.push('/dashboards')}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
}
