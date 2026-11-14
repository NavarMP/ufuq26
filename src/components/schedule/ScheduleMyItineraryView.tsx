'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { EXTENDED_SCHEDULE_SESSIONS } from '@/lib/scheduleData';
import { EnhancedScheduleSession } from '@/types/schedule';
import { resolveLocalized } from '@/lib/translations';
import ScheduleSessionCard from './ScheduleSessionCard';
import { formatSessionsToIcs } from '@/lib/export/formatters/icsFormatter';
import { createTextBlob, triggerBlobDownload } from '@/lib/export/utils/downloadHelper';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Bookmark,
  Clock,
  Sparkles,
  AlertTriangle,
  Download,
  Printer,
  CalendarPlus,
  Trash2,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ScheduleMyItineraryViewProps {
  onInspectSession?: (session: EnhancedScheduleSession) => void;
}

export default function ScheduleMyItineraryView({ onInspectSession }: ScheduleMyItineraryViewProps) {
  const { language, t, isRtl } = useApp();
  const { schedule } = useEvent();
  const { bookmarkedSessionIds, setActiveView } = useScheduleStore();
  const { triggerSuccess, triggerLight } = useHapticFeedback();

  const allSessions: EnhancedScheduleSession[] = React.useMemo(() => {
    const baseList = schedule.length > 0 ? schedule : EXTENDED_SCHEDULE_SESSIONS;
    return baseList.map((s) => {
      const enriched = EXTENDED_SCHEDULE_SESSIONS.find((e) => e.id === s.id);
      return (enriched || s) as EnhancedScheduleSession;
    });
  }, [schedule]);

  // Saved sessions sorted chronologically
  const savedSessions = React.useMemo(() => {
    return allSessions
      .filter((s) => bookmarkedSessionIds.includes(s.id))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [allSessions, bookmarkedSessionIds]);

  // Calculate total contact hours
  const totalMinutes = savedSessions.reduce((acc, s) => {
    const [sh, sm] = s.startTime.split(':').map(Number);
    const [eh, em] = s.endTime.split(':').map(Number);
    return acc + (eh * 60 + em - (sh * 60 + sm));
  }, 0);

  const totalHours = (totalMinutes / 60).toFixed(1);

  // Clash Detection Algorithm
  const clashes = React.useMemo(() => {
    const conflicts: { sessionA: EnhancedScheduleSession; sessionB: EnhancedScheduleSession }[] = [];
    for (let i = 0; i < savedSessions.length; i++) {
      for (let j = i + 1; j < savedSessions.length; j++) {
        const a = savedSessions[i];
        const b = savedSessions[j];
        if (a.date === b.date) {
          const [ash, asm] = a.startTime.split(':').map(Number);
          const [aeh, aem] = a.endTime.split(':').map(Number);
          const [bsh, bsm] = b.startTime.split(':').map(Number);
          const [beh, bem] = b.endTime.split(':').map(Number);

          const aStart = ash * 60 + asm;
          const aEnd = aeh * 60 + aem;
          const bStart = bsh * 60 + bsm;
          const bEnd = beh * 60 + bem;

          // Check interval overlap
          if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
            conflicts.push({ sessionA: a, sessionB: b });
          }
        }
      }
    }
    return conflicts;
  }, [savedSessions]);

  const handleExportPersonalIcs = () => {
    triggerSuccess();
    soundEngine.playSuccess();

    const calendarItems = savedSessions.map((s) => ({
      id: s.id,
      title: resolveLocalized(s.title, language),
      description: s.description ? resolveLocalized(s.description, language) : `UFUQ ’26 - Day ${s.day} Session`,
      location: s.location || 'Alathurpadi Dars Campus & Conference Hall, Malappuram',
      startDate: `${s.date}T${s.startTime}:00+05:30`,
      endDate: `${s.date}T${s.endTime}:00+05:30`,
      category: s.category,
      url: 'https://alathurpadidars.in/schedule',
    }));

    const icsContent = formatSessionsToIcs(calendarItems, "My UFUQ ’26 Personal Camp Itinerary");
    const blob = createTextBlob(icsContent, 'text/calendar', false);
    triggerBlobDownload(blob, 'My_UFUQ26_Personal_Schedule.ics');
  };

  const handlePrintPersonal = () => {
    soundEngine.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (savedSessions.length === 0) {
    return (
      <div className="rounded-3xl glass-panel p-10 sm:p-16 border border-brand-gold/40 text-center space-y-5 max-w-2xl mx-auto my-8 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center mx-auto shadow-inner">
          <Bookmark className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-clash text-2xl font-bold text-brand-navy dark:text-white">
            Your Personal Camp Itinerary is Empty
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
            {t('schedule.noBookmarkedSessions') ||
              'Click the star icon on any masterclass card in the Timeline or 7-Day Matrix to bookmark sessions and build your custom attendance roadmap.'}
          </p>
        </div>
        <button
          onClick={() => {
            setActiveView('timeline');
            triggerLight();
            soundEngine.playSnap();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all"
        >
          <span>Explore Timeline Sessions</span>
          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* ITINERARY SUMMARY METRICS CARD */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/40 shadow-2xl bg-gradient-to-br from-brand-navy/20 via-brand-dark/10 to-brand-gold/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personalized Camp Plan</span>
            </span>
            <h3 className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-navy dark:text-white">
              My Selected Masterclasses & Assemblies
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              {savedSessions.length} sessions selected across the seven-day residential residency.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl glass-panel border border-brand-gold/30 text-center">
              <div className="font-clash text-2xl font-bold text-brand-gold">{savedSessions.length}</div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Sessions</div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl glass-panel border border-brand-teal/30 text-center">
              <div className="font-clash text-2xl font-bold text-brand-teal dark:text-emerald-400">{totalHours}h</div>
              <div className="text-[10px] uppercase font-bold text-neutral-400">Study Hours</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-neutral-200/40 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPersonalIcs}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download My Itinerary (.ics)</span>
            </button>

            <button
              onClick={handlePrintPersonal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print My Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* CLASH WARNING BANNER IF CONFLICTS EXIST */}
      {clashes.length > 0 && (
        <div className="rounded-2xl bg-amber-500/15 border-2 border-amber-400/50 p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 dark:text-amber-200 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-clash text-sm font-bold">Schedule Overlap Detected</h4>
            <p className="text-xs leading-relaxed">
              You have {clashes.length} overlapping session(s). For instance, &ldquo;{resolveLocalized(clashes[0].sessionA.title, language)}&rdquo; conflicts with &ldquo;{resolveLocalized(clashes[0].sessionB.title, language)}&rdquo;. Consider reviewing parallel tracks.
            </p>
          </div>
        </div>
      )}

      {/* SAVED SESSIONS LIST */}
      <div className="space-y-4">
        {savedSessions.map((session) => (
          <ScheduleSessionCard
            key={session.id}
            session={session}
            onInspect={onInspectSession}
          />
        ))}
      </div>
    </div>
  );
}
