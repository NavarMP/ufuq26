'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { usePreferences } from '@/context/PreferencesContext';
import { useReminders } from '@/context/ReminderContext';
import { resolveLocalized } from '@/lib/translations';
import { Calendar, Clock, MapPin, ArrowRight, Bell } from 'lucide-react';
import AddToCalendarModal from './calendar/AddToCalendarModal';
import { CalendarEvent } from '@/lib/calendar/calendarGenerator';
import ShareTriggerButton from '@/components/share/ShareTriggerButton';

export default function HeroSection() {
  const { eventInfo } = useEvent();
  const { language, t, isRtl } = useApp();
  const { preferences } = usePreferences();
  const { openReminderModal, activeCount } = useReminders();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Countdown timer to Dec 24, 2026
  useEffect(() => {
    const targetDate = new Date('2026-12-24T09:00:00+05:30').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const campCalendarEvent: CalendarEvent = {
    id: 'ufuq-2026-full-event',
    title: "UFUQ ’26 — A Transition & Leadership Camp",
    description:
      "A week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA Dars moving on to higher studies. Rooted in Ilm. Ready for the World.",
    location: "Alathurpadi Dars Campus & Conference Hall, Malappuram, Kerala 676503, India",
    startDate: "2026-12-24T09:00:00+05:30",
    endDate: "2026-12-30T17:00:00+05:30",
    allDay: true,
    url: "https://alathurpadidars.in",
    alarmsMinutesBefore: [1440, 120],
  };

  const handleOpenReminder = () => {
    openReminderModal({
      targetType: 'full_camp',
      title: "UFUQ '26 Transition & Leadership Camp",
      description: 'Camp commences on Dec 24, 2026 at Alathurpadi Dars Campus.',
      targetDateTime: '2026-12-24T09:00:00+05:30',
      preset: '1_day_before',
    });
  };

  return (
    <section
      id="home"
      aria-label="Camp Introduction"
      className="relative min-h-[92vh] pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-mesh-pattern"
    >
      {/* Decorative ambient background rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[950px] md:h-[950px] rounded-full border border-brand-gold/10 dark:border-brand-gold/10 blur-[1px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[650px] md:h-[650px] rounded-full border border-brand-teal/15 blur-[2px]"
      />

      {/* Organizer badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-gold/30 text-xs font-semibold text-brand-navy dark:text-brand-gold-light mb-6 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
        <span>Alathurpadi Dars Students Association (ADSA) Presents</span>
      </div>

      {/* Hero Typography */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Arabic Calligraphy Typography */}
        <h2 className="font-arabic text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-brand-gold font-bold tracking-wide select-none drop-shadow-md">
          {eventInfo.titleArabic || 'أُفُق'}
        </h2>

        {/* English Title & Descriptor */}
        <div className="space-y-2">
          <h1 className="font-clash text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-navy dark:text-white uppercase">
            {eventInfo.titleEnglish || 'UFUQ ’26'}
          </h1>
          <p className="font-clash font-semibold text-sm sm:text-base md:text-lg tracking-widest text-brand-teal dark:text-brand-gold uppercase">
            {resolveLocalized(eventInfo.descriptor, language)}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg md:text-xl font-medium text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto italic font-clash">
          &ldquo;{resolveLocalized(eventInfo.tagline, language)}&rdquo;
        </p>
      </div>

      {/* Event Meta Badges: Date & Venue */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 mb-8 text-xs sm:text-sm font-medium">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel border border-brand-gold/30 text-neutral-800 dark:text-neutral-200 shadow-sm">
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span>December 24–30, 2026</span>
          <span className="text-[10px] text-brand-gold font-bold px-1.5 py-0.5 rounded bg-brand-gold/15">
            7 Days
          </span>
        </div>

        <a
          href={eventInfo.venue?.mapUrl || 'https://maps.app.goo.gl/c8PnXU7Jufx1KgoH6'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel border border-brand-teal/40 hover:border-brand-teal text-neutral-800 dark:text-neutral-200 shadow-sm hover:scale-105 transition-all duration-200 group"
          title="Open Campus Location in Google Maps"
        >
          <MapPin className="w-4 h-4 text-brand-teal group-hover:text-brand-gold transition-colors" />
          <span>Alathurpadi Dars Campus, Malappuram</span>
        </a>
      </div>

      {/* Countdown Timer */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl glass-panel border border-brand-gold/30 shadow-xl max-w-md w-full">
        {preferences.countdownFormat === 'compact' ? (
          <div className="flex items-center justify-center gap-2 py-1 text-xs font-mono font-bold text-brand-navy dark:text-brand-gold-light">
            <Clock className="w-4 h-4 text-brand-gold shrink-0" />
            <span>
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s until camp
            </span>
          </div>
        ) : preferences.countdownFormat === 'days' ? (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <span>Days Remaining</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center px-6 py-2 rounded-2xl bg-brand-gold/15 border border-brand-gold/30">
                <span className="font-clash font-extrabold text-3xl sm:text-4xl text-brand-navy dark:text-brand-gold-light">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-brand-gold font-bold uppercase">Days to Camp</span>
              </div>
              <div className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              <span>Camp Countdown</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="p-2 sm:p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 flex flex-col">
                <span className="font-clash font-extrabold text-2xl sm:text-3xl text-brand-navy dark:text-brand-gold">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Days</span>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 flex flex-col">
                <span className="font-clash font-extrabold text-2xl sm:text-3xl text-brand-navy dark:text-brand-gold">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Hours</span>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 flex flex-col">
                <span className="font-clash font-extrabold text-2xl sm:text-3xl text-brand-navy dark:text-brand-gold">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Mins</span>
              </div>
              <div className="p-2 sm:p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 flex flex-col">
                <span className="font-clash font-extrabold text-2xl sm:text-3xl text-brand-navy dark:text-brand-gold">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Secs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions: Register CTA + Multi-Provider Add to Calendar + Systematic Reminder */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Link
          href="#register"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm md:text-base shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>{t('hero.registerNow')}</span>
          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>

        {/* Multi-provider Add to Calendar Button */}
        <button
          onClick={() => setIsCalendarModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 font-medium text-xs md:text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 shadow-sm"
          title="Add UFUQ '26 to Google, Apple, Samsung, or Outlook Calendar"
        >
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span>{t('schedule.addToCalendar')}</span>
        </button>

        {/* Systematic Reminder Button */}
        <button
          onClick={handleOpenReminder}
          className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 font-medium text-xs md:text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 shadow-sm"
          title="Set multi-channel reminder for camp"
        >
          <Bell className="w-4 h-4 text-brand-gold" />
          <span>{t('schedule.setReminder')}</span>
          {activeCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy">
              {activeCount}
            </span>
          )}
        </button>

        {/* Share Camp CTA Button */}
        <ShareTriggerButton
          variant="outline"
          size="lg"
          label={t('share.shareCamp') || 'Share Camp'}
          payload={{
            title: "UFUQ ’26 — A Transition & Leadership Camp",
            text: "Rooted in Ilm. Ready for the World. December 24–30, 2026 at Alathurpadi Dars Campus.",
            url: "https://alathurpadidars.in",
            type: "event",
          }}
        />
      </div>

      {/* Target Audience Note */}
      <p className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
        Specially curated for students from <strong>SUFFA Dars</strong> transitioning into university degrees and professional academia in 2026–2027.
      </p>

      {/* Add to Calendar Modal */}
      <AddToCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        event={campCalendarEvent}
      />
    </section>
  );
}
