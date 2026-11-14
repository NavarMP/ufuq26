'use client';

import React, { useState, useEffect } from 'react';
import { useReminders } from '@/context/ReminderContext';
import { useApp } from '@/context/AppContext';
import {
  ReminderDraft,
  ReminderTargetType,
  ReminderTimingPreset,
  ReminderChannel,
} from '@/types/reminder';
import {
  requestNotificationPermission,
  playHarmonicChime,
  getNotificationPermissionStatus,
} from '@/lib/reminders/notificationManager';
import { generateWhatsAppReminderUrl } from '@/lib/reminders/whatsappHelper';
import {
  downloadICalendarFile,
  CalendarEvent,
} from '@/lib/calendar/calendarGenerator';
import {
  X,
  Bell,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare,
  Sparkles,
  Check,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export default function ReminderModal() {
  const { isReminderModalOpen, reminderModalTarget, closeReminderModal, createReminder } = useReminders();
  const { language, t } = useApp();

  const [targetType, setTargetType] = useState<ReminderTargetType>('full_camp');
  const [targetId, setTargetId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("UFUQ '26 Transition & Leadership Camp");
  const [description, setDescription] = useState('Camp commences at Alathurpadi Dars Campus.');
  const [targetDateTime, setTargetDateTime] = useState('2026-12-24T09:00:00+05:30');
  const [preset, setPreset] = useState<ReminderTimingPreset>('1_day_before');
  const [customDateTime, setCustomDateTime] = useState('2026-12-23T09:00');
  const [channels, setChannels] = useState<ReminderChannel[]>(['browser', 'calendar', 'whatsapp']);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync initial target if provided via context
  useEffect(() => {
    if (reminderModalTarget) {
      if (reminderModalTarget.targetType) setTargetType(reminderModalTarget.targetType);
      if (reminderModalTarget.targetId) setTargetId(reminderModalTarget.targetId);
      if (reminderModalTarget.title) setTitle(reminderModalTarget.title);
      if (reminderModalTarget.description) setDescription(reminderModalTarget.description);
      if (reminderModalTarget.targetDateTime) setTargetDateTime(reminderModalTarget.targetDateTime);
      if (reminderModalTarget.preset) setPreset(reminderModalTarget.preset);
    } else {
      // Default reset
      setTargetType('full_camp');
      setTitle("UFUQ '26 Transition & Leadership Camp");
      setDescription('Camp commences at Alathurpadi Dars Campus.');
      setTargetDateTime('2026-12-24T09:00:00+05:30');
      setPreset('1_day_before');
    }
    setPermissionStatus(getNotificationPermissionStatus());
    setSuccess(false);
  }, [reminderModalTarget, isReminderModalOpen]);

  if (!isReminderModalOpen) return null;

  const toggleChannel = (channel: ReminderChannel) => {
    if (channels.includes(channel)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== channel));
      }
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSelectQuickTarget = (type: ReminderTargetType) => {
    setTargetType(type);
    if (type === 'full_camp') {
      setTitle("UFUQ '26 Transition & Leadership Camp");
      setDescription('Camp commences at Alathurpadi Dars Campus.');
      setTargetDateTime('2026-12-24T09:00:00+05:30');
      setPreset('1_day_before');
    } else if (type === 'registration_deadline') {
      setTitle("UFUQ '26 Registration Deadline Closing");
      setDescription('Last day for SUFFA Dars students to register for UFUQ 26 admission pass.');
      setTargetDateTime('2026-12-10T23:59:00+05:30');
      setPreset('1_day_before');
    } else if (type === 'specific_day') {
      setTitle("UFUQ '26 Day 1: Inception & Opening");
      setDescription('Opening ceremony and campus briefing at Alathurpadi Dars.');
      setTargetDateTime('2026-12-24T09:00:00+05:30');
      setPreset('camp_morning');
    }
  };

  const handleSaveReminder = async () => {
    setIsSubmitting(true);

    // If browser channel selected, check/request permission
    if (channels.includes('browser')) {
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? 'granted' : 'denied');
    }

    const draft: ReminderDraft = {
      targetType,
      targetId,
      title,
      description,
      targetDateTime,
      preset,
      customDateTime: preset === 'custom' ? customDateTime : undefined,
      channels,
    };

    const created = createReminder(draft);

    // If calendar alarm selected, generate .ics with embedded VALARM
    if (channels.includes('calendar')) {
      const calEvent: CalendarEvent = {
        id: `rem-${created.id}`,
        title: created.title,
        description: created.description,
        location: 'Alathurpadi Dars Campus, Malappuram, Kerala',
        startDate: created.targetDateTime,
        endDate: created.targetDateTime,
        alarmsMinutesBefore: preset === '1_day_before' ? [1440] : preset === '3_days_before' ? [4320] : [120],
      };
      downloadICalendarFile(calEvent, `Reminder_${created.id}.ics`);
    }

    // If WhatsApp channel selected, launch WhatsApp draft
    if (channels.includes('whatsapp')) {
      const waUrl = generateWhatsAppReminderUrl(created);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }

    // Play pleasant harmonic bell chime
    playHarmonicChime();
    setSuccess(true);
    setIsSubmitting(false);

    setTimeout(() => {
      closeReminderModal();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-7 overflow-hidden text-neutral-800 dark:text-neutral-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Set Camp Reminder"
      >
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full bg-brand-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-brand-teal/15 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white">
                Set Event Reminder
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Systematic multi-channel alert for UFUQ ’26
              </p>
            </div>
          </div>
          <button
            onClick={closeReminderModal}
            className="w-8 h-8 rounded-full glass-panel border border-brand-gold/20 flex items-center justify-center hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/40">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-clash text-xl font-bold text-brand-navy dark:text-white">
              Reminder Scheduled!
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-sm">
              Your reminder has been stored. You can manage or test your active alerts anytime from the reminder panel.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-y-auto space-y-5 pr-1 no-scrollbar flex-1 text-left rtl:text-right">
            {/* Step 1: Target Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                1. What would you like a reminder for?
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectQuickTarget('full_camp')}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    targetType === 'full_camp'
                      ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-bold shadow-sm'
                      : 'border-white/10 glass-panel hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Entire Camp
                  <span className="block text-[10px] opacity-75 font-normal">Dec 24–30</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectQuickTarget('registration_deadline')}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    targetType === 'registration_deadline'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-500 font-bold shadow-sm'
                      : 'border-white/10 glass-panel hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Reg. Deadline
                  <span className="block text-[10px] opacity-75 font-normal">Dec 10</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectQuickTarget('specific_day')}
                  className={`p-2.5 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    targetType === 'specific_day' || targetType === 'specific_session'
                      ? 'border-brand-teal bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-bold shadow-sm'
                      : 'border-white/10 glass-panel hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Day / Session
                  <span className="block text-[10px] opacity-75 font-normal">Individual</span>
                </button>
              </div>

              {/* Title preview badge */}
              <div className="mt-2 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-white/10 text-xs text-neutral-600 dark:text-neutral-300 truncate">
                <strong className="text-brand-gold">Target:</strong> {title}
              </div>
            </div>

            {/* Step 2: Timing Offset Presets */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                2. When should we remind you?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: '1_week_before', label: '1 Week Before', sub: '7 days prior' },
                  { id: '3_days_before', label: '3 Days Before', sub: '3 days prior' },
                  { id: '1_day_before', label: '1 Day Before', sub: '24 hours prior (09:00 AM)' },
                  { id: 'camp_morning', label: 'Day of Event', sub: 'Morning 07:00 AM' },
                  { id: '2_hours_before', label: '2 Hours Before', sub: 'Prior to start' },
                  { id: 'custom', label: 'Custom Time', sub: 'Choose date/time' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPreset(item.id as ReminderTimingPreset)}
                    className={`p-2.5 rounded-2xl border text-left rtl:text-right transition-all ${
                      preset === item.id
                        ? 'border-brand-gold bg-brand-gold/20 text-brand-gold font-bold shadow-sm'
                        : 'border-white/10 glass-panel hover:bg-white/5 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="text-[10px] opacity-75">{item.sub}</span>
                  </button>
                ))}
              </div>

              {/* Custom Date Time Picker if custom selected */}
              {preset === 'custom' && (
                <div className="mt-3 p-3 rounded-2xl glass-panel border border-brand-gold/30 space-y-1.5 animate-slide-down">
                  <span className="text-xs font-semibold text-brand-gold">Select Custom Alert Time:</span>
                  <input
                    type="datetime-local"
                    value={customDateTime}
                    onChange={(e) => setCustomDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/10 border border-white/20 text-xs text-neutral-800 dark:text-white focus:outline-none focus:border-brand-gold"
                  />
                  <span className="text-[10px] text-neutral-400 block">Timezone: Asia/Kolkata (IST)</span>
                </div>
              )}
            </div>

            {/* Step 3: Channels Checkbox */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                3. Choose Reminder Channels
              </label>
              <div className="space-y-2">
                {/* Browser Notification */}
                <button
                  type="button"
                  onClick={() => toggleChannel('browser')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left rtl:text-right transition-all ${
                    channels.includes('browser')
                      ? 'border-brand-gold bg-brand-gold/15'
                      : 'border-white/10 glass-panel opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-navy dark:text-white block">
                        Device / Browser Notification
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Plays a soft chime and triggers an in-browser alert
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    channels.includes('browser') ? 'bg-brand-gold border-brand-gold text-brand-navy' : 'border-neutral-400'
                  }`}>
                    {channels.includes('browser') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>

                {/* Calendar Alarm */}
                <button
                  type="button"
                  onClick={() => toggleChannel('calendar')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left rtl:text-right transition-all ${
                    channels.includes('calendar')
                      ? 'border-brand-gold bg-brand-gold/15'
                      : 'border-white/10 glass-panel opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-navy dark:text-white block">
                        Calendar Alarm (VALARM)
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Integrates native lock screen alarms into your phone calendar
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    channels.includes('calendar') ? 'bg-brand-gold border-brand-gold text-brand-navy' : 'border-neutral-400'
                  }`}>
                    {channels.includes('calendar') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>

                {/* WhatsApp Self Reminder */}
                <button
                  type="button"
                  onClick={() => toggleChannel('whatsapp')}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left rtl:text-right transition-all ${
                    channels.includes('whatsapp')
                      ? 'border-brand-gold bg-brand-gold/15'
                      : 'border-white/10 glass-panel opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-brand-navy dark:text-white block">
                        WhatsApp Reminder Link
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        1-Tap dispatch pre-formatted reminder to yourself or coordinator
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    channels.includes('whatsapp') ? 'bg-brand-gold border-brand-gold text-brand-navy' : 'border-neutral-400'
                  }`}>
                    {channels.includes('whatsapp') && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        {!success && (
          <div className="mt-5 pt-4 border-t border-brand-gold/20 flex items-center justify-between shrink-0">
            <button
              onClick={closeReminderModal}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveReminder}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs sm:text-sm shadow-lg shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>{isSubmitting ? 'Scheduling...' : 'Set Reminder'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
