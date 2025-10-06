'use client';

import NavigationLayout from '@/components/layout/NavigationLayout';

export default function AnalyticsPage() {
  return (
    <NavigationLayout pageTitle="Analytics Dashboard" pageSubtitle="Pages / Analytics">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            View detailed analytics about your API usage, performance metrics, and insights.
          </p>
        </div>
      </div>
    </NavigationLayout>
  );
}
