'use client';

import React, { useState, useEffect } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { useReminders } from '@/context/ReminderContext';
import { resolveLocalized } from '@/lib/translations';
import { CalendarEvent } from '@/lib/calendar/calendarGenerator';
import { ScheduleSession } from '@/types';
import MonthGrid from './MonthGrid';
import CampWeekMatrix from './CampWeekMatrix';
import DayInspectorModal from './DayInspectorModal';
import AddToCalendarModal from './AddToCalendarModal';
import AddToCalendarDropdown from './AddToCalendarDropdown';
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  ListFilter,
  Clock,
  Tag,
  Info,
  Sparkles,
  Bell,
  MapPin,
  CalendarPlus,
} from 'lucide-react';

export type CalendarViewMode = 'month' | 'matrix' | 'agenda';

export default function CampCalendarView() {
  const { schedule, eventInfo } = useEvent();
  const { language, t, isRtl } = useApp();
  const { openReminderModal } = useReminders();

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [showHijri, setShowHijri] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectedDay, setInspectedDay] = useState<{ dayNumber: number; dateString: string } | null>(null);
  const [activeCalendarEvent, setActiveCalendarEvent] = useState<CalendarEvent | null>(null);

  // Restore preferred view from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ufuq_schedule_view_mode') as CalendarViewMode;
      if (saved && ['month', 'matrix', 'agenda'].includes(saved)) {
        setViewMode(saved);
      }
      const savedHijri = localStorage.getItem('ufuq_show_hijri');
      if (savedHijri !== null) {
        setShowHijri(savedHijri === 'true');
      }
    }
  }, []);

  const handleViewChange = (mode: CalendarViewMode) => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ufuq_schedule_view_mode', mode);
    }
  };

  const handleToggleHijri = () => {
    const next = !showHijri;
    setShowHijri(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ufuq_show_hijri', String(next));
    }
  };

  const days = [
    { day: 1, date: 'Dec 24', label: 'Day 1' },
    { day: 2, date: 'Dec 25', label: 'Day 2' },
    { day: 3, date: 'Dec 26', label: 'Day 3' },
    { day: 4, date: 'Dec 27', label: 'Day 4' },
    { day: 5, date: 'Dec 28', label: 'Day 5' },
    { day: 6, date: 'Dec 29', label: 'Day 6' },
    { day: 7, date: 'Dec 30', label: 'Day 7' },
  ];

  const categories = [
    'all',
    'Orientation',
    'Academics',
    'Intellectual',
    'Skills Workshop',
    'Guidance',
    'Leadership',
    'Mentorship',
    'Valedictory',
  ];

  const publishedSessions = schedule.filter((s) => s.published);

  const filteredSessions = publishedSessions.filter((session) => {
    const matchesDay = selectedDay === 'all' || session.day === selectedDay;
    const matchesCategory = selectedCategory === 'all' || session.category === selectedCategory;
    return matchesDay && matchesCategory;
  });

  const convertSessionToCalendarEvent = (session: ScheduleSession): CalendarEvent => {
    const title = resolveLocalized(session.title, language);
    const desc = resolveLocalized(session.description, language);
    return {
      id: session.id,
      title: `${title} (UFUQ '26 - Day ${session.day})`,
      description: `${desc}\n\nUFUQ '26 Camp Schedule Session.`,
      location: 'Alathurpadi Dars Campus, Malappuram, Kerala',
      startDate: `${session.date}T${session.startTime}:00+05:30`,
      endDate: `${session.date}T${session.endTime}:00+05:30`,
      allDay: false,
    };
  };

  const handleOpenSessionCalendar = (session: ScheduleSession) => {
    setActiveCalendarEvent(convertSessionToCalendarEvent(session));
  };

  const handleOpenSessionReminder = (session: ScheduleSession) => {
    const title = resolveLocalized(session.title, language);
    openReminderModal({
      targetType: 'specific_session',
      targetId: session.id,
      title: `UFUQ '26: ${title}`,
      description: `Starts at ${session.startTime} on ${session.date} at Alathurpadi Dars Campus.`,
      targetDateTime: `${session.date}T${session.startTime}:00+05:30`,
      preset: '2_hours_before',
    });
  };

  const handleAddFullCampToCalendar = () => {
    setActiveCalendarEvent({
      id: 'ufuq-2026-full-pass',
      title: "UFUQ ’26 — A Transition & Leadership Camp",
      description:
        "Organized by Alathurpadi Dars Students Association (ADSA) for graduating students from SUFFA Dars moving on to higher studies. Rooted in Ilm. Ready for the World.",
      location: "Alathurpadi Dars Campus & Conference Hall, Malappuram, Kerala 676503, India",
      startDate: "2026-12-24T09:00:00+05:30",
      endDate: "2026-12-30T17:00:00+05:30",
      allDay: true,
      url: "https://alathurpadidars.in",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* View Mode Segmented Control & Action Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-3xl glass-panel border border-brand-gold/30 bg-black/5 dark:bg-white/5">
        {/* 3 View Tabs */}
        <div
          role="tablist"
          aria-label="Calendar view selector"
          className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/10 dark:bg-white/10"
        >
          <button
            role="tab"
            aria-selected={viewMode === 'month'}
            onClick={() => handleViewChange('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'month'
                ? 'bg-brand-navy dark:bg-brand-gold text-white dark:text-brand-navy shadow-md font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Month Grid</span>
          </button>

          <button
            role="tab"
            aria-selected={viewMode === 'matrix'}
            onClick={() => handleViewChange('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'matrix'
                ? 'bg-brand-navy dark:bg-brand-gold text-white dark:text-brand-navy shadow-md font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>7-Day Matrix</span>
          </button>

          <button
            role="tab"
            aria-selected={viewMode === 'agenda'}
            onClick={() => handleViewChange('agenda')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'agenda'
                ? 'bg-brand-navy dark:bg-brand-gold text-white dark:text-brand-navy shadow-md font-bold'
                : 'text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Session Timeline</span>
          </button>
        </div>

        {/* Global Add Full Camp & Reminder Shortcut */}
        <div className="flex items-center gap-2 self-end sm:self-center pr-2">
          <button
            onClick={handleAddFullCampToCalendar}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-sm transition-all"
            title="Add full 7-day camp to Google, Apple, Samsung, or Outlook"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Add Camp (Dec 24–30)</span>
          </button>

          <button
            onClick={() =>
              openReminderModal({
                targetType: 'full_camp',
                title: "UFUQ '26 Transition & Leadership Camp",
                description: 'Camp commences on Dec 24, 2026 at Alathurpadi Dars Campus.',
                targetDateTime: '2026-12-24T09:00:00+05:30',
                preset: '1_day_before',
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 transition-colors"
            title="Set reminder for camp"
          >
            <Bell className="w-3.5 h-3.5 text-brand-gold" />
            <span className="hidden sm:inline">Set Reminder</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {viewMode === 'month' && (
        <div className="animate-fade-in">
          <MonthGrid
            showHijri={showHijri}
            onToggleHijri={handleToggleHijri}
            onSelectDay={(dayNumber, dateString) => setInspectedDay({ dayNumber, dateString })}
          />
        </div>
      )}

      {viewMode === 'matrix' && (
        <div className="animate-fade-in">
          <CampWeekMatrix
            onSelectSession={(session) => {
              setInspectedDay({ dayNumber: session.day, dateString: session.date });
            }}
            onAddSessionToCalendar={handleOpenSessionCalendar}
            onSetSessionReminder={handleOpenSessionReminder}
          />
        </div>
      )}

      {viewMode === 'agenda' && (
        <div className="animate-fade-in space-y-6">
          {/* Day Selector Tabs */}
          <div
            role="tablist"
            aria-label="Camp Days"
            className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar"
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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs no-scrollbar">
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

          {/* Schedule Session Cards */}
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
              filteredSessions.map((session) => {
                const calEvent = convertSessionToCalendarEvent(session);

                return (
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

                    {/* Actions: Add to Calendar Multi-Provider Dropdown + Remind Me */}
                    <div className="shrink-0 flex items-center gap-2 pt-2 md:pt-0">
                      <AddToCalendarDropdown event={calEvent} buttonLabel="Add to Calendar" />
                      <button
                        onClick={() => handleOpenSessionReminder(session)}
                        className="p-2 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10 text-neutral-700 dark:text-neutral-200 transition-colors"
                        title="Set reminder for this session"
                      >
                        <Bell className="w-3.5 h-3.5 text-brand-gold" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Day Dossier Inspector Modal */}
      {inspectedDay && (
        <DayInspectorModal
          dayNumber={inspectedDay.dayNumber}
          dateString={inspectedDay.dateString}
          onClose={() => setInspectedDay(null)}
          onAddDayToCalendar={(calEvent) => {
            setInspectedDay(null);
            setActiveCalendarEvent(calEvent);
          }}
          onSetDayReminder={(dayNum, dStr, title) => {
            setInspectedDay(null);
            openReminderModal({
              targetType: 'specific_day',
              targetId: String(dayNum),
              title,
              description: `Camp Day ${dayNum} sessions at Alathurpadi Dars Campus.`,
              targetDateTime: `${dStr}T08:30:00+05:30`,
              preset: 'camp_morning',
            });
          }}
          onAddSessionToCalendar={(session) => {
            setInspectedDay(null);
            handleOpenSessionCalendar(session);
          }}
        />
      )}

      {/* Multi-Provider Add to Calendar Modal */}
      {activeCalendarEvent && (
        <AddToCalendarModal
          isOpen={!!activeCalendarEvent}
          onClose={() => setActiveCalendarEvent(null)}
          event={activeCalendarEvent}
        />
      )}
    </div>
  );
}
