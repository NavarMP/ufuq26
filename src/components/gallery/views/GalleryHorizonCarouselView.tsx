'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, MapPin, Film, Sparkles } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryHorizonCarouselViewProps {
  items: GalleryItem[];
  onOpenLightbox: (index: number) => void;
}

const CATEGORY_NAMES: Record<GalleryCategory, { en: string; ml: string; ar: string }> = {
  camp_moments: { en: "Camp UFUQ ’26", ml: "ക്യാമ്പ് നിമിഷങ്ങൾ", ar: "مخيم أفق '26" },
  dars_heritage: { en: "Dars Heritage", ml: "ദർസ് പാരമ്പര്യം", ar: "تراث الدَّرْس" },
  ustad_scholars: { en: "The Respected Ustads", ml: "ഉസ്താദുമാർ", ar: "الأساتذة والعلماء" },
  adsa_initiatives: { en: "ADSA & Alumni", ml: "അഡ്സ & പൂർവ്വവിദ്യാർത്ഥികൾ", ar: "رابطة أدسا والخريجون" },
  suffa_fraternity: { en: "39+ SUFFA Dars", ml: "39+ സുഫ ദർസുകൾ", ar: "اتحاد صُفَّة" },
  suhba_life: { en: "Philosophy of SUHBA", ml: "സുഹ്ബ & സാഹോദര്യം", ar: "فلسفة الصُّحْبَة" },
  digital_craft: { en: "Digital Craft", ml: "ഡിജിറ്റൽ അനുഭവം", ar: "الإبداع الرقمي" },
};

export default function GalleryHorizonCarouselView({
  items,
  onOpenLightbox,
}: GalleryHorizonCarouselViewProps) {
  const { language, isRtl } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    soundEngine.playSnap();
    hapticEngine.trigger('subtle');
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    soundEngine.playSnap();
    hapticEngine.trigger('subtle');
  };

  const currentItem = items[currentIndex];
  const titleText = currentItem.title[language] || currentItem.title.en;
  const captionText = currentItem.caption?.[language] || currentItem.caption?.en;

  return (
    <div className="relative py-8 px-2 max-w-5xl mx-auto">
      {/* 3D Horizon Main Stage */}
      <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden glass-panel border border-brand-gold/40 shadow-2xl bg-black">
        {currentItem.mediaType === 'video' ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black/80">
            <Film className="w-16 h-16 text-brand-gold" />
          </div>
        ) : (
          <Image
            src={currentItem.url}
            alt={titleText}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-black/40 to-transparent pointer-events-none" />

        {/* Top Floating Category */}
        <div className="absolute top-6 left-6 z-20">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-gold text-brand-navy text-xs font-bold shadow-lg">
            {CATEGORY_NAMES[currentItem.category]?.[language] || currentItem.category}
          </span>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => {
            soundEngine.playChime();
            onOpenLightbox(currentIndex);
          }}
          className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-brand-gold hover:bg-black transition-colors border border-white/20"
          title="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Bottom Details Overlay */}
        <div className="absolute bottom-6 inset-x-6 z-20 text-left rtl:text-right max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-gold font-mono font-bold">
              {currentIndex + 1} / {items.length}
            </span>
            {currentItem.date && (
              <span className="text-xs text-neutral-400 font-mono">· {currentItem.date}</span>
            )}
          </div>

          <h3 className="font-clash text-2xl sm:text-3xl font-bold text-white leading-tight">
            {titleText}
          </h3>

          {captionText && (
            <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 leading-relaxed">
              {captionText}
            </p>
          )}

          {currentItem.location?.en && (
            <div className="flex items-center gap-1.5 text-xs text-brand-gold pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentItem.location[language] || currentItem.location.en}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Nav Controls */}
      <div className="flex items-center justify-between mt-6 px-2">
        <button
          onClick={isRtl ? handleNext : handlePrev}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-white text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-brand-gold" />
          <span>Previous Horizon</span>
        </button>

        {/* Thumbnail Filmstrip Preview */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto max-w-md py-1 custom-scrollbar">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playSnap();
                setCurrentIndex(idx);
              }}
              className={`relative w-12 h-10 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                idx === currentIndex
                  ? 'border-brand-gold scale-110 shadow-md shadow-brand-gold/30'
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <Image src={item.url} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>

        <button
          onClick={isRtl ? handlePrev : handleNext}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-white text-xs font-semibold hover:bg-white/10 transition-colors"
        >
          <span>Next Horizon</span>
          <ChevronRight className="w-4 h-4 text-brand-gold" />
        </button>
      </div>
    </div>
  );
}
