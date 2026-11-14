'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { getHijriDate, formatHijriLocalized } from '@/lib/calendar/hijriConverter';
import { CAMP_DAY_THEMES, EXTENDED_SCHEDULE_SESSIONS } from '@/lib/scheduleData';
import { EnhancedScheduleSession } from '@/types/schedule';
import { resolveLocalized } from '@/lib/translations';
import ScheduleSessionCard from './ScheduleSessionCard';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

interface ScheduleMonthCalendarViewProps {
  onInspectSession?: (session: EnhancedScheduleSession) => void;
}

export default function ScheduleMonthCalendarView({ onInspectSession }: ScheduleMonthCalendarViewProps) {
  const { schedule } = useEvent();
  const { language, isRtl } = useApp();
  const { showHijri, toggleHijri } = useScheduleStore();
  const { triggerLight } = useHapticFeedback();

  // Anchor to December 2026 (Month 11)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<{ dayNum: number; dateStr: string }>({
    dayNum: 1,
    dateStr: '2026-12-24',
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const allSessions: EnhancedScheduleSession[] = React.useMemo(() => {
    const baseList = schedule.length > 0 ? schedule : EXTENDED_SCHEDULE_SESSIONS;
    return baseList.map((s) => {
      const enriched = EXTENDED_SCHEDULE_SESSIONS.find((e) => e.id === s.id);
      return (enriched || s) as EnhancedScheduleSession;
    });
  }, [schedule]);

  const handlePrevMonth = () => {
    soundEngine.playClick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    soundEngine.playClick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (dayOfMonth: number, campDay?: number) => {
    triggerLight();
    soundEngine.playClick();
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(dayOfMonth).padStart(2, '0');
    const dateStr = `${currentYear}-${mm}-${dd}`;

    setSelectedCalendarDay({
      dayNum: campDay || 1,
      dateStr,
    });
  };

  // Selected Day's sessions
  const activeDaySessions = allSessions.filter((s) => s.date === selectedCalendarDay.dateStr);
  const activeDayTheme = CAMP_DAY_THEMES.find((t) => t.date === selectedCalendarDay.dateStr);

  return (
    <div className="w-full space-y-8">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE MONTH CALENDAR GRID */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-brand-gold/40 shadow-2xl space-y-6">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-clash text-xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-brand-gold" />
                <span>{monthNames[currentMonth]} {currentYear}</span>
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {showHijri ? 'Jumada al-Thani / Rajab 1448 AH' : 'Gregorian Solar Calendar'}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 text-neutral-700 dark:text-neutral-300 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentYear(2026);
                  setCurrentMonth(11);
                  soundEngine.playSnap();
                }}
                className="px-3 py-1.5 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold text-brand-gold transition-colors"
              >
                Camp Month
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 text-neutral-700 dark:text-neutral-300 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Columns Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-200/50 dark:border-white/10 pb-2">
            {weekDayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank leading days */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 sm:h-20 rounded-xl bg-black/5 dark:bg-white/[0.02] opacity-25" />
            ))}

            {/* Month Days */}
            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayOfMonth = i + 1;
              const mm = String(currentMonth + 1).padStart(2, '0');
              const dd = String(dayOfMonth).padStart(2, '0');
              const dateStr = `${currentYear}-${mm}-${dd}`;

              // Is this day part of UFUQ '26? (Dec 24 - 30, 2026)
              const isCampDay = currentYear === 2026 && currentMonth === 11 && dayOfMonth >= 24 && dayOfMonth <= 30;
              const campDayNumber = isCampDay ? dayOfMonth - 23 : undefined;
              const isSelected = selectedCalendarDay.dateStr === dateStr;

              // Sessions count on this day
              const daySessionCount = allSessions.filter((s) => s.date === dateStr).length;

              // Calculate Hijri date
              const hijri = getHijriDate(new Date(currentYear, currentMonth, dayOfMonth));

              return (
                <button
                  key={dayOfMonth}
                  onClick={() => handleDayClick(dayOfMonth, campDayNumber)}
                  className={`group relative h-14 sm:h-20 p-1 sm:p-2 rounded-2xl flex flex-col justify-between transition-all duration-200 border text-left rtl:text-right ${
                    isSelected
                      ? 'border-brand-gold bg-brand-gold/20 shadow-lg scale-[1.03] z-10'
                      : isCampDay
                      ? 'border-brand-gold/60 bg-brand-gold/10 hover:border-brand-gold hover:bg-brand-gold/15'
                      : 'border-transparent hover:border-neutral-300 dark:hover:border-white/10 bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Top Day Number & Hijri Day */}
                  <div className="flex items-start justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-clash font-bold ${
                        isSelected
                          ? 'text-brand-gold'
                          : isCampDay
                          ? 'text-brand-navy dark:text-white font-extrabold'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {dayOfMonth}
                    </span>

                    {showHijri && (
                      <span className="text-[9px] sm:text-[10px] font-arabic font-medium text-brand-gold/90">
                        {hijri.day}
                      </span>
                    )}
                  </div>

                  {/* Camp Day Badge or Session Dot */}
                  {isCampDay && (
                    <div className="w-full">
                      <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-brand-gold text-brand-navy w-full text-center">
                        Day {campDayNumber}
                      </span>
                    </div>
                  )}

                  {!isCampDay && daySessionCount > 0 && (
                    <div className="flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DAY INSPECTOR PANE */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-brand-gold/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold">
                Day Inspector
              </span>
              <h4 className="font-clash text-lg font-bold text-brand-navy dark:text-white">
                {selectedCalendarDay.dateStr}
              </h4>
            </div>
            {activeDayTheme && (
              <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-navy font-bold text-xs">
                Day {activeDayTheme.day}
              </span>
            )}
          </div>

          {activeDayTheme && (
            <div className="p-4 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 space-y-1">
              <h5 className="font-clash text-sm font-bold text-brand-navy dark:text-brand-gold-light">
                {resolveLocalized(activeDayTheme.title, language)}
              </h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                {resolveLocalized(activeDayTheme.description, language)}
              </p>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {activeDaySessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
                <CalendarIcon className="w-6 h-6 mx-auto text-neutral-400" />
                <p>No camp sessions scheduled for this date.</p>
                <p className="text-[11px] text-brand-gold">Select any date between Dec 24 and Dec 30, 2026.</p>
              </div>
            ) : (
              activeDaySessions.map((session) => (
                <ScheduleSessionCard
                  key={session.id}
                  session={session}
                  compact={true}
                  onInspect={onInspectSession}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
