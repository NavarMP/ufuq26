'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { CAMP_DAY_THEMES, EXTENDED_SCHEDULE_SESSIONS, TRACK_METAS } from '@/lib/scheduleData';
import { EnhancedScheduleSession } from '@/types/schedule';
import { resolveLocalized } from '@/lib/translations';
import { soundEngine } from '@/lib/soundEngine';
import { Clock, MapPin, User, Sparkles, Star } from 'lucide-react';

interface ScheduleWeekMatrixViewProps {
  onInspectSession?: (session: EnhancedScheduleSession) => void;
}

export default function ScheduleWeekMatrixView({ onInspectSession }: ScheduleWeekMatrixViewProps) {
  const { language, isRtl } = useApp();
  const { schedule } = useEvent();
  const { selectedTrack, timeFormat, isBookmarked } = useScheduleStore();

  const allSessions: EnhancedScheduleSession[] = React.useMemo(() => {
    const baseList = schedule.length > 0 ? schedule : EXTENDED_SCHEDULE_SESSIONS;
    return baseList.map((s) => {
      const enriched = EXTENDED_SCHEDULE_SESSIONS.find((e) => e.id === s.id);
      return (enriched || s) as EnhancedScheduleSession;
    });
  }, [schedule]);

  const filteredSessions = React.useMemo(() => {
    return allSessions.filter((s) => {
      if (!s.published) return false;
      if (selectedTrack !== 'all' && s.category !== selectedTrack) return false;
      return true;
    });
  }, [allSessions, selectedTrack]);

  return (
    <div className="w-full space-y-4">
      {/* Matrix Header Notice */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-2">
        <span>7-Day Comprehensive Comparative Timetable</span>
        <span>Click any session card for complete syllabus and speaker profile</span>
      </div>

      {/* Horizontal Scrollable Matrix Grid */}
      <div className="overflow-x-auto pb-6 pt-1 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl">
        <div className="min-w-[1100px] grid grid-cols-7 divide-x divide-neutral-200/50 dark:divide-white/10">
          {CAMP_DAY_THEMES.map((theme) => {
            const daySessions = filteredSessions
              .filter((s) => s.day === theme.day)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div key={theme.day} className="flex flex-col">
                {/* Column Day Header */}
                <div
                  className="p-4 border-b border-neutral-200/50 dark:border-white/10 text-center sticky top-0 bg-brand-cream/95 dark:bg-brand-navy/95 backdrop-blur-md z-10 space-y-1"
                  style={{
                    background: `linear-gradient(180deg, ${theme.color.primary}15 0%, transparent 100%)`,
                  }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-navy">
                    Day {theme.day}
                  </span>
                  <div className="font-clash text-xs font-bold text-brand-navy dark:text-white pt-1">
                    {theme.formattedDate}
                  </div>
                  <div className="text-[10px] font-arabic text-brand-gold">
                    {theme.hijriDate}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 font-medium mt-1">
                    {resolveLocalized(theme.title, language).split(':')[0]}
                  </p>
                </div>

                {/* Column Sessions List */}
                <div className="p-3 space-y-3 flex-1 flex flex-col">
                  {daySessions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500 italic">
                      No sessions scheduled
                    </div>
                  ) : (
                    daySessions.map((session) => {
                      const trackMeta = session.category ? TRACK_METAS[session.category] : null;
                      const bookmarked = isBookmarked(session.id);
                      const title = resolveLocalized(session.title, language);

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            if (onInspectSession) onInspectSession(session);
                            soundEngine.playClick();
                          }}
                          className={`group rounded-xl p-3 border transition-all duration-200 cursor-pointer text-left rtl:text-right flex flex-col justify-between ${
                            bookmarked
                              ? 'border-brand-gold bg-brand-gold/15 shadow-md'
                              : 'border-neutral-200/60 dark:border-white/10 hover:border-brand-gold/60 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                          style={{
                            borderLeftWidth: '4px',
                            borderLeftColor: session.trackColor || trackMeta?.color || '#D4AF37',
                          }}
                        >
                          <div className="space-y-1.5">
                            {/* Time & Track Pill */}
                            <div className="flex items-center justify-between gap-1 text-[10px]">
                              <span className="font-semibold text-neutral-600 dark:text-neutral-300 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-brand-gold" />
                                <span>{session.startTime}</span>
                              </span>
                              {bookmarked && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                            </div>

                            {/* Session Title */}
                            <h4 className="font-clash text-xs font-bold text-brand-navy dark:text-white line-clamp-2 group-hover:text-brand-gold transition-colors leading-tight">
                              {title}
                            </h4>

                            {/* Track Name */}
                            <span
                              className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                trackMeta ? `${trackMeta.bgLight} ${trackMeta.bgDark} ${trackMeta.textLight} ${trackMeta.textDark}` : 'text-neutral-500'
                              }`}
                            >
                              {session.category}
                            </span>
                          </div>

                          {/* Footer: Speaker & Venue */}
                          <div className="mt-2 pt-2 border-t border-neutral-200/40 dark:border-white/5 text-[10px] text-neutral-500 dark:text-neutral-400 space-y-0.5">
                            {session.speaker && (
                              <div className="flex items-center gap-1 line-clamp-1">
                                <User className="w-2.5 h-2.5 text-brand-gold shrink-0" />
                                <span className="line-clamp-1">{session.speaker}</span>
                              </div>
                            )}
                            {session.location && (
                              <div className="flex items-center gap-1 line-clamp-1">
                                <MapPin className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                                <span className="line-clamp-1">{session.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
