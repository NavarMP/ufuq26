'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { ScheduleViewMode } from '@/types/schedule';
import { CAMP_DAY_THEMES, TRACK_METAS, CAMP_VENUES } from '@/lib/scheduleData';
import { resolveLocalized } from '@/lib/translations';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  Bookmark,
  Search,
  X,
  Filter,
  Sunrise,
  Layers,
  MapPin,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export default function ScheduleControlDeck() {
  const { language, t, isRtl } = useApp();
  const {
    activeView,
    setActiveView,
    selectedDay,
    setSelectedDay,
    selectedTrack,
    setSelectedTrack,
    selectedVenue,
    setSelectedVenue,
    searchQuery,
    setSearchQuery,
    showPrayers,
    togglePrayers,
    showHijri,
    bookmarkedSessionIds,
    resetFilters,
  } = useScheduleStore();

  const { triggerLight, triggerPop } = useHapticFeedback();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handleViewChange = (mode: ScheduleViewMode) => {
    setActiveView(mode);
    triggerLight();
    soundEngine.playSnap();
  };

  const handleDayChange = (day: number | 'all') => {
    setSelectedDay(day);
    triggerLight();
    soundEngine.playClick(typeof day === 'number' ? 1.0 + day * 0.05 : 1.0);
  };

  const handleTogglePrayers = () => {
    togglePrayers();
    triggerPop();
    soundEngine.playClick(1.3);
  };

  const hasActiveFilters =
    selectedDay !== 'all' ||
    selectedTrack !== 'all' ||
    selectedVenue !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="sticky top-16 md:top-20 z-30 w-full mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl glass-panel p-3 sm:p-4 border border-brand-gold/40 shadow-xl bg-brand-cream/85 dark:bg-brand-navy/85 backdrop-blur-xl space-y-3.5">
          {/* TOP ROW: VIEW SWITCHER + PRAYER RHYTHM TOGGLE + SEARCH INPUT */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* VIEW MODE SEGMENTED CONTROL */}
            <div
              role="tablist"
              aria-label="Schedule View Modes"
              className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-300/40 dark:border-white/10 shrink-0"
            >
              <button
                role="tab"
                aria-selected={activeView === 'timeline'}
                onClick={() => handleViewChange('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeView === 'timeline'
                    ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>{t('schedule.timelineView') || 'Timeline'}</span>
              </button>

              <button
                role="tab"
                aria-selected={activeView === 'matrix'}
                onClick={() => handleViewChange('matrix')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeView === 'matrix'
                    ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t('schedule.matrixView') || '7-Day Matrix'}</span>
              </button>

              <button
                role="tab"
                aria-selected={activeView === 'calendar'}
                onClick={() => handleViewChange('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeView === 'calendar'
                    ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{t('schedule.calendarView') || 'Calendar'}</span>
              </button>

              <button
                role="tab"
                aria-selected={activeView === 'itinerary'}
                onClick={() => handleViewChange('itinerary')}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  activeView === 'itinerary'
                    ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{t('schedule.itineraryView') || 'My Itinerary'}</span>
                {bookmarkedSessionIds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {bookmarkedSessionIds.length}
                  </span>
                )}
              </button>
            </div>

            {/* CONTROLS: DYNAMIC PRAYER RHYTHM TOGGLE + SEARCH INPUT */}
            <div className="flex items-center gap-2 grow justify-end">
              {/* Dynamic Spiritual & Meal Cadence Toggle (User requirement #2) */}
              <button
                type="button"
                onClick={handleTogglePrayers}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0 ${
                  showPrayers
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'bg-black/5 dark:bg-white/5 border-neutral-300/40 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:border-brand-gold/50'
                }`}
                title="Toggle dynamic prayer times and campus meal slots"
              >
                <Sunrise className={`w-3.5 h-3.5 ${showPrayers ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span className="hidden sm:inline">
                  {showPrayers
                    ? t('schedule.showPrayers') || 'Prayers & Meals: Visible'
                    : t('schedule.hidePrayers') || 'Prayers: Hidden'}
                </span>
                <span className="sm:hidden">Prayers</span>
                <span
                  className={`w-2 h-2 rounded-full ${showPrayers ? 'bg-emerald-400' : 'bg-neutral-400'}`}
                />
              </button>

              {/* Instant Search Bar */}
              <div className="relative grow max-w-xs">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('schedule.searchPlaceholder') || 'Search sessions, topics, scholars...'}
                  className="w-full pl-8.5 pr-8 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-300/40 dark:border-white/10 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-gold"
                    aria-label="Clear Search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: DAY SELECTOR PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            {/* All Days Pill */}
            <button
              onClick={() => handleDayChange('all')}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                selectedDay === 'all'
                  ? 'bg-brand-gold text-brand-navy border-brand-gold shadow-sm font-bold scale-[1.02]'
                  : 'bg-black/5 dark:bg-white/5 border-neutral-300/40 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-brand-gold/40'
              }`}
            >
              {t('schedule.allDays') || 'All 7 Days'}
            </button>

            {/* Individual Day 1 - 7 Pills */}
            {CAMP_DAY_THEMES.map((theme) => {
              const isSelected = selectedDay === theme.day;
              return (
                <button
                  key={theme.day}
                  onClick={() => handleDayChange(theme.day)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                    isSelected
                      ? 'bg-brand-gold text-brand-navy border-brand-gold shadow-sm font-bold scale-[1.02]'
                      : 'bg-black/5 dark:bg-white/5 border-neutral-300/40 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-brand-gold/40'
                  }`}
                >
                  <span>Day {theme.day}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-brand-navy/80 font-semibold' : 'text-neutral-400'}`}>
                    {theme.formattedDate.split(',')[0]}
                  </span>
                  {showHijri && (
                    <span className={`text-[9px] font-arabic ${isSelected ? 'text-brand-navy/70' : 'text-brand-gold'}`}>
                      {theme.hijriDate.split(' ')[0]} رجب
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SECONDARY FILTER CHIPS: TRACK & VENUE (TOGGLEABLE OR ALWAYS ACCESSIBLE) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-200/40 dark:border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3 text-brand-gold" />
                <span>Track:</span>
              </span>

              <button
                onClick={() => {
                  setSelectedTrack('all');
                  triggerLight();
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedTrack === 'all'
                    ? 'bg-brand-gold/20 text-brand-gold font-bold border border-brand-gold/40'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                All Tracks
              </button>

              {Object.keys(TRACK_METAS).map((key) => {
                const meta = TRACK_METAS[key];
                const isSelected = selectedTrack === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTrack(isSelected ? 'all' : key);
                      triggerLight();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      isSelected
                        ? `${meta.bgLight} ${meta.bgDark} ${meta.textLight} ${meta.textDark} font-bold border ${meta.borderColor}`
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    {resolveLocalized(meta.name, language)}
                  </button>
                );
              })}
            </div>

            {/* RESET FILTERS BUTTON */}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  resetFilters();
                  triggerLight();
                  soundEngine.playSnap();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors ml-auto"
                title="Reset all search filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
