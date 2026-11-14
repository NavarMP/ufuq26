'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { getHijriDate, formatHijriLocalized } from '@/lib/calendar/hijriConverter';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface MonthGridProps {
  onSelectDay: (dayNumber: number, dateString: string) => void;
  showHijri: boolean;
  onToggleHijri: () => void;
}

export default function MonthGrid({ onSelectDay, showHijri, onToggleHijri }: MonthGridProps) {
  const { schedule } = useEvent();
  const { language, t, isRtl } = useApp();

  // Anchor month: December 2026 (year: 2026, month: 11)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(11); // 0-indexed: 11 is December

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate days in current month
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToCamp = () => {
    setCurrentYear(2026);
    setCurrentMonth(11); // December 2026
  };

  // Helper to check if a specific day is a camp day (Dec 24-30, 2026)
  const getCampDayInfo = (day: number) => {
    if (currentYear === 2026 && currentMonth === 11 && day >= 24 && day <= 30) {
      const campDayNumber = day - 23; // 24 -> Day 1, 30 -> Day 7
      const dateString = `2026-12-${String(day).padStart(2, '0')}`;
      const sessionsForDay = schedule.filter((s) => s.day === campDayNumber);

      return {
        isCampDay: true,
        campDayNumber,
        dateString,
        sessionCount: sessionsForDay.length,
        isFirstDay: day === 24,
        isLastDay: day === 30,
      };
    }
    return null;
  };

  // Check for Registration Deadline: Dec 10, 2026
  const isRegDeadline = (day: number) => currentYear === 2026 && currentMonth === 11 && day === 10;

  return (
    <div className="w-full rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl p-5 sm:p-7 text-neutral-800 dark:text-neutral-100 overflow-hidden relative">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-brand-teal/15 blur-3xl" />

      {/* Month Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40 shadow-sm">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              {currentYear === 2026 && currentMonth === 11 && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold text-brand-navy shadow-sm">
                  Camp Month
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {showHijri
                ? currentYear === 2026 && currentMonth === 11
                  ? 'Jumada al-Thani / Rajab 1448 AH'
                  : formatHijriLocalized(getHijriDate(new Date(currentYear, currentMonth, 15)), language)
                : 'Interactive Schedule Calendar'}
            </p>
          </div>
        </div>

        {/* Hijri toggle & Month navigators */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onToggleHijri}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showHijri
                ? 'bg-brand-gold/20 border-brand-gold text-brand-gold'
                : 'glass-panel border-white/10 text-neutral-500 hover:text-neutral-300'
            }`}
            title="Toggle Islamic Hijri Dates"
          >
            🌙 Hijri Dates {showHijri ? 'ON' : 'OFF'}
          </button>

          {!(currentYear === 2026 && currentMonth === 11) && (
            <button
              onClick={handleJumpToCamp}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-navy dark:bg-brand-gold text-white dark:text-brand-navy shadow-sm"
            >
              Camp Dates
            </button>
          )}

          <div className="flex items-center gap-1 border border-white/10 rounded-xl p-0.5 glass-panel">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Day Header */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-5 pb-2 text-center">
        {weekDayLabels.map((dayName, idx) => (
          <div
            key={dayName}
            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
              idx === 5 ? 'text-emerald-500 dark:text-emerald-400' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-1">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="min-h-[75px] sm:min-h-[92px] rounded-2xl opacity-20 pointer-events-none" />
        ))}

        {/* Month Day Cells */}
        {Array.from({ length: totalDaysInMonth }).map((_, index) => {
          const dayNumber = index + 1;
          const campInfo = getCampDayInfo(dayNumber);
          const deadline = isRegDeadline(dayNumber);
          const cellDate = new Date(currentYear, currentMonth, dayNumber);
          const hijri = showHijri ? getHijriDate(cellDate) : null;

          if (campInfo) {
            return (
              <button
                key={`day-${dayNumber}`}
                onClick={() => onSelectDay(campInfo.campDayNumber, campInfo.dateString)}
                className={`relative min-h-[75px] sm:min-h-[95px] p-2 sm:p-2.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between text-left rtl:text-right group shadow-lg ${
                  campInfo.isFirstDay
                    ? 'border-brand-gold bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 ring-2 ring-brand-gold/50 shadow-brand-gold/20'
                    : campInfo.isLastDay
                    ? 'border-brand-teal bg-gradient-to-br from-brand-teal/30 to-brand-teal/10 ring-2 ring-brand-teal/50'
                    : 'border-brand-gold/60 bg-brand-gold/15 hover:bg-brand-gold/25'
                }`}
                title={`Camp Day ${campInfo.campDayNumber} (${campInfo.dateString}) - Click to inspect schedule`}
              >
                {/* Top row: Gregorian Day & Badge */}
                <div className="flex items-start justify-between w-full">
                  <span className="font-clash font-extrabold text-base sm:text-lg text-brand-gold dark:text-brand-gold-light group-hover:scale-110 transition-transform">
                    {dayNumber}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-brand-gold text-brand-navy shrink-0 shadow-sm">
                    Day {campInfo.campDayNumber}
                  </span>
                </div>

                {/* Middle: Hijri Date if enabled */}
                {showHijri && hijri && (
                  <span className="text-[10px] font-arabic font-semibold text-neutral-600 dark:text-neutral-300 truncate">
                    {hijri.day} {hijri.monthNameAr}
                  </span>
                )}

                {/* Bottom: Milestone tag or session count */}
                <div className="w-full flex items-center justify-between mt-1">
                  <span className="text-[9px] sm:text-[10px] font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-brand-gold" />
                    <span>{campInfo.sessionCount > 0 ? `${campInfo.sessionCount} sessions` : 'Schedule'}</span>
                  </span>
                  {campInfo.isFirstDay && (
                    <span className="hidden sm:inline text-[9px] font-bold text-brand-gold">
                      🚩 Kickoff
                    </span>
                  )}
                  {campInfo.isLastDay && (
                    <span className="hidden sm:inline text-[9px] font-bold text-brand-teal dark:text-emerald-400">
                      🏆 Farewell
                    </span>
                  )}
                </div>
              </button>
            );
          }

          if (deadline) {
            return (
              <div
                key={`day-${dayNumber}`}
                className="min-h-[75px] sm:min-h-[95px] p-2 sm:p-2.5 rounded-2xl border border-amber-500/60 bg-amber-500/10 flex flex-col justify-between text-left rtl:text-right"
              >
                <div className="flex items-start justify-between w-full">
                  <span className="font-clash font-bold text-sm sm:text-base text-amber-500">
                    {dayNumber}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-amber-500 text-black">
                    Deadline
                  </span>
                </div>
                {showHijri && hijri && (
                  <span className="text-[10px] font-arabic text-neutral-500">
                    {hijri.day} {hijri.monthNameAr}
                  </span>
                )}
                <span className="text-[9px] font-semibold text-amber-500 line-clamp-1">
                  Reg. Closes
                </span>
              </div>
            );
          }

          // Normal Day
          return (
            <div
              key={`day-${dayNumber}`}
              className="min-h-[75px] sm:min-h-[95px] p-2 sm:p-2.5 rounded-2xl glass-panel border border-white/5 flex flex-col justify-between opacity-80 hover:opacity-100 hover:border-white/20 transition-all text-left rtl:text-right"
            >
              <div className="flex items-start justify-between w-full">
                <span className="font-clash font-semibold text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  {dayNumber}
                </span>
              </div>
              {showHijri && hijri && (
                <span className="text-[9px] font-arabic text-neutral-400 dark:text-neutral-500">
                  {hijri.day} {hijri.monthNameAr}
                </span>
              )}
              <div />
            </div>
          );
        })}
      </div>

      {/* Legend & Guide Banner */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-300">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-lg bg-brand-gold/50 border border-brand-gold" />
            <span className="font-medium text-neutral-700 dark:text-neutral-200">Camp Days (Dec 24–30)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-lg bg-amber-500/50 border border-amber-500" />
            <span>Dec 10: Registration Deadline</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
          <Info className="w-3.5 h-3.5 text-brand-gold" />
          <span>Click on any camp day to view full day dossier</span>
        </div>
      </div>
    </div>
  );
}
