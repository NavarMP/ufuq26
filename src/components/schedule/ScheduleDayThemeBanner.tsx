'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { DayThemeInfo } from '@/types/schedule';
import { resolveLocalized } from '@/lib/translations';
import { Sparkles, User, Award, Compass } from 'lucide-react';

interface ScheduleDayThemeBannerProps {
  theme: DayThemeInfo;
}

export default function ScheduleDayThemeBanner({ theme }: ScheduleDayThemeBannerProps) {
  const { language, isRtl } = useApp();

  return (
    <div
      className="rounded-3xl glass-panel p-6 sm:p-8 border shadow-xl relative overflow-hidden transition-all duration-300"
      style={{
        borderColor: `${theme.color.primary}50`,
        background: `linear-gradient(135deg, ${theme.color.primary}12 0%, rgba(16, 29, 50, 0.4) 60%, ${theme.color.primary}08 100%)`,
      }}
    >
      {/* Background Decorative Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-40"
        style={{ backgroundColor: theme.color.primary }}
      />

      <div className="relative z-10 space-y-3.5 text-left rtl:text-right">
        {/* Top Badges: Day Pill + Gregorian Date + Hijri Date */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
            style={{
              backgroundColor: theme.color.primary,
              color: '#101D32',
            }}
          >
            Day {theme.day}
          </span>

          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-200">
            {theme.formattedDate}
          </span>

          <span className="text-xs font-arabic font-medium text-brand-gold">
            {theme.hijriDate}
          </span>

          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 hidden sm:inline-block" />

          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden sm:inline-block">
            {resolveLocalized(theme.subtitle, language)}
          </span>
        </div>

        {/* Day Headline */}
        <h2 className="font-clash text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white leading-tight">
          {resolveLocalized(theme.title, language)}
        </h2>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-4xl">
          {resolveLocalized(theme.description, language)}
        </p>

        {/* Milestone & Lead Faculty Row */}
        <div className="pt-3 border-t border-neutral-200/50 dark:border-white/10 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-600 dark:text-neutral-400">
          {theme.leadFaculty && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-gold shrink-0" />
              <span>
                <strong className="text-neutral-800 dark:text-neutral-200">Faculty Lead:</strong>{' '}
                {resolveLocalized(theme.leadFaculty, language)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-brand-teal dark:text-emerald-400 shrink-0" />
            <span>
              <strong className="text-neutral-800 dark:text-neutral-200">Key Milestone:</strong>{' '}
              {resolveLocalized(theme.keyMilestone, language)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
