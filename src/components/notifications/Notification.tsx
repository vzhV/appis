'use client';

import { useState, useEffect } from 'react';
import { useSettingsContext } from '@/contexts/SettingsContext';

interface NotificationProps {
  type: 'email' | 'push' | 'api_alerts';
  title: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const { settings } = useSettingsContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this notification type is enabled
    if (settings?.notifications?.[type]) {
      setIsVisible(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300); // Wait for animation
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
    return undefined;
  }, [settings, type, duration, onClose]);

  if (!isVisible || !settings?.notifications?.[type]) {
    return null;
  }

  const getNotificationStyles = () => {
    switch (type) {
      case 'email':
        return 'bg-blue-500/10 border-blue-400/30 text-blue-300';
      case 'push':
        return 'bg-green-500/10 border-green-400/30 text-green-300';
      case 'api_alerts':
        return 'bg-orange-500/10 border-orange-400/30 text-orange-300';
      default:
        return 'bg-gray-500/10 border-gray-400/30 text-gray-300';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'push':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z" />
          </svg>
        );
      case 'api_alerts':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getNotificationStyles()} border rounded-lg p-4 shadow-lg backdrop-blur-sm transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm opacity-90 mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface NotificationManagerProps {
  children: React.ReactNode;
}

export function NotificationManager({ children }: NotificationManagerProps) {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'email' | 'push' | 'api_alerts';
    title: string;
    message: string;
    duration?: number;
  }>>([]);

  const addNotification = (notification: Omit<typeof notifications[0], 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose addNotification globally for easy use
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, []);

  return (
    <>
      {children}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );
}
