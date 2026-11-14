'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useReminders } from '@/context/ReminderContext';
import { useShare } from '@/hooks/useShare';
import { useScheduleStore } from '@/store/scheduleStore';
import { EnhancedScheduleSession } from '@/types/schedule';
import { TRACK_METAS, CAMP_VENUES } from '@/lib/scheduleData';
import { resolveLocalized } from '@/lib/translations';
import { CalendarEvent } from '@/lib/calendar/calendarGenerator';
import AddToCalendarDropdown from '@/components/calendar/AddToCalendarDropdown';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Clock,
  MapPin,
  User,
  Star,
  Bell,
  Share2,
  ChevronDown,
  Sparkles,
  Info,
  Check,
  Calendar as CalendarIcon,
  BookOpen,
} from 'lucide-react';

interface ScheduleSessionCardProps {
  session: EnhancedScheduleSession;
  onInspect?: (session: EnhancedScheduleSession) => void;
  compact?: boolean;
}

function formatTimeSlot(timeStr: string, format: '12h' | '24h'): string {
  if (!timeStr) return '';
  if (format === '24h') return timeStr;
  const [hStr, mStr] = timeStr.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function calculateDuration(start: string, end: string): string {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const totalMins = eh * 60 + em - (sh * 60 + sm);
  if (totalMins <= 0) return '';
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

export default function ScheduleSessionCard({
  session,
  onInspect,
  compact = false,
}: ScheduleSessionCardProps) {
  const { language, t, isRtl } = useApp();
  const { guests } = useEvent();
  const { openReminderModal } = useReminders();
  const { openShare } = useShare();
  const { timeFormat, toggleBookmark, isBookmarked } = useScheduleStore();
  const { triggerLight, triggerPop } = useHapticFeedback();

  const [isExpanded, setIsExpanded] = useState(false);

  const bookmarked = isBookmarked(session.id);
  const trackMeta = session.category ? TRACK_METAS[session.category] : null;

  // Resolve matching venue
  const venue = session.venueId ? CAMP_VENUES.find((v) => v.id === session.venueId) : null;
  const venueName = venue ? resolveLocalized(venue.name, language) : session.location || 'Alathurpadi Campus';

  // Resolve matching guest speaker
  const speakerGuest = session.speakerGuestId ? guests.find((g) => g.id === session.speakerGuestId) : null;
  const speakerName = speakerGuest
    ? resolveLocalized(speakerGuest.name, language)
    : session.speaker || 'ADSA Academic Faculty';

  const title = resolveLocalized(session.title, language);
  const description = session.description ? resolveLocalized(session.description, language) : '';

  const duration = calculateDuration(session.startTime, session.endTime);

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

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(session.id);
    triggerPop();
    soundEngine.playChime();
  };

  const handleReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerLight();
    soundEngine.playClick();
    openShare({
      title: `${title} — UFUQ ’26`,
      text: `Day ${session.day} Session at UFUQ '26: ${title} (${session.startTime} - ${session.endTime})`,
      url: `https://alathurpadidars.in/schedule?session=${session.id}`,
      type: 'session',
      badgeText: `Day ${session.day}`,
      session,
    });
  };

  const handleCardClick = () => {
    if (onInspect) {
      onInspect(session);
      soundEngine.playClick();
    } else {
      setIsExpanded(!isExpanded);
      soundEngine.playClick();
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative rounded-2xl glass-panel border transition-all duration-300 cursor-pointer overflow-hidden ${
        compact ? 'p-4' : 'p-5 sm:p-6'
      } ${
        bookmarked
          ? 'border-brand-gold bg-brand-gold/5 shadow-xl shadow-brand-gold/10'
          : 'border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 hover:shadow-xl'
      }`}
      style={{
        borderLeftWidth: '5px',
        borderLeftColor: session.trackColor || trackMeta?.color || '#D4AF37',
      }}
    >
      {/* CARD HEADER: TRACK, TIME, DURATION, KEYNOTE & BOOKMARK */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Day & Track Pill */}
          <span
            className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
              trackMeta
                ? `${trackMeta.bgLight} ${trackMeta.bgDark} ${trackMeta.textLight} ${trackMeta.textDark} ${trackMeta.borderColor}`
                : 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
            }`}
          >
            Day {session.day} · {session.category || 'General'}
          </span>

          {/* Keynote Star Pill */}
          {session.isKeynote && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-400/40">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Flagship</span>
            </span>
          )}
        </div>

        {/* TIME & BOOKMARK CLUSTER */}
        <div className="flex items-center gap-2">
          {/* Time & Duration */}
          <div className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>
              {formatTimeSlot(session.startTime, timeFormat)} – {formatTimeSlot(session.endTime, timeFormat)}
            </span>
            {duration && (
              <span className="hidden sm:inline text-[11px] text-neutral-400 font-normal">
                ({duration})
              </span>
            )}
          </div>

          {/* Bookmark / Star Button */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              bookmarked
                ? 'text-amber-400 bg-amber-400/20 scale-110'
                : 'text-neutral-400 hover:text-amber-400 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            title={bookmarked ? t('schedule.removeBookmark') || 'Remove from itinerary' : t('schedule.bookmark') || 'Save to itinerary'}
            aria-label="Bookmark Session"
          >
            <Star className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* SESSION TITLE */}
      <h3 className="font-clash text-base sm:text-lg md:text-xl font-bold text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors leading-snug">
        {title}
      </h3>

      {/* DESCRIPTION */}
      {description && (
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
          {description}
        </p>
      )}

      {/* SPEAKER & VENUE ROW */}
      <div className="mt-4 pt-3.5 border-t border-neutral-200/50 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex flex-wrap items-center gap-4">
          {/* Speaker */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 font-bold text-[10px]">
              <User className="w-3 h-3" />
            </div>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {speakerName}
            </span>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span className="line-clamp-1">{venueName}</span>
          </div>
        </div>

        {/* QUICK ACTION BUTTONS */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 shrink-0"
        >
          {/* Add to Calendar Dropdown */}
          <div className="relative">
            <AddToCalendarDropdown
              event={calendarEvent}
              buttonLabel="Add to Cal"
            />
          </div>

          {/* Set Reminder Button */}
          <button
            type="button"
            onClick={handleReminderClick}
            className="p-1.5 rounded-xl glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
            title={t('schedule.setReminder') || 'Set Reminder'}
            aria-label="Set Reminder"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* Share Session Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="p-1.5 rounded-xl glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold/60 text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
            title={t('schedule.shareSession') || 'Share Session'}
            aria-label="Share Session"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand Syllabus / Details */}
          {onInspect ? (
            <button
              type="button"
              onClick={() => onInspect(session)}
              className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-gold/15 text-neutral-700 dark:text-neutral-300 hover:text-brand-gold text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>Details</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-brand-gold transition-colors"
              aria-label="Expand syllabus"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* EXPANDED ACCORDION: LEARNING OUTCOMES & PREREQUISITES */}
      {isExpanded && !onInspect && (
        <div className="mt-4 pt-4 border-t border-neutral-200/60 dark:border-white/10 space-y-3 text-xs animate-fade-in">
          {session.learningOutcomes && session.learningOutcomes.length > 0 && (
            <div>
              <span className="font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                <span>Core Outcomes:</span>
              </span>
              <ul className="grid sm:grid-cols-2 gap-1.5 pl-2">
                {session.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-neutral-600 dark:text-neutral-400">
                    <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{resolveLocalized(outcome, language)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {session.prerequisites && (
            <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
              <span>
                <strong>Prerequisites:</strong> {resolveLocalized(session.prerequisites, language)}
              </span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
