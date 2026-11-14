'use client';

import React from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { getHijriDate, formatHijriLocalized } from '@/lib/calendar/hijriConverter';
import { CalendarEvent } from '@/lib/calendar/calendarGenerator';
import { useShare } from '@/hooks/useShare';
import RichLinkPreview from '@/components/preview/RichLinkPreview';
import SpeakerPreviewCard from '@/components/preview/SpeakerPreviewCard';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CalendarPlus,
  Bell,
  Sparkles,
  UserCheck,
  Share2,
} from 'lucide-react';

interface DayInspectorModalProps {
  dayNumber: number;
  dateString: string;
  onClose: () => void;
  onAddDayToCalendar: (event: CalendarEvent) => void;
  onSetDayReminder: (dayNumber: number, dateString: string, title: string) => void;
  onAddSessionToCalendar: (session: any) => void;
}

export default function DayInspectorModal({
  dayNumber,
  dateString,
  onClose,
  onAddDayToCalendar,
  onSetDayReminder,
  onAddSessionToCalendar,
}: DayInspectorModalProps) {
  const { schedule, guests } = useEvent();
  const { language, isRtl } = useApp();
  const { openShare } = useShare();

  const dayThemes: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'Camp Inception & Cohort Orientation', subtitle: 'Arrival, campus check-in, registration, and introductory keynote' },
    2: { title: 'Academic Transitions & Higher Study Horizons', subtitle: 'Demystifying modern universities, entrance examinations, and degrees' },
    3: { title: 'Intellectual Foundation & Critical Mindset', subtitle: 'Traditional Ilm synthesis with contemporary thought and ethics' },
    4: { title: 'Professional Skills Workshops & Tooling', subtitle: 'Academic writing, communications, and modern technological tools' },
    5: { title: 'Career Guidance & Global Opportunity Tracks', subtitle: 'Civil services, academia, media, law, and research careers' },
    6: { title: 'Leadership Development & Peer Mentorship', subtitle: 'Student governance, cohort synergy, and networking with seniors' },
    7: { title: 'Valedictory Synthesis, Resolution & Farewell', subtitle: 'Cohort resolutions, certificates, closing supplication, and departures' },
  };

  const dayInfo = dayThemes[dayNumber] || { title: `Day ${dayNumber} Curriculum`, subtitle: 'Leadership sessions and interactive modules' };
  const daySessions = schedule.filter((s) => s.day === dayNumber && s.published).sort((a, b) => a.order - b.order);

  const hijri = getHijriDate(new Date(dateString));
  const hijriString = formatHijriLocalized(hijri, language);

  const handleAddDay = () => {
    const dayEvent: CalendarEvent = {
      id: `day-${dayNumber}-ufuq26`,
      title: `UFUQ ’26 (Day ${dayNumber}): ${dayInfo.title}`,
      description: `${dayInfo.subtitle}\n\nSchedule highlights for Day ${dayNumber} at UFUQ '26 Leadership Camp.`,
      location: 'Alathurpadi Dars Campus & Conference Hall, Malappuram, Kerala',
      startDate: `${dateString}T08:30:00+05:30`,
      endDate: `${dateString}T19:00:00+05:30`,
      allDay: false,
    };
    onAddDayToCalendar(dayEvent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-7 overflow-hidden text-neutral-800 dark:text-neutral-100 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={`Camp Day ${dayNumber} Dossier`}
      >
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 rounded-full bg-brand-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-brand-teal/15 blur-3xl" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-brand-gold/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 text-brand-gold flex flex-col items-center justify-center border border-brand-gold/40 shadow-sm shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider">Day</span>
              <span className="font-clash font-extrabold text-base leading-none">{dayNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-brand-gold">
                  {dateString}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs text-neutral-400">
                  {hijriString}
                </span>
              </div>
              <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white mt-0.5">
                {dayInfo.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-panel border border-brand-gold/20 flex items-center justify-center hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Day Briefing Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/25 space-y-1 shrink-0 text-left rtl:text-right">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            {dayInfo.subtitle}
          </p>
        </div>

        {/* Sessions Timeline List */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-3 no-scrollbar">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 px-1">
            <span>Scheduled Sessions ({daySessions.length})</span>
            <span className="flex items-center gap-1 text-[11px] text-brand-teal">
              <MapPin className="w-3 h-3" /> Campus Hall
            </span>
          </div>

          {daySessions.length === 0 ? (
            <div className="py-12 text-center rounded-2xl glass-panel border border-white/10 text-neutral-400 text-xs">
              Sessions for Day {dayNumber} will be published shortly by ADSA academic committee.
            </div>
          ) : (
            daySessions.map((session) => {
              const speaker = guests.find((g) => g.id === session.speaker);
              const speakerName = speaker ? resolveLocalized(speaker.name, language) : null;

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl glass-panel border border-white/10 hover:border-brand-gold/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group text-left rtl:text-right"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-teal/15 text-brand-teal dark:text-emerald-400">
                        {session.startTime} – {session.endTime}
                      </span>
                      {session.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-gold/15 text-brand-gold">
                          {session.category}
                        </span>
                      )}
                    </div>
                    <h5 className="font-clash font-bold text-sm text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors">
                      {resolveLocalized(session.title, language)}
                    </h5>
                    {session.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2">
                        {resolveLocalized(session.description, language)}
                      </p>
                    )}
                    {speaker && speakerName ? (
                      <RichLinkPreview previewContent={<SpeakerPreviewCard guest={speaker} />}>
                        <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-brand-gold pt-1 cursor-pointer transition-colors">
                          <UserCheck className="w-3.5 h-3.5 text-brand-gold" />
                          <span className="underline decoration-dotted decoration-brand-gold/40">{speakerName}</span>
                        </div>
                      </RichLinkPreview>
                    ) : speakerName ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                        <UserCheck className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{speakerName}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="self-end sm:self-center flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const sessionTitle = resolveLocalized(session.title, language);
                        openShare({
                          title: `${sessionTitle} — UFUQ ’26`,
                          text: `Day ${session.day} session: ${sessionTitle} (${session.startTime} – ${session.endTime}) at UFUQ ’26.`,
                          url: `https://alathurpadidars.in#schedule?session=${session.id}`,
                          type: 'session',
                          badgeText: `Day ${session.day}`,
                          session,
                        });
                      }}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      title="Share Session"
                      aria-label="Share Session"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onAddSessionToCalendar(session)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium glass-panel border border-brand-gold/30 hover:border-brand-gold hover:bg-brand-gold/10 text-brand-navy dark:text-white flex items-center gap-1 transition-colors"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-5 pt-4 border-t border-brand-gold/20 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddDay}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs shadow-md transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Add Day {dayNumber} to Calendar</span>
            </button>
            <button
              onClick={() => onSetDayReminder(dayNumber, dateString, `UFUQ '26 Day ${dayNumber}: ${dayInfo.title}`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-brand-navy dark:text-white font-medium text-xs transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-brand-gold" />
              <span>Remind Me</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
