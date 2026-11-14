// Storage and lifecycle manager for UFUQ '26 Reminders

import { CampReminder, ReminderDraft, ReminderTimingPreset } from '@/types/reminder';
import { dispatchBrowserNotification } from './notificationManager';

const STORAGE_KEY = 'ufuq_camp_reminders_v1';

/**
 * Calculate the exact notification Date based on target Date and selected Preset
 */
export function calculateNotificationTime(targetIso: string, preset: ReminderTimingPreset, customIso?: string): string {
  if (preset === 'custom' && customIso) {
    return new Date(customIso).toISOString();
  }

  const targetDate = new Date(targetIso);

  switch (preset) {
    case '1_week_before': {
      // 7 days prior at 09:00 AM
      const d = new Date(targetDate);
      d.setDate(d.getDate() - 7);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    }
    case '3_days_before': {
      // 3 days prior at 09:00 AM
      const d = new Date(targetDate);
      d.setDate(d.getDate() - 3);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    }
    case '1_day_before': {
      // 24 hours prior at 09:00 AM
      const d = new Date(targetDate);
      d.setDate(d.getDate() - 1);
      d.setHours(9, 0, 0, 0);
      return d.toISOString();
    }
    case 'camp_morning': {
      // Same day morning at 07:00 AM
      const d = new Date(targetDate);
      d.setHours(7, 0, 0, 0);
      return d.toISOString();
    }
    case '2_hours_before': {
      const d = new Date(targetDate.getTime() - 2 * 60 * 60 * 1000);
      return d.toISOString();
    }
    case '1_hour_before': {
      const d = new Date(targetDate.getTime() - 1 * 60 * 60 * 1000);
      return d.toISOString();
    }
    case '30_min_before': {
      const d = new Date(targetDate.getTime() - 30 * 60 * 1000);
      return d.toISOString();
    }
    default:
      return targetDate.toISOString();
  }
}

/**
 * Load all saved reminders from localStorage
 */
export function getSavedReminders(): CampReminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load reminders:', err);
    return [];
  }
}

/**
 * Save array of reminders to localStorage
 */
export function saveReminders(reminders: CampReminder[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    // Dispatch custom event so all listeners update synchronously
    window.dispatchEvent(new CustomEvent('ufuq-reminders-updated', { detail: reminders }));
  } catch (err) {
    console.error('Failed to save reminders:', err);
  }
}

/**
 * Create and add a new reminder
 */
export function addReminder(draft: ReminderDraft): CampReminder {
  const notifyDateTime = calculateNotificationTime(draft.targetDateTime, draft.preset, draft.customDateTime);
  const newReminder: CampReminder = {
    id: `rem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    targetType: draft.targetType,
    targetId: draft.targetId,
    title: draft.title,
    description: draft.description,
    targetDateTime: draft.targetDateTime,
    notifyDateTime,
    preset: draft.preset,
    channels: draft.channels,
    createdAt: new Date().toISOString(),
    status: 'active',
  };

  const existing = getSavedReminders();
  // Filter out any duplicate for the same targetId & preset
  const filtered = existing.filter((r) => !(r.targetType === newReminder.targetType && r.targetId === newReminder.targetId && r.preset === newReminder.preset));
  const updated = [newReminder, ...filtered];
  saveReminders(updated);
  return newReminder;
}

/**
 * Delete a reminder by ID
 */
export function deleteReminder(id: string): void {
  const existing = getSavedReminders();
  const updated = existing.filter((r) => r.id !== id);
  saveReminders(updated);
}

/**
 * Check if any reminder is currently due and dispatch notification
 */
export function checkDueReminders(): void {
  if (typeof window === 'undefined') return;

  const reminders = getSavedReminders();
  const now = new Date().getTime();
  let updated = false;

  const newReminders = reminders.map((r) => {
    if (r.status === 'active' && r.channels.includes('browser')) {
      const notifyTime = new Date(r.notifyDateTime).getTime();
      // If due within 5 minutes or overdue by less than 24 hours
      if (now >= notifyTime && now - notifyTime < 24 * 60 * 60 * 1000) {
        dispatchBrowserNotification(r.title, {
          body: `${r.description}\nUFUQ '26 Camp - Alathurpadi Dars`,
          tag: `ufuq-rem-${r.id}`,
        });
        updated = true;
        return { ...r, status: 'triggered' as const };
      }
    }
    return r;
  });

  if (updated) {
    saveReminders(newReminders);
  }
}
