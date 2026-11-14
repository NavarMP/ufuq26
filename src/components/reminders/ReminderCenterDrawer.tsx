'use client';

import React, { useState } from 'react';
import { useReminders } from '@/context/ReminderContext';
import { useApp } from '@/context/AppContext';
import { generateWhatsAppReminderUrl } from '@/lib/reminders/whatsappHelper';
import {
  X,
  Bell,
  Trash2,
  Clock,
  Calendar,
  MessageSquare,
  Sparkles,
  Volume2,
  Check,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export default function ReminderCenterDrawer() {
  const {
    reminders,
    activeCount,
    isDrawerOpen,
    closeDrawer,
    removeReminder,
    openReminderModal,
    testNotification,
  } = useReminders();
  const { language } = useApp();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isDrawerOpen) return null;

  const handleTestNotification = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const success = await testNotification();
      if (success) {
        setTestResult('Alert test triggered successfully!');
      } else {
        setTestResult('Please allow browser notifications in settings.');
      }
    } catch (err) {
      setTestResult('Unable to test notification.');
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-dark/95 border-l border-brand-gold/30 shadow-2xl p-6 flex flex-col backdrop-blur-xl text-neutral-100">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-clash text-lg font-bold text-white flex items-center gap-2">
                  <span>Camp Reminders</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-gold text-brand-navy">
                    {activeCount}
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Manage your scheduled alerts & notifications
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="w-8 h-8 rounded-full glass-panel border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Test Alert Bar */}
          <div className="mt-4 p-3.5 rounded-2xl glass-panel border border-brand-gold/30 bg-brand-gold/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <Volume2 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Verify device notification sound & alert:</span>
            </div>
            <button
              onClick={handleTestNotification}
              disabled={testing}
              className="px-3 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-sm transition-all shrink-0"
            >
              {testing ? 'Testing...' : 'Test Alert'}
            </button>
          </div>

          {testResult && (
            <div className="mt-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-1.5 animate-slide-down">
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          {/* Reminders List */}
          <div className="mt-5 flex-1 overflow-y-auto space-y-3 pr-1 no-scrollbar">
            {reminders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-neutral-500 flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="font-clash text-base font-semibold text-neutral-300">
                  No Scheduled Reminders
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Set reminders for the full camp, registration deadlines, or specific sessions.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    openReminderModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold text-brand-navy text-xs font-bold shadow-md hover:scale-105 transition-all mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Reminder</span>
                </button>
              </div>
            ) : (
              reminders.map((reminder) => {
                const notifyDate = new Date(reminder.notifyDateTime).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                  timeZone: 'Asia/Kolkata',
                });

                return (
                  <div
                    key={reminder.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold/40 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-clash font-bold text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                        {reminder.title}
                      </h5>
                      <button
                        onClick={() => removeReminder(reminder.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors"
                        title="Delete reminder"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {reminder.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-300 pt-1">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Alert set for: <strong>{notifyDate}</strong></span>
                    </div>

                    {/* Channels & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <div className="flex items-center gap-2">
                        {reminder.channels.includes('browser') && (
                          <span className="p-1 rounded bg-brand-gold/15 text-brand-gold" title="Browser Notification">
                            <Bell className="w-3 h-3" />
                          </span>
                        )}
                        {reminder.channels.includes('calendar') && (
                          <span className="p-1 rounded bg-sky-500/15 text-sky-400" title="Calendar Alarm">
                            <Calendar className="w-3 h-3" />
                          </span>
                        )}
                        {reminder.channels.includes('whatsapp') && (
                          <span className="p-1 rounded bg-emerald-500/15 text-emerald-400" title="WhatsApp Reminder">
                            <MessageSquare className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {reminder.channels.includes('whatsapp') && (
                        <a
                          href={generateWhatsAppReminderUrl(reminder)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center gap-1 text-[10px]"
                        >
                          <span>Open in WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {reminders.length > 0 && (
            <div className="pt-4 border-t border-white/10 shrink-0">
              <button
                onClick={() => {
                  closeDrawer();
                  openReminderModal();
                }}
                className="w-full py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Reminder</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
