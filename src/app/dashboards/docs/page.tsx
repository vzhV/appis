'use client';

import NavigationLayout from '@/components/layout/NavigationLayout';

export default function DocumentationPage() {
  return (
    <NavigationLayout pageTitle="API Documentation" pageSubtitle="Pages / Documentation">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            API Documentation
          </h2>
          <p className="text-gray-600">
            Comprehensive documentation for integrating with our API. Find examples, guides, and reference materials.
          </p>
        </div>
      </div>
    </NavigationLayout>
  );
}
