'use client';

import NavigationLayout from '@/components/layout/NavigationLayout';

export default function ApiKeysPage() {
  return (
    <NavigationLayout pageTitle="API Keys Management" pageSubtitle="Pages / API Keys">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            API Keys Management
          </h2>
          <p className="text-gray-600">
            This is the dedicated API Keys page. Here you can manage all your API keys with advanced features.
          </p>
        </div>
      </div>
    </NavigationLayout>
  );
}
