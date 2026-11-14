'use client';

import React from 'react';
import { Calendar, Clock, Share2, ArrowRight } from 'lucide-react';
import { ScheduleSession } from '@/types/index';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { useShare } from '@/hooks/useShare';

interface SessionPreviewCardProps {
  session: ScheduleSession;
  className?: string;
  onClose?: () => void;
}

export default function SessionPreviewCard({ session, className = '', onClose }: SessionPreviewCardProps) {
  const { language } = useApp();
  const { openShare } = useShare();

  const title = resolveLocalized(session.title, language);
  const description = resolveLocalized(session.description, language);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openShare({
      title: `${title} — UFUQ ’26`,
      text: `Day ${session.day} session: ${title} (${session.startTime} - ${session.endTime})`,
      url: `https://alathurpadidars.in#schedule?session=${session.id}`,
      type: 'session',
      badgeText: `Day ${session.day}`,
      session,
    });
    if (onClose) onClose();
  };

  return (
    <div className={`w-72 sm:w-80 p-4 rounded-2xl bg-brand-cream/95 dark:bg-brand-navy/95 border border-brand-gold/30 shadow-2xl backdrop-blur-xl text-left rtl:text-right space-y-2.5 ${className}`}>
      {/* Category & Day Pill */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-bold text-[10px] uppercase tracking-wide">
          Day {session.day} · {session.category || 'Session'}
        </span>
        <button
          type="button"
          onClick={handleShare}
          className="p-1 rounded-full text-neutral-400 hover:text-brand-gold transition-colors"
          title="Share Session"
          aria-label="Share Session"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Session Title */}
      <h4 className="font-clash text-sm font-bold text-brand-navy dark:text-white leading-snug line-clamp-2">
        {title}
      </h4>

      {/* Time & Speaker */}
      <div className="flex flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          <span>{session.startTime} – {session.endTime}</span>
        </div>

        {session.speaker && (
          <div className="text-[11px] font-medium text-brand-gold">
            Led by {session.speaker}
          </div>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Bottom CTA */}
      <div className="pt-1.5 border-t border-brand-gold/15 flex items-center justify-between text-[11px]">
        <a
          href="#schedule"
          onClick={onClose}
          className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:underline"
        >
          <span>View in Schedule</span>
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
        </a>
      </div>
    </div>
  );
}
