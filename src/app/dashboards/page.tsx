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
          <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-border/40">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.user_metadata?.full_name || 'User'}!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s an overview of your API management dashboard and quick access to all features.
            </p>
          </div>

          {/* Settings-aware content */}
          {settings?.dashboard_preferences?.default_view === 'keys' && (
            <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick API Keys Overview</h3>
              <p className="text-muted-foreground text-sm">
                Your default view is set to API Keys. Showing {itemsPerPage} items per page.
              </p>
            </div>
          )}

          {settings?.dashboard_preferences?.default_view === 'analytics' && (
            <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Overview</h3>
              <p className="text-muted-foreground text-sm">
                Your default view is set to Analytics. Showing {itemsPerPage} items per page.
              </p>
            </div>
          )}

          {/* API Preferences Info */}
          {settings?.api_preferences && (
            <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl p-6 border border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-4">API Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Default Limit:</span>
                  <span className="text-foreground ml-2">{settings.api_preferences.default_limit || 1000} requests/month</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Auto Refresh:</span>
                  <span className="text-foreground ml-2">{settings.api_preferences.auto_refresh ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link
              href="/dashboards/keys"
              className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-primary/10 transition-all duration-300 border border-border/40 hover:border-primary/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-chart-2 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                API Keys
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                Manage your API keys and access tokens
              </p>
            </Link>

            <Link
              href="/dashboards/analytics"
              className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-chart-2/10 transition-all duration-300 border border-border/40 hover:border-chart-2/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-2 to-chart-3 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-chart-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-chart-2 transition-colors mb-2">
                Analytics
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                View usage statistics and performance metrics
              </p>
            </Link>

            <Link
              href="/playground"
              className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-chart-3/10 transition-all duration-300 border border-border/40 hover:border-chart-3/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-3 to-chart-4 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-chart-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-chart-3 transition-colors mb-2">
                API Playground
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                Test and debug your APIs in real-time
              </p>
            </Link>

            <Link
              href="/dashboards/logs"
              className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-chart-4/10 transition-all duration-300 border border-border/40 hover:border-chart-4/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-chart-4 to-chart-5 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-chart-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-chart-4 transition-colors mb-2">
                Activity Logs
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                View and monitor all account activities
              </p>
            </Link>

            <Link
              href="/dashboards/settings"
              className="group bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-secondary/10 transition-all duration-300 border border-border/40 hover:border-secondary/30 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-muted rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <svg className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-secondary transition-colors mb-2">
                Settings
              </h3>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                Configure your account and preferences
              </p>
            </Link>
          </div>

          {/* Current Plan Card */}
          <CurrentPlanCard />

          {/* Recent Activity */}
          <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-border/40">
            <h3 className="text-xl font-bold text-foreground mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">API key &quot;Production Key&quot; was created</p>
                  <p className="text-muted-foreground text-xs">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">API usage limit reached for &quot;Dev Key&quot;</p>
                  <p className="text-muted-foreground text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg">
                <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-foreground text-sm">Account settings updated</p>
                  <p className="text-muted-foreground text-xs">3 days ago</p>
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