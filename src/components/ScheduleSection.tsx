'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Info } from 'lucide-react';
import CampCalendarView from './calendar/CampCalendarView';

export default function ScheduleSection() {
  const { t } = useApp();

  return (
    <section
      id="schedule"
      aria-label="Camp Schedule"
      className="py-20 md:py-32 px-4 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {t('schedule.title')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {t('schedule.subtitle')}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
      </div>

      {/* Organizer Notice Banner regarding Sample Content */}
      <div className="mb-8 p-4 rounded-2xl glass-panel border border-brand-gold/40 flex items-start sm:items-center gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
        <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <strong className="text-brand-gold">Note on Schedule:</strong> {t('schedule.sampleLabel')}. Confirmed timings and guest faculty allocations will be published progressively by ADSA.
        </p>
      </div>

      {/* Complete Interactive Camp Calendar View (Month Grid / 7-Day Matrix / Session Timeline) */}
      <CampCalendarView />
    </section>
  );
}
