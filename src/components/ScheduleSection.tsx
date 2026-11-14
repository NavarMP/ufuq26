'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { Calendar as CalendarIcon, Clock, Tag, CalendarPlus, Info, Check } from 'lucide-react';

export default function ScheduleSection() {
  const { schedule } = useEvent();
  const { language, t, isRtl } = useApp();
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedSessionId, setAddedSessionId] = useState<string | null>(null);

  const days = [
    { day: 1, date: 'Dec 24', label: 'Day 1' },
    { day: 2, date: 'Dec 25', label: 'Day 2' },
    { day: 3, date: 'Dec 26', label: 'Day 3' },
    { day: 4, date: 'Dec 27', label: 'Day 4' },
    { day: 5, date: 'Dec 28', label: 'Day 5' },
    { day: 6, date: 'Dec 29', label: 'Day 6' },
    { day: 7, date: 'Dec 30', label: 'Day 7' },
  ];

  const categories = ['all', 'Orientation', 'Academics', 'Intellectual', 'Skills Workshop', 'Guidance', 'Leadership', 'Mentorship', 'Valedictory'];

  // Filter published sessions only for visitors
  const publishedSessions = schedule.filter((s) => s.published);

  const filteredSessions = publishedSessions.filter((session) => {
    const matchesDay = selectedDay === 'all' || session.day === selectedDay;
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    return matchesDay && matchesCategory;
  });

  const handleDownloadSessionICS = (session: any) => {
    const title = resolveLocalized(session.title, language);
    const desc = resolveLocalized(session.description, language);
    const dateFormatted = session.date.replace(/-/g, '');
    const startFormatted = session.startTime.replace(/:/g, '') + '00';
    const endFormatted = session.endTime.replace(/:/g, '') + '00';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ADSA//UFUQ 26//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc} (UFUQ '26 - Alathurpadi Dars)`,
      'LOCATION:Alathurpadi Dars Campus, Malappuram, Kerala',
      `DTSTART;TZID=Asia/Kolkata:${dateFormatted}T${startFormatted}`,
      `DTEND;TZID=Asia/Kolkata:${dateFormatted}T${endFormatted}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UFUQ26_Day${session.day}_Session.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setAddedSessionId(session.id);
    setTimeout(() => setAddedSessionId(null), 2500);
  };

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

      {/* Day Selector Tabs */}
      <div
        role="tablist"
        aria-label="Camp Days"
        className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar"
      >
        <button
          role="tab"
          aria-selected={selectedDay === 'all'}
          onClick={() => setSelectedDay('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedDay === 'all'
              ? 'bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy shadow-md'
              : 'glass-panel text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          {t('schedule.allDays')} (Dec 24–30)
        </button>

        {days.map((d) => (
          <button
            key={d.day}
            role="tab"
            aria-selected={selectedDay === d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedDay === d.day
                ? 'bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy shadow-md'
                : 'glass-panel text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>{d.label}</span>
            <span className="text-[10px] opacity-75 font-mono">({d.date})</span>
          </button>
        ))}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 text-xs no-scrollbar">
        <span className="text-neutral-500 text-xs shrink-0 mr-1 flex items-center gap-1">
          <Tag className="w-3 h-3" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-teal text-white shadow-sm'
                : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-black/10'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Schedule Timeline List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16 rounded-3xl glass-panel border border-brand-gold/20">
            <Clock className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
              {t('schedule.noSessions')}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Check back soon or select another day/filter.
            </p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="p-5 sm:p-6 rounded-3xl glass-panel border border-brand-gold/20 hover:border-brand-gold/50 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 text-left rtl:text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-brand-gold/15 text-brand-gold">
                    Day {session.day} • {session.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-brand-teal" />
                    {session.startTime} – {session.endTime}
                  </span>
                  {session.category && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-teal/10 text-brand-teal dark:text-emerald-400">
                      {session.category}
                    </span>
                  )}
                </div>

                <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors">
                  {resolveLocalized(session.title, language)}
                </h3>

                {session.description && (
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
                    {resolveLocalized(session.description, language)}
                  </p>
                )}
              </div>

              {/* Add to Calendar Button per session */}
              <div className="shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleDownloadSessionICS(session)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium glass-panel border border-brand-gold/25 hover:border-brand-gold hover:bg-brand-gold/10 text-neutral-800 dark:text-neutral-200 transition-colors"
                  title="Add this session to calendar"
                >
                  {addedSessionId === session.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Added (.ics)</span>
                    </>
                  ) : (
                    <>
                      <CalendarPlus className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Add Session</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
