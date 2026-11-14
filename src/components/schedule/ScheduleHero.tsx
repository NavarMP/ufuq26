'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { resolveLocalized } from '@/lib/translations';
import { formatSessionsToIcs } from '@/lib/export/formatters/icsFormatter';
import { createTextBlob, triggerBlobDownload } from '@/lib/export/utils/downloadHelper';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  MapPin,
  Download,
  CalendarPlus,
  Printer,
  Globe,
  Radio,
  Flame,
} from 'lucide-react';

export default function ScheduleHero() {
  const { language, t, isRtl } = useApp();
  const { schedule, eventInfo } = useEvent();
  const { timeFormat, toggleTimeFormat, showHijri, toggleHijri } = useScheduleStore();
  const { triggerLight, triggerSuccess } = useHapticFeedback();

  // Precise Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
    isEnded: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false,
    isEnded: false,
  });

  useEffect(() => {
    // Camp Opening Date: December 24, 2026, 09:00:00 IST (+05:30)
    const targetDate = new Date('2026-12-24T09:00:00+05:30').getTime();
    const endDate = new Date('2026-12-30T19:00:00+05:30').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diffToStart = targetDate - now;
      const diffToEnd = endDate - now;

      if (diffToEnd <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true, isEnded: true });
        return;
      }

      if (diffToStart <= 0) {
        // Camp is underway
        const hours = Math.floor((diffToEnd / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffToEnd / (1000 * 60)) % 60);
        const seconds = Math.floor((diffToEnd / 1000) % 60);
        const days = Math.floor(diffToEnd / (1000 * 60 * 60 * 24));
        setTimeLeft({ days, hours, minutes, seconds, isStarted: true, isEnded: false });
        return;
      }

      const days = Math.floor(diffToStart / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffToStart / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffToStart / (1000 * 60)) % 60);
      const seconds = Math.floor((diffToStart / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isStarted: false, isEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadFullIcs = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerSuccess();
    soundEngine.playSuccess();

    const calendarItems = schedule.map((s) => ({
      id: s.id,
      title: resolveLocalized(s.title, language),
      description: s.description ? resolveLocalized(s.description, language) : `UFUQ ’26 - Day ${s.day} Session`,
      location: s.location || 'Alathurpadi Dars Campus & Conference Hall, Malappuram',
      startDate: `${s.date}T${s.startTime}:00+05:30`,
      endDate: `${s.date}T${s.endTime}:00+05:30`,
      category: s.category,
      url: 'https://alathurpadidars.in/schedule',
    }));

    const icsContent = formatSessionsToIcs(calendarItems, "UFUQ ’26 Full Horizon Timetable (Dec 24–30, 2026)");
    const blob = createTextBlob(icsContent, 'text/calendar', false);
    triggerBlobDownload(blob, 'UFUQ26_Full_Camp_Schedule.ics');
  };

  const handlePrint = () => {
    soundEngine.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="relative pt-28 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Radiant Dawn Ambient Horizon Lighting */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-brand-gold/15 via-brand-teal/5 to-transparent blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/20 via-brand-gold/25 to-teal-500/20 rounded-full blur-[100px] pointer-events-none opacity-60 dark:opacity-40"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Breadcrumb & Live Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-gold/40 text-xs font-semibold text-brand-gold shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>
              {timeLeft.isStarted && !timeLeft.isEnded
                ? 'Camp Underway · Live Sessions Active'
                : 'December 24–30, 2026 · 14–20 Rajab 1448 AH'}
            </span>
          </div>

          {/* Quick Preferences Bar (Time Format & Print) */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                toggleTimeFormat();
                triggerLight();
                soundEngine.playClick();
              }}
              className="px-3 py-1.5 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/50 text-neutral-600 dark:text-neutral-300 transition-colors flex items-center gap-1.5"
              title="Toggle 12-hour or 24-hour time display"
            >
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <span>Format: <strong className="text-brand-gold uppercase">{timeFormat}</strong></span>
            </button>

            <button
              onClick={() => {
                toggleHijri();
                triggerLight();
                soundEngine.playClick();
              }}
              className={`px-3 py-1.5 rounded-full glass-panel border transition-colors flex items-center gap-1.5 ${
                showHijri
                  ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                  : 'border-neutral-300/40 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-brand-gold/50'
              }`}
              title="Toggle Hijri Calendar Dates"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Hijri: {showHijri ? 'On' : 'Off'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex p-2 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/50 text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
              title="Print Camp Timetable"
              aria-label="Print Schedule"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold">
            <Sparkles className="w-4 h-4" />
            <span>Alathurpadi Dars Students Association (ADSA)</span>
          </div>

          <h1 className="font-clash text-3xl sm:text-5xl md:text-6xl font-extrabold text-brand-navy dark:text-white tracking-tight leading-[1.15]">
            {t('schedule.pageTitle') || 'Interactive Camp Schedule & Horizon Timetable'}
          </h1>

          <p className="font-arabic text-xl sm:text-2xl text-brand-gold font-medium">
            جَدْوَلُ الفَعَالِيَاتِ وَآفَاقُ التَّحَوُّلِ
          </p>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            {t('schedule.pageSubtitle') ||
              'Seven days of intensive residential transformation — Grounded in classical Islamic scholarship, equipped for central universities and global academic leadership.'}
          </p>
        </div>

        {/* HORIZON COUNTDOWN & STATS BANNER */}
        <div className="mt-10 max-w-4xl mx-auto rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/40 shadow-2xl bg-gradient-to-br from-brand-navy/30 via-brand-dark/20 to-brand-gold/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-0 md:divide-x divide-neutral-200/40 dark:divide-white/10">
            {/* Days Left */}
            <div className="p-2 space-y-1">
              <div className="font-clash text-3xl sm:text-4xl md:text-5xl font-black text-brand-gold tracking-tight">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Days
              </div>
            </div>

            {/* Hours */}
            <div className="p-2 space-y-1">
              <div className="font-clash text-3xl sm:text-4xl md:text-5xl font-black text-brand-navy dark:text-white tracking-tight">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Hours
              </div>
            </div>

            {/* Minutes */}
            <div className="p-2 space-y-1">
              <div className="font-clash text-3xl sm:text-4xl md:text-5xl font-black text-brand-teal dark:text-emerald-400 tracking-tight">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Minutes
              </div>
            </div>

            {/* Seconds */}
            <div className="p-2 space-y-1">
              <div className="font-clash text-3xl sm:text-4xl md:text-5xl font-black text-amber-500 tracking-tight">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Seconds
              </div>
            </div>
          </div>

          {/* Action Sync Strip inside Hero Card */}
          <div className="mt-6 pt-6 border-t border-neutral-200/40 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
              <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
              <span>
                <strong>Venue:</strong> Alathurpadi Dars Campus & Conference Hall, Malappuram
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleDownloadFullIcs}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Sync All 7 Days (.ics)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
