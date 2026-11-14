'use client';

import React from 'react';
import { Building2, Phone, MapPin, Share2 } from 'lucide-react';
import { SuffaDars } from '@/types/index';
import { useShare } from '@/hooks/useShare';

interface DarsPreviewCardProps {
  dars: SuffaDars;
  className?: string;
  onClose?: () => void;
}

export default function DarsPreviewCard({ dars, className = '', onClose }: DarsPreviewCardProps) {
  const { openShare } = useShare();

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openShare({
      title: `${dars.nameEn} — SUFFA Dars`,
      text: `${dars.nameEn} (${dars.regNo}) · Mudarris: ${dars.mudarris} · Register for UFUQ ’26`,
      url: `https://alathurpadidars.in#register?dars=${dars.regNo}`,
      type: 'dars',
      badgeText: dars.regNo,
      dars,
    });
    if (onClose) onClose();
  };

  return (
    <div className={`w-72 sm:w-80 p-4 rounded-2xl bg-brand-cream/95 dark:bg-brand-navy/95 border border-brand-gold/30 shadow-2xl backdrop-blur-xl text-left rtl:text-right space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-mono font-bold text-[10px]">
          {dars.regNo}
        </span>
        <button
          type="button"
          onClick={handleShare}
          className="p-1 rounded-full text-neutral-400 hover:text-brand-gold transition-colors"
          title="Share Dars"
          aria-label="Share Dars"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <h4 className="font-clash text-sm font-bold text-brand-navy dark:text-white leading-snug">
          {dars.nameEn}
        </h4>
        {dars.nameMl && (
          <p className="text-xs text-brand-gold font-medium mt-0.5">{dars.nameMl}</p>
        )}
      </div>

      <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-400">Mudarris:</span>
          <span className="font-medium text-neutral-800 dark:text-neutral-200">{dars.mudarris}</span>
        </div>
        {dars.district && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>{dars.district}</span>
          </div>
        )}
      </div>
    </div>
  );
}
