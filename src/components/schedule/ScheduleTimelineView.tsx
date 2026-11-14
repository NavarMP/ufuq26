'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useScheduleStore } from '@/store/scheduleStore';
import {
  CAMP_DAY_THEMES,
  EXTENDED_SCHEDULE_SESSIONS,
  getPrayerAndPausesForDay,
} from '@/lib/scheduleData';
import { EnhancedScheduleSession, PrayerOrPauseSlot } from '@/types/schedule';
import { resolveLocalized } from '@/lib/translations';
import ScheduleSessionCard from './ScheduleSessionCard';
import ScheduleDayThemeBanner from './ScheduleDayThemeBanner';
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Coffee,
  Utensils,
  MapPin,
  Clock,
  Sparkles,
  Inbox,
  RotateCcw,
} from 'lucide-react';

interface ScheduleTimelineViewProps {
  onInspectSession?: (session: EnhancedScheduleSession) => void;
}

type TimelineItem =
  | { kind: 'session'; data: EnhancedScheduleSession; time: string }
  | { kind: 'pause'; data: PrayerOrPauseSlot; time: string };

function formatTimeDisplay(timeStr: string, format: '12h' | '24h'): string {
  if (!timeStr) return '';
  if (format === '24h') return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function ScheduleTimelineView({ onInspectSession }: ScheduleTimelineViewProps) {
  const { language, t, isRtl } = useApp();
  const { schedule } = useEvent();
  const {
    selectedDay,
    selectedTrack,
    selectedVenue,
    searchQuery,
    showPrayers,
    timeFormat,
    resetFilters,
  } = useScheduleStore();

  // Combine initial/event context sessions with enriched metadata
  const allSessions: EnhancedScheduleSession[] = React.useMemo(() => {
    // If EventContext has sessions loaded from Firebase, merge with our extended dataset
    const baseList = schedule.length > 0 ? schedule : EXTENDED_SCHEDULE_SESSIONS;
    return baseList.map((s) => {
      const enriched = EXTENDED_SCHEDULE_SESSIONS.find((e) => e.id === s.id);
      return (enriched || s) as EnhancedScheduleSession;
    });
  }, [schedule]);

  // Filter sessions based on user selections
  const filteredSessions = React.useMemo(() => {
    return allSessions.filter((s) => {
      if (!s.published) return false;

      // Day filter
      if (selectedDay !== 'all' && s.day !== selectedDay) return false;

      // Track filter
      if (selectedTrack !== 'all' && s.category !== selectedTrack) return false;

      // Venue filter
      if (selectedVenue !== 'all' && s.venueId !== selectedVenue) return false;

      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const titleEn = s.title?.en?.toLowerCase() || '';
        const titleMl = s.title?.ml?.toLowerCase() || '';
        const titleAr = s.title?.ar?.toLowerCase() || '';
        const descEn = s.description?.en?.toLowerCase() || '';
        const speaker = s.speaker?.toLowerCase() || '';
        const category = s.category?.toLowerCase() || '';
        const tags = (s.tags || []).join(' ').toLowerCase();

        const matches =
          titleEn.includes(q) ||
          titleMl.includes(q) ||
          titleAr.includes(q) ||
          descEn.includes(q) ||
          speaker.includes(q) ||
          category.includes(q) ||
          tags.includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [allSessions, selectedDay, selectedTrack, selectedVenue, searchQuery]);

  // Group by day (Day 1 to 7)
  const daysToRender = selectedDay === 'all' ? [1, 2, 3, 4, 5, 6, 7] : [selectedDay];

  const getPauseIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className="w-4 h-4 text-amber-400" />;
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Sunset':
        return <Sunset className="w-4 h-4 text-rose-400" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-cyan-400" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-gold" />;
    }
  };

  return (
    <div className="w-full space-y-12">
      {daysToRender.map((dayNum) => {
        const dayTheme = CAMP_DAY_THEMES.find((t) => t.day === dayNum) || CAMP_DAY_THEMES[0];
        const daySessions = filteredSessions.filter((s) => s.day === dayNum);
        const dayPauses = showPrayers ? getPrayerAndPausesForDay(dayNum) : [];

        // Build combined chronological timeline items
        const timelineItems: TimelineItem[] = [
          ...daySessions.map((s) => ({ kind: 'session' as const, data: s, time: s.startTime })),
          ...dayPauses.map((p) => ({ kind: 'pause' as const, data: p, time: p.time })),
        ];

        // Sort chronologically by time
        timelineItems.sort((a, b) => a.time.localeCompare(b.time));

        // If filtering results in zero sessions and prayers are hidden, skip or show empty note
        if (daySessions.length === 0 && !showPrayers) {
          return null;
        }

        return (
          <section
            key={dayNum}
            id={`day-${dayNum}`}
            aria-label={`Schedule for Day ${dayNum}`}
            className="space-y-6"
          >
            {/* Day Theme Banner */}
            <ScheduleDayThemeBanner theme={dayTheme} />

            {/* Timeline Stream */}
            <div className="relative pl-4 sm:pl-8 border-l-2 border-brand-gold/25 dark:border-brand-gold/20 space-y-5 ml-2 sm:ml-4">
              {timelineItems.length === 0 ? (
                <div className="p-6 rounded-2xl glass-panel text-center space-y-2 text-neutral-500">
                  <Inbox className="w-6 h-6 mx-auto text-brand-gold" />
                  <p className="text-xs">No sessions match your search criteria on Day {dayNum}.</p>
                </div>
              ) : (
                timelineItems.map((item, idx) => {
                  if (item.kind === 'session') {
                    return (
                      <div key={item.data.id} className="relative">
                        {/* Timeline Anchor Node */}
                        <div
                          aria-hidden="true"
                          className="absolute -left-[23px] sm:-left-[39px] top-6 w-3.5 h-3.5 rounded-full bg-brand-gold border-2 border-brand-navy shadow-md ring-4 ring-brand-gold/20"
                        />
                        <ScheduleSessionCard
                          session={item.data}
                          onInspect={onInspectSession}
                        />
                      </div>
                    );
                  }

                  // Prayer & Campus Meal Interlude (Dynamic Spiritual Rhythm)
                  const pause = item.data;
                  const isPrayer = pause.type === 'prayer' || pause.type === 'spiritual_pause';

                  return (
                    <div
                      key={pause.id}
                      className="relative rounded-2xl glass-panel p-3.5 sm:p-4 border border-dashed transition-all duration-300"
                      style={{
                        borderColor: isPrayer ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.3)',
                        background: isPrayer
                          ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 29, 50, 0.3) 100%)'
                          : 'linear-gradient(90deg, rgba(245, 158, 11, 0.06) 0%, rgba(16, 29, 50, 0.3) 100%)',
                      }}
                    >
                      {/* Timeline Anchor Node for Spiritual Pause */}
                      <div
                        aria-hidden="true"
                        className={`absolute -left-[23px] sm:-left-[39px] top-4 w-3.5 h-3.5 rounded-full border-2 border-brand-navy shadow-md ${
                          isPrayer ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-amber-400 ring-4 ring-amber-400/20'
                        }`}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 ${
                              isPrayer ? 'bg-emerald-500/15' : 'bg-amber-500/15'
                            }`}
                          >
                            {getPauseIcon(pause.icon)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-clash text-xs sm:text-sm font-bold text-brand-navy dark:text-neutral-100">
                                {resolveLocalized(pause.name, language)}
                              </h4>
                              <span className="font-arabic text-xs text-brand-gold font-medium">
                                {pause.arabicName}
                              </span>
                            </div>

                            {pause.description && (
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                                {resolveLocalized(pause.description, language)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs text-neutral-500 dark:text-neutral-400 pl-11 sm:pl-0">
                          {pause.venue && (
                            <span className="hidden md:inline-flex items-center gap-1 text-[11px]">
                              <MapPin className="w-3 h-3 text-brand-gold" />
                              <span>{pause.venue}</span>
                            </span>
                          )}

                          <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-brand-gold" />
                            <span>
                              {formatTimeDisplay(pause.time, timeFormat)}
                              {pause.endTime ? ` – ${formatTimeDisplay(pause.endTime, timeFormat)}` : ''}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        );
      })}

      {/* Global Empty State when no sessions match anywhere */}
      {filteredSessions.length === 0 && (
        <div className="rounded-3xl glass-panel p-10 sm:p-14 border border-brand-gold/30 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-14 h-14 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="font-clash text-xl font-bold text-brand-navy dark:text-white">
            No matching sessions found
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            We couldn’t find any sessions matching your active filter criteria. Try adjusting your track, venue, or search keyword.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
