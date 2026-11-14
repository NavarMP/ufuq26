'use client';

import React from 'react';
import { useReminders } from '@/context/ReminderContext';
import { Bell } from 'lucide-react';

interface ReminderPillBadgeProps {
  compact?: boolean;
}

export default function ReminderPillBadge({ compact = false }: ReminderPillBadgeProps) {
  const { activeCount, openDrawer, openReminderModal } = useReminders();

  const handleClick = () => {
    if (activeCount > 0) {
      openDrawer();
    } else {
      openReminderModal();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-700 dark:text-neutral-200 text-xs font-semibold hover:bg-brand-gold/10 transition-all shadow-sm group"
      title={activeCount > 0 ? `View ${activeCount} active camp reminders` : 'Set a camp reminder'}
      aria-label="Camp Reminders"
    >
      <Bell className="w-3.5 h-3.5 text-brand-gold group-hover:scale-110 transition-transform" />
      {!compact && <span>Reminders</span>}
      {activeCount > 0 ? (
        <span className="w-4 h-4 rounded-full bg-brand-gold text-brand-navy font-bold text-[10px] flex items-center justify-center shadow-sm">
          {activeCount}
        </span>
      ) : null}
    </button>
  );
}
