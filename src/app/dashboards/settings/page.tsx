'use client';

import NavigationLayout from '@/components/layout/NavigationLayout';

export default function SettingsPage() {
  return (
    <NavigationLayout pageTitle="Account Settings" pageSubtitle="Pages / Settings">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Account Settings
          </h2>
          <p className="text-gray-600">
            Manage your account preferences, billing information, and security settings.
          </p>
        </div>
      </div>
    </NavigationLayout>
  );
}
