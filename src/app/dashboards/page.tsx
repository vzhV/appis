'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useSettingsContext } from '@/contexts/SettingsContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NavigationLayout from '@/components/layout/NavigationLayout';
import CurrentPlanCard from '@/components/dashboard/CurrentPlanCard';
import Link from 'next/link';
import { logPageView } from '@/utils/logger';
import { useEffect } from 'react';

function DashboardContent() {
  const { user } = useAuth();
  const { settings } = useSettingsContext();

  // Log page view
  useEffect(() => {
    logPageView('dashboard');
  }, []);

  // Get items per page from settings
  const itemsPerPage = settings?.dashboard_preferences?.items_per_page || 10;
  // const _defaultView = settings?.dashboard_preferences?.default_view || 'overview';

  return (
    <ProtectedRoute>
      <NavigationLayout pageTitle="Dashboard Overview" pageSubtitle="Pages / Overview">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'User'}!
            </h2>
            <p className="text-gray-300">
              Here&apos;s an overview of your API management dashboard and quick access to all features.
            </p>
          </div>

          {/* Settings-aware content */}
          {settings?.dashboard_preferences?.default_view === 'keys' && (
            <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quick API Keys Overview</h3>
              <p className="text-gray-300 text-sm">
                Your default view is set to API Keys. Showing {itemsPerPage} items per page.
              </p>
            </div>
          )}

          {settings?.dashboard_preferences?.default_view === 'analytics' && (
            <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Analytics Overview</h3>
              <p className="text-gray-300 text-sm">
                Your default view is set to Analytics. Showing {itemsPerPage} items per page.
              </p>
            </div>
          )}

          {/* API Preferences Info */}
          {settings?.api_preferences && (
            <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">API Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Default Limit:</span>
                  <span className="text-white ml-2">{settings.api_preferences.default_limit || 1000} requests/month</span>
                </div>
                <div>
                  <span className="text-gray-400">Auto Refresh:</span>
                  <span className="text-white ml-2">{settings.api_preferences.auto_refresh ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link
              href="/dashboards/keys"
              className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border border-gray-700/50 hover:border-blue-400/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors mb-2">
                API Keys
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                Manage your API keys and access tokens
              </p>
            </Link>

            <Link
              href="/dashboards/analytics"
              className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50 hover:border-green-400/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors mb-2">
                Analytics
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                View usage statistics and performance metrics
              </p>
            </Link>

            <Link
              href="/playground"
              className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 border border-gray-700/50 hover:border-purple-400/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                API Playground
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                Test and debug your APIs in real-time
              </p>
            </Link>

            <Link
              href="/dashboards/logs"
              className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-orange-500/10 transition-all duration-300 border border-gray-700/50 hover:border-orange-400/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors mb-2">
                Activity Logs
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                View and monitor all account activities
              </p>
            </Link>

            <Link
              href="/dashboards/settings"
              className="group bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-gray-500/10 transition-all duration-300 border border-gray-700/50 hover:border-gray-400/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-gray-300 transition-colors mb-2">
                Settings
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                Configure your account and preferences
              </p>
            </Link>
          </div>

          {/* Current Plan Card */}
          <CurrentPlanCard />

          {/* Recent Activity */}
          <div className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-2xl p-8 border border-gray-700/50">
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">API key &quot;Production Key&quot; was created</p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">API usage limit reached for &quot;Dev Key&quot;</p>
                  <p className="text-gray-400 text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Account settings updated</p>
                  <p className="text-gray-400 text-xs">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NavigationLayout>
    </ProtectedRoute>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}