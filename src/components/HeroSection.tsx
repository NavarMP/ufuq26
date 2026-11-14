'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { Calendar, Clock, MapPin, ArrowRight, Bell, Check, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const { eventInfo } = useEvent();
  const { language, t, isRtl } = useApp();
  const [reminderSet, setReminderSet] = useState(false);
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

  // Generate .ics calendar download
  const handleAddToCalendar = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ADSA//UFUQ 26//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'SUMMARY:UFUQ ’26 — A Transition & Leadership Camp',
      'DESCRIPTION:Organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA Dars moving on to higher studies. Rooted in Ilm. Ready for the World.',
      'LOCATION:Alathurpadi Dars Campus, Malappuram, Kerala, India',
      'DTSTART:20261224T033000Z',
      'DTEND:20261230T143000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'UFUQ_26_Camp.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setTimeout(() => setReminderSet(false), 3000);
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
        <div className="w-4 h-4 relative">
          <Image
            src="/images/adsa-logo.svg"
            alt="ADSA"
            fill
            className="object-contain"
          />
        </div>
        <span>{resolveLocalized(eventInfo.organizer, language)}</span>
        <span className="w-1 h-1 rounded-full bg-brand-gold" />
        <span className="text-brand-teal dark:text-emerald-400 font-mono">SUFFA Dars</span>
      </div>

      {/* Main Logo & Title block */}
      <div className="relative mb-6 flex flex-col items-center">
        {/* Supplied UFUQ Logo with light/dark adaptive container */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 p-3 rounded-3xl glass-panel shadow-2xl border border-brand-gold/40 flex items-center justify-center group hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/UFUQ-Logo.svg"
            alt="UFUQ '26 Logo"
            width={100}
            height={100}
            priority
            className="object-contain drop-shadow-md"
          />
        </div>

        {/* Arabic Calligraphic Identity */}
        <h2 className="font-arabic text-5xl md:text-7xl font-bold text-brand-gold mb-1 tracking-wide leading-tight">
          أُفُق
        </h2>

        {/* English Brand Title */}
        <h1 className="font-clash text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-brand-navy dark:text-white uppercase leading-none">
          UFUQ ’26
        </h1>

        {/* Descriptor */}
        <p className="font-clash text-xs sm:text-sm md:text-base font-semibold tracking-widest text-brand-teal dark:text-emerald-400 uppercase mt-2">
          {resolveLocalized(eventInfo.descriptor, language)}
        </p>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-neutral-700 dark:text-neutral-200 mt-4 max-w-xl italic">
          &ldquo;{resolveLocalized(eventInfo.tagline, language)}&rdquo;
        </p>
      </div>

      {/* Dates & Location quick pill */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 my-4 font-medium">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5">
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span>December 24–30, 2026</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5">
          <MapPin className="w-4 h-4 text-brand-gold" />
          <span>Alathurpadi Dars, Kerala</span>
        </div>
      </div>

      {/* Countdown Grid */}
      <div className="my-6 p-4 md:p-6 rounded-3xl glass-panel border border-brand-gold/25 shadow-xl max-w-lg w-full">
        <div className="text-[11px] font-semibold text-brand-teal dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>{t('hero.daysLeft')}</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col p-2.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15">
            <span className="font-clash font-extrabold text-2xl md:text-3xl text-brand-navy dark:text-brand-gold-light">
              {timeLeft.days}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Days</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15">
            <span className="font-clash font-extrabold text-2xl md:text-3xl text-brand-navy dark:text-brand-gold-light">
              {timeLeft.hours}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Hours</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15">
            <span className="font-clash font-extrabold text-2xl md:text-3xl text-brand-navy dark:text-brand-gold-light">
              {timeLeft.minutes}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Mins</span>
          </div>
          <div className="flex flex-col p-2.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15">
            <span className="font-clash font-extrabold text-2xl md:text-3xl text-brand-gold">
              {timeLeft.seconds}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase mt-0.5">Secs</span>
          </div>
        </div>
      </div>

      {/* Actions: Register CTA + Calendar + Reminder */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <Link
          href="#register"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm md:text-base shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>{t('hero.registerNow')}</span>
          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>

        <button
          onClick={handleAddToCalendar}
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 font-medium text-xs md:text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
          title="Add UFUQ '26 dates to your calendar (.ics)"
        >
          <Calendar className="w-4 h-4 text-brand-gold" />
          <span>{t('schedule.addToCalendar')}</span>
        </button>

        <button
          onClick={handleSetReminder}
          className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 font-medium text-xs md:text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
          title="Set browser reminder for camp"
        >
          {reminderSet ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">{t('schedule.reminderSet')}</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 text-brand-gold" />
              <span>{t('schedule.setReminder')}</span>
            </>
          )}
        </button>
      </div>

      {/* Target Audience Note */}
      <p className="mt-8 text-xs text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed">
        Specially curated for students from <strong>SUFFA Dars</strong> transitioning into university degrees and professional academia in 2026–2027.
      </p>
    </section>
  );
}
