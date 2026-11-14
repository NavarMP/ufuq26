'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useApp } from '@/context/AppContext';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Calendar,
  Volume2,
  Info,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function NotificationCenterDrawer() {
  const {
    inAppNotifications,
    unreadCount,
    isDrawerOpen,
    closeDrawer,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    isSubscribedToPush,
    requestPushPermission,
    testNotificationChime,
  } = useNotifications();

  const { language, t } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'admission' | 'gate' | 'schedule' | 'general'>('all');

  if (!isDrawerOpen) return null;

  const filteredNotifications = inAppNotifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'admission':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'gate':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-gold" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950/95 border-l border-brand-gold/30 shadow-2xl p-6 flex flex-col backdrop-blur-xl text-neutral-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40 shadow-inner">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-clash text-lg font-bold text-white flex items-center gap-2">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold text-brand-navy shadow-sm animate-pulse">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
                <p className="text-xs text-neutral-400">
                  Live updates, admission status &amp; summit notices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={testNotificationChime}
                className="p-2 text-neutral-400 hover:text-brand-gold hover:bg-white/10 rounded-xl transition-all"
                title="Test harmonic acoustic chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeDrawer}
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Web Push Banner if not subscribed */}
          {!isSubscribedToPush && (
            <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-gold/15 to-emerald-500/10 border border-brand-gold/30 flex items-start gap-3 shrink-0">
              <div className="p-2 rounded-xl bg-brand-gold/20 text-brand-gold shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white mb-0.5">
                  Enable Lockscreen Notifications
                </h4>
                <p className="text-[11px] text-neutral-300 mb-2">
                  Receive instant alerts when your admission is confirmed or schedule updates occur.
                </p>
                <button
                  onClick={requestPushPermission}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs transition-transform active:scale-95 shadow-sm"
                >
                  <span>Allow Alerts</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Category Filter Pills & Global Actions */}
          <div className="py-3 flex items-center justify-between gap-2 border-b border-white/5 shrink-0 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {(['all', 'admission', 'gate', 'schedule'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11px] transition-all whitespace-nowrap ${
                    activeFilter === cat
                      ? 'bg-brand-gold text-brand-navy font-bold shadow'
                      : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-white/10 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              {inAppNotifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
            {filteredNotifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 text-neutral-500">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-neutral-300">No notifications here</p>
                <p className="text-xs text-neutral-500 mt-1">
                  You are completely caught up with all UFUQ ’26 updates!
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    item.read
                      ? 'bg-white/[0.02] border-white/5 hover:border-white/15 text-neutral-300'
                      : 'bg-brand-gold/10 border-brand-gold/30 hover:border-brand-gold/50 shadow-sm'
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!item.read && (
                    <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-brand-gold ring-4 ring-brand-gold/20" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-xl bg-white/5 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs font-bold text-white mb-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed break-words">
                        {item.message}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px] text-neutral-500">
                        <span>
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>

                        {item.actionUrl && (
                          <a
                            href={item.actionUrl}
                            onClick={(e) => {
                              e.stopPropagation();
                              closeDrawer();
                            }}
                            className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:underline"
                          >
                            <span>{item.actionLabel || 'View'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dismiss Single Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(item.id);
                    }}
                    className="absolute bottom-2.5 right-2.5 p-1 text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-white/10 shrink-0 text-center text-[11px] text-neutral-500">
            Alathurpadi Dars Students Association • Official Summit Communications
          </div>
        </div>
      </div>
    </div>
  );
}
