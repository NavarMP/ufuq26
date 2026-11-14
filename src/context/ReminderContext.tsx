'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CampReminder, ReminderDraft } from '@/types/reminder';
import {
  getSavedReminders,
  addReminder as persistAddReminder,
  deleteReminder as persistDeleteReminder,
  checkDueReminders,
} from '@/lib/reminders/reminderStorage';
import { testReminderNotification } from '@/lib/reminders/notificationManager';

interface ReminderContextType {
  reminders: CampReminder[];
  activeCount: number;
  isReminderModalOpen: boolean;
  reminderModalTarget: Partial<ReminderDraft> | null;
  openReminderModal: (target?: Partial<ReminderDraft>) => void;
  closeReminderModal: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  createReminder: (draft: ReminderDraft) => CampReminder;
  removeReminder: (id: string) => void;
  testNotification: () => Promise<boolean>;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: React.ReactNode }) {
  const [reminders, setReminders] = useState<CampReminder[]>([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderModalTarget, setReminderModalTarget] = useState<Partial<ReminderDraft> | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync state from storage
  const syncReminders = useCallback(() => {
    setReminders(getSavedReminders());
  }, []);

  useEffect(() => {
    syncReminders();

    // Listen to storage update custom events
    const handleStorageUpdate = () => syncReminders();
    window.addEventListener('ufuq-reminders-updated', handleStorageUpdate);

    // Initial check for due reminders
    checkDueReminders();
    // Periodic check every 60 seconds
    const interval = setInterval(() => {
      checkDueReminders();
    }, 60000);

    return () => {
      window.removeEventListener('ufuq-reminders-updated', handleStorageUpdate);
      clearInterval(interval);
    };
  }, [syncReminders]);

  const activeCount = reminders.filter((r) => r.status === 'active').length;

  const openReminderModal = (target?: Partial<ReminderDraft>) => {
    setReminderModalTarget(target || null);
    setIsReminderModalOpen(true);
  };

  const closeReminderModal = () => {
    setIsReminderModalOpen(false);
    setReminderModalTarget(null);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const createReminder = (draft: ReminderDraft): CampReminder => {
    const created = persistAddReminder(draft);
    syncReminders();
    return created;
  };

  const removeReminder = (id: string) => {
    persistDeleteReminder(id);
    syncReminders();
  };

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        activeCount,
        isReminderModalOpen,
        reminderModalTarget,
        openReminderModal,
        closeReminderModal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        createReminder,
        removeReminder,
        testNotification: testReminderNotification,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}

export function useReminders(): ReminderContextType {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminders must be used within a ReminderProvider');
  }
  return context;
}
