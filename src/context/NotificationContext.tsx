'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  InAppNotification,
  NotificationChannel,
  NotificationEventType,
  NotificationLog,
} from '@/types/notification';
import {
  dispatchNotification,
  fetchNotificationLogs,
  DispatchNotificationParams,
  DispatchResult,
} from '@/lib/notifications/notificationDispatcher';
import {
  TemplateVariables,
  formatWhatsAppMessage,
  buildWhatsAppLink,
  buildDirectSmsUri,
} from '@/lib/notifications/templateEngine';
import {
  playHarmonicChime,
  getNotificationPermissionStatus,
  requestNotificationPermission,
  dispatchBrowserNotification,
} from '@/lib/reminders/notificationManager';
import toast from 'react-hot-toast';

const IN_APP_STORAGE_KEY = 'ufuq26_in_app_notifications';

const INITIAL_WELCOME_NOTIFICATION: InAppNotification = {
  id: 'notif_welcome_ufuq26',
  title: 'Welcome to UFUQ ’26 Summit Portal',
  message: 'Rooted in Ilm. Ready for the World. Track your registration, explore the academic schedule, and manage your digital pass here.',
  type: 'celebration',
  category: 'general',
  actionUrl: '#schedule',
  actionLabel: 'Explore Schedule',
  read: false,
  createdAt: new Date().toISOString(),
};

interface NotificationContextType {
  inAppNotifications: InAppNotification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  addInAppNotification: (notif: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>) => void;
  logs: NotificationLog[];
  refreshLogs: () => Promise<void>;
  sendNotification: (params: DispatchNotificationParams) => Promise<DispatchResult>;
  triggerDirectWhatsApp: (
    phone: string | undefined,
    eventType: NotificationEventType,
    vars: TemplateVariables,
    locale?: 'en' | 'ml' | 'ar'
  ) => void;
  triggerDirectSms: (phone: string | undefined, message: string) => void;
  isSubscribedToPush: boolean;
  requestPushPermission: () => Promise<boolean>;
  testNotificationChime: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isSubscribedToPush, setIsSubscribedToPush] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(IN_APP_STORAGE_KEY);
      if (stored) {
        setInAppNotifications(JSON.parse(stored));
      } else {
        setInAppNotifications([INITIAL_WELCOME_NOTIFICATION]);
      }
    } catch (e) {
      setInAppNotifications([INITIAL_WELCOME_NOTIFICATION]);
    }

    // Check push permission status
    const status = getNotificationPermissionStatus();
    setIsSubscribedToPush(status === 'granted');

    // Initial logs load
    fetchNotificationLogs().then((fetched) => setLogs(fetched));
  }, []);

  // Save in-app notifications
  const persistNotifications = (updated: InAppNotification[]) => {
    setInAppNotifications(updated);
    try {
      localStorage.setItem(IN_APP_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // Ignore quota
    }
  };

  const unreadCount = inAppNotifications.filter((n) => !n.read).length;

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const markAsRead = useCallback(
    (id: string) => {
      const updated = inAppNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      persistNotifications(updated);
    },
    [inAppNotifications]
  );

  const markAllAsRead = useCallback(() => {
    const updated = inAppNotifications.map((n) => ({ ...n, read: true }));
    persistNotifications(updated);
    toast.success('All notifications marked as read', { icon: '✓' });
  }, [inAppNotifications]);

  const clearNotification = useCallback(
    (id: string) => {
      const updated = inAppNotifications.filter((n) => n.id !== id);
      persistNotifications(updated);
    },
    [inAppNotifications]
  );

  const clearAll = useCallback(() => {
    persistNotifications([]);
    toast.success('Notification feed cleared');
  }, []);

  const addInAppNotification = useCallback(
    (notif: Omit<InAppNotification, 'id' | 'createdAt' | 'read'>) => {
      const newNotif: InAppNotification = {
        ...notif,
        id: `inapp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const updated = [newNotif, ...inAppNotifications];
      persistNotifications(updated);

      // Play pleasant audio chime
      playHarmonicChime();

      // Show toast banner
      toast.success(newNotif.title, {
        icon: '🔔',
        duration: 4000,
      });
    },
    [inAppNotifications]
  );

  const refreshLogs = useCallback(async () => {
    const fetched = await fetchNotificationLogs(60);
    setLogs(fetched);
  }, []);

  const sendNotification = useCallback(
    async (params: DispatchNotificationParams): Promise<DispatchResult> => {
      const result = await dispatchNotification(params);

      // Add to in-app feed if requested
      if (params.channels.includes('in_app')) {
        addInAppNotification({
          title: params.vars.customMessage || params.eventType.replace(/_/g, ' ').toUpperCase(),
          message: params.vars.customMessage || `Update regarding ${params.recipientName}`,
          type: params.eventType === 'status_confirmed' ? 'celebration' : 'info',
          category: params.eventType.startsWith('gate') ? 'gate' : 'admission',
          actionUrl: params.vars.passUrl || '/#pass',
          actionLabel: 'View Details',
        });
      }

      await refreshLogs();
      return result;
    },
    [addInAppNotification, refreshLogs]
  );

  // Trigger WhatsApp via native wa.me link
  const triggerDirectWhatsApp = useCallback(
    (
      phone: string | undefined,
      eventType: NotificationEventType,
      vars: TemplateVariables,
      locale: 'en' | 'ml' | 'ar' = 'en'
    ) => {
      const waText = formatWhatsAppMessage(eventType, vars, locale);
      const url = buildWhatsAppLink(phone, waText);
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    []
  );

  // Trigger Native SMS via sms: URI
  const triggerDirectSms = useCallback((phone: string | undefined, message: string) => {
    const uri = buildDirectSmsUri(phone, message);
    window.location.href = uri;
  }, []);

  // Request Web Push Permission
  const requestPushPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    setIsSubscribedToPush(granted);
    if (granted) {
      playHarmonicChime();
      dispatchBrowserNotification("Notifications Enabled for UFUQ ’26", {
        body: "You'll now receive timely updates on admissions, schedule changes, and camp announcements.",
      });
      toast.success('Live notifications enabled!', { icon: '🔔' });
    } else {
      toast.error('Notification permission was blocked in browser settings.');
    }
    return granted;
  }, []);

  const testNotificationChime = useCallback(() => {
    playHarmonicChime();
    toast.success('Harmonic Golden Chime tested!', { icon: '✨' });
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        inAppNotifications,
        unreadCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        addInAppNotification,
        logs,
        refreshLogs,
        sendNotification,
        triggerDirectWhatsApp,
        triggerDirectSms,
        isSubscribedToPush,
        requestPushPermission,
        testNotificationChime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
