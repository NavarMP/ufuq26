'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useReminders } from '@/context/ReminderContext';
import { useShare } from '@/hooks/useShare';
import { useScheduleStore } from '@/store/scheduleStore';
import { EnhancedScheduleSession } from '@/types/schedule';
import { CAMP_VENUES, TRACK_METAS } from '@/lib/scheduleData';
import { resolveLocalized } from '@/lib/translations';
import { CalendarEvent } from '@/lib/calendar/calendarGenerator';
import AddToCalendarDropdown from '@/components/calendar/AddToCalendarDropdown';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  X,
  Clock,
  MapPin,
  User,
  Star,
  Bell,
  Share2,
  Sparkles,
  CheckCircle2,
  Info,
  Calendar as CalendarIcon,
  Layers,
  Building,
} from 'lucide-react';

interface ScheduleSessionDetailModalProps {
  session: EnhancedScheduleSession | null;
  onClose: () => void;
}

export default function ScheduleSessionDetailModal({
  session,
  onClose,
}: ScheduleSessionDetailModalProps) {
  const { language, t, isRtl } = useApp();
  const { guests } = useEvent();
  const { openReminderModal } = useReminders();
  const { openShare } = useShare();
  const { timeFormat, toggleBookmark, isBookmarked } = useScheduleStore();
  const { triggerLight, triggerPop } = useHapticFeedback();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!session) return null;

  const bookmarked = isBookmarked(session.id);
  const trackMeta = session.category ? TRACK_METAS[session.category] : null;

  // Venue details
  const venue = session.venueId ? CAMP_VENUES.find((v) => v.id === session.venueId) : null;
  const venueName = venue ? resolveLocalized(venue.name, language) : session.location || 'Alathurpadi Campus';

  // Speaker details
  const speakerGuest = session.speakerGuestId ? guests.find((g) => g.id === session.speakerGuestId) : null;
  const speakerName = speakerGuest
    ? resolveLocalized(speakerGuest.name, language)
    : session.speaker || 'ADSA Academic Faculty';
  const speakerTitle = speakerGuest?.title ? resolveLocalized(speakerGuest.title, language) : 'Visiting Faculty & Mentor';
  const speakerBio = speakerGuest?.bio ? resolveLocalized(speakerGuest.bio, language) : '';

  const title = resolveLocalized(session.title, language);
  const description = session.description ? resolveLocalized(session.description, language) : '';

  const calendarEvent: CalendarEvent = {
    id: session.id,
    title: `${title} (UFUQ '26 - Day ${session.day})`,
    description: `${description}\n\nVenue: ${venueName}\nOrganized by ADSA.`,
    location: `${venueName}, Alathurpadi Dars Campus, Malappuram, Kerala`,
    startDate: `${session.date}T${session.startTime}:00+05:30`,
    endDate: `${session.date}T${session.endTime}:00+05:30`,
    allDay: false,
    url: 'https://alathurpadidars.in/schedule',
  };

  const handleBookmark = () => {
    toggleBookmark(session.id);
    triggerPop();
    soundEngine.playChime();
  };

  const handleReminder = () => {
    triggerLight();
    soundEngine.playClick();
    openReminderModal({
      targetType: 'specific_session',
      targetId: session.id,
      title: `UFUQ '26: ${title}`,
      description: `Starts at ${session.startTime} on ${session.date} at ${venueName}.`,
      targetDateTime: `${session.date}T${session.startTime}:00+05:30`,
      preset: '2_hours_before',
    });
  };

  const handleShare = () => {
    triggerLight();
    soundEngine.playClick();
    openShare({
      title: `${title} — UFUQ ’26`,
      text: `Day ${session.day} Masterclass at UFUQ '26: ${title}`,
      url: `https://alathurpadidars.in/schedule?session=${session.id}`,
      type: 'session',
      badgeText: `Day ${session.day}`,
      session,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel p-6 sm:p-8 border-2 border-brand-gold/40 shadow-2xl bg-brand-cream/95 dark:bg-brand-navy/95 space-y-6 text-left rtl:text-right"
      >
        {/* HEADER: DAY, TRACK, KEYNOTE & CLOSE BUTTON */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-brand-gold text-brand-navy">
                Day {session.day}
              </span>

              {session.category && (
                <span className="text-[11px] font-semibold text-brand-gold">
                  {session.category}
                </span>
              )}

              {session.isKeynote && (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-400/40">
                  <Sparkles className="w-3 h-3" />
                  <span>Flagship</span>
                </span>
              )}
            </div>

            <h3
              id="session-modal-title"
              className="font-clash text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-navy dark:text-white pt-1 leading-tight"
            >
              {title}
            </h3>
          </div>

          <button
            onClick={() => {
              onClose();
              soundEngine.playClick();
            }}
            className="p-2 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 text-neutral-500 hover:text-brand-gold transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TIME & VENUE BADGE ROW */}
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-800 dark:text-neutral-200">
            <Clock className="w-4 h-4 text-brand-gold shrink-0" />
            <span>
              {session.date} · {session.startTime} – {session.endTime}
            </span>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 hidden sm:inline-block" />

          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
            <MapPin className="w-4 h-4 text-brand-teal dark:text-emerald-400 shrink-0" />
            <span>{venueName}</span>
          </div>
        </div>

        {/* FULL DESCRIPTION */}
        {description && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Overview</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* LEARNING OUTCOMES */}
        {session.learningOutcomes && session.learningOutcomes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              <span>Key Learning Outcomes</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {session.learningOutcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-200/40 dark:border-white/5 flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{resolveLocalized(outcome, language)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PREREQUISITES */}
        {session.prerequisites && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Preparation & Prerequisites:</strong>
              <p className="mt-0.5">{resolveLocalized(session.prerequisites, language)}</p>
            </div>
          </div>
        )}

        {/* SPEAKER SECTION */}
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/30 flex items-start gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-gold/20 shrink-0 flex items-center justify-center font-bold text-brand-gold border border-brand-gold/40">
            {speakerGuest?.photoUrl ? (
              <Image
                src={speakerGuest.photoUrl}
                alt={speakerName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
              Faculty / Speaker
            </span>
            <h5 className="font-clash text-base font-bold text-brand-navy dark:text-white">
              {speakerName}
            </h5>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{speakerTitle}</p>
            {speakerBio && (
              <p className="text-xs text-neutral-600 dark:text-neutral-300 pt-1 line-clamp-3">
                {speakerBio}
              </p>
            )}
          </div>
        </div>

        {/* VENUE FACILITY DETAILS */}
        {venue && (
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/40 dark:border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-brand-gold" />
                <span>Venue Amenities & Capacity</span>
              </span>
              <span className="text-neutral-500">
                {venue.building} · {venue.floor} (Cap: {venue.capacity})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {venue.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* MODAL ACTION BAR */}
        <div className="pt-4 border-t border-neutral-200/50 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
              bookmarked
                ? 'bg-amber-400 text-brand-navy shadow-md'
                : 'glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-200'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${bookmarked ? 'fill-brand-navy' : ''}`} />
            <span>{bookmarked ? 'Saved in Itinerary' : 'Save to Itinerary'}</span>
          </button>

          <div className="flex items-center gap-2">
            <AddToCalendarDropdown
              event={calendarEvent}
              buttonLabel="Add to Calendar"
            />

            <button
              onClick={handleReminder}
              className="p-2.5 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-300 hover:text-brand-gold transition-colors"
              title="Set Reminder"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-300 hover:text-brand-gold transition-colors"
              title="Share Session"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
