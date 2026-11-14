'use client';

import React from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Bell } from 'lucide-react';

interface NotificationBellBadgeProps {
  compact?: boolean;
}

export default function NotificationBellBadge({ compact = false }: NotificationBellBadgeProps) {
  const { unreadCount, openDrawer } = useNotifications();

  return (
    <button
      onClick={openDrawer}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 ${
        compact
          ? 'w-9 h-9 p-2 text-neutral-300 hover:text-brand-gold hover:bg-white/10 active:scale-95'
          : 'px-3 py-1.5 gap-2 bg-neutral-900/60 hover:bg-neutral-900/90 border border-white/10 hover:border-brand-gold/40 text-neutral-200 shadow-sm backdrop-blur-md active:scale-95'
      }`}
      aria-label={`View notifications (${unreadCount} unread)`}
      title="Notifications & Summit Updates"
    >
      <div className="relative">
        <Bell className={`transition-transform group-hover:scale-110 ${compact ? 'w-4 h-4' : 'w-3.5 h-3.5 text-brand-gold'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
          </span>
        )}
      </div>

      {!compact && (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy">
              {unreadCount}
            </span>
          )}
        </div>
      )}
    </button>
  );
}
