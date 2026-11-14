'use client';

import React from 'react';
import Image from 'next/image';
import { User, Share2, ArrowRight } from 'lucide-react';
import { Guest } from '@/types/index';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { useShare } from '@/hooks/useShare';

interface SpeakerPreviewCardProps {
  guest: Guest;
  className?: string;
  onClose?: () => void;
}

export default function SpeakerPreviewCard({ guest, className = '', onClose }: SpeakerPreviewCardProps) {
  const { language } = useApp();
  const { openShare } = useShare();

  const name = resolveLocalized(guest.name, language);
  const title = guest.title ? resolveLocalized(guest.title, language) : '';
  const bio = guest.bio ? resolveLocalized(guest.bio, language) : '';

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openShare({
      title: `${name} — Guest Speaker at UFUQ ’26`,
      text: `${name}${title ? ` (${title})` : ''} at UFUQ ’26 Transition & Leadership Camp.`,
      url: `https://alathurpadidars.in#guests?id=${guest.id}`,
      type: 'guest',
      badgeText: 'Guest Speaker',
      guest,
    });
    if (onClose) onClose();
  };

  return (
    <div className={`w-72 sm:w-80 p-4 rounded-2xl bg-brand-cream/95 dark:bg-brand-navy/95 border border-brand-gold/30 shadow-2xl backdrop-blur-xl text-left rtl:text-right space-y-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-navy border-2 border-brand-gold shrink-0">
          {guest.photoUrl ? (
            <Image src={guest.photoUrl} alt={name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-gold">
              <User className="w-6 h-6" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">Speaker</span>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 rounded-full text-neutral-400 hover:text-brand-gold transition-colors"
              title="Share Speaker"
              aria-label="Share Speaker"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <h4 className="font-clash text-sm font-bold text-brand-navy dark:text-white truncate">
            {name}
          </h4>
          {title && (
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
              {title}
            </p>
          )}
        </div>
      </div>

      {bio && (
        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
          {bio}
        </p>
      )}

      <div className="pt-1.5 border-t border-brand-gold/15 flex items-center justify-between text-[11px]">
        <a
          href="#guests"
          onClick={onClose}
          className="inline-flex items-center gap-1 font-semibold text-brand-gold hover:underline"
        >
          <span>View Profile</span>
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
        </a>
      </div>
    </div>
  );
}
