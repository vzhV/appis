'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { UserSettings } from '@/types/logs-settings';
import { useSettings } from '@/hooks/useLogsSettings';

interface SettingsContextType {
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: any) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settingsHook = useSettings();

  // Apply theme to document and CSS variables
  useEffect(() => {
    if (settingsHook.settings?.theme) {
      const theme = settingsHook.settings.theme;
      const root = document.documentElement;
      
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.setProperty('--theme-bg', '#111827');
        root.style.setProperty('--theme-text', '#ffffff');
        root.style.setProperty('--theme-card-bg', 'rgba(31, 41, 55, 0.8)');
        root.style.setProperty('--theme-border', 'rgba(75, 85, 99, 0.5)');
      } else if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
        root.style.setProperty('--theme-bg', '#ffffff');
        root.style.setProperty('--theme-text', '#111827');
        root.style.setProperty('--theme-card-bg', 'rgba(249, 250, 251, 0.8)');
        root.style.setProperty('--theme-border', 'rgba(209, 213, 219, 0.5)');
      } else if (theme === 'auto') {
        // Auto theme - use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
          root.classList.remove('light');
          root.style.setProperty('--theme-bg', '#111827');
          root.style.setProperty('--theme-text', '#ffffff');
          root.style.setProperty('--theme-card-bg', 'rgba(31, 41, 55, 0.8)');
          root.style.setProperty('--theme-border', 'rgba(75, 85, 99, 0.5)');
        } else {
          root.classList.add('light');
          root.classList.remove('dark');
          root.style.setProperty('--theme-bg', '#ffffff');
          root.style.setProperty('--theme-text', '#111827');
          root.style.setProperty('--theme-card-bg', 'rgba(249, 250, 251, 0.8)');
          root.style.setProperty('--theme-border', 'rgba(209, 213, 219, 0.5)');
        }
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          if (settingsHook.settings?.theme === 'auto') {
            if (e.matches) {
              root.classList.add('dark');
              root.classList.remove('light');
              root.style.setProperty('--theme-bg', '#111827');
              root.style.setProperty('--theme-text', '#ffffff');
              root.style.setProperty('--theme-card-bg', 'rgba(31, 41, 55, 0.8)');
              root.style.setProperty('--theme-border', 'rgba(75, 85, 99, 0.5)');
            } else {
              root.classList.add('light');
              root.classList.remove('dark');
              root.style.setProperty('--theme-bg', '#ffffff');
              root.style.setProperty('--theme-text', '#111827');
              root.style.setProperty('--theme-card-bg', 'rgba(249, 250, 251, 0.8)');
              root.style.setProperty('--theme-border', 'rgba(209, 213, 219, 0.5)');
            }
          }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
    }
  }, [settingsHook.settings?.theme]);

  return (
    <SettingsContext.Provider value={settingsHook}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}
