'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Maximize2, MapPin, Sparkles, Film, Star, Quote } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryEditorialBentoViewProps {
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

export default function GalleryEditorialBentoView({
  items,
  onOpenLightbox,
}: GalleryEditorialBentoViewProps) {
  const { language } = useApp();

  return (
    <div className="space-y-6">
      {/* Chunk items into editorial sets of 5 */}
      {Array.from({ length: Math.ceil(items.length / 5) }).map((_, setIdx) => {
        const slice = items.slice(setIdx * 5, setIdx * 5 + 5);
        const heroItem = slice[0];
        const secondaryItems = slice.slice(1);

        return (
          <div key={setIdx} className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            {/* Main Feature / Lead Card */}
            {heroItem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => {
                  soundEngine.playSnap();
                  hapticEngine.trigger('selection');
                  onOpenLightbox(setIdx * 5);
                }}
                className="md:col-span-7 relative min-h-[360px] sm:min-h-[460px] rounded-3xl overflow-hidden glass-panel border border-brand-gold/40 hover:border-brand-gold shadow-2xl bg-black cursor-pointer group flex flex-col justify-end"
              >
                <div className="absolute inset-0 bg-black/60 overflow-hidden">
                  {heroItem.mediaType === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-black/80">
                      <Film className="w-12 h-12 text-brand-gold" />
                    </div>
                  ) : (
                    <Image
                      src={heroItem.url}
                      alt={heroItem.title.en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-black/40 to-black/10 group-hover:from-brand-navy-dark/95 transition-all duration-300" />
                </div>

                {/* Top Badges */}
                <div className="absolute top-5 inset-x-5 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-brand-gold text-brand-navy text-xs font-bold shadow-lg">
                    {CATEGORY_NAMES[heroItem.category]?.[language] || heroItem.category}
                  </span>
                  <div className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-brand-gold">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 p-6 sm:p-8 space-y-2 text-left rtl:text-right">
                  <h3 className="font-clash text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-gold transition-colors leading-tight">
                    {heroItem.title[language] || heroItem.title.en}
                  </h3>
                  {heroItem.caption?.en && (
                    <p className="text-xs sm:text-sm text-neutral-300 max-w-xl line-clamp-2">
                      {heroItem.caption[language] || heroItem.caption.en}
                    </p>
                  )}
                  {heroItem.location?.en && (
                    <div className="flex items-center gap-1.5 text-xs text-brand-gold pt-2 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{heroItem.location[language] || heroItem.location.en}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Secondary Grid (4 cards in 2x2 or quote) */}
            <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {secondaryItems.map((item, subIdx) => {
                const itemIndex = setIdx * 5 + subIdx + 1;
                const titleText = item.title[language] || item.title.en;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: subIdx * 0.08 }}
                    onClick={() => {
                      soundEngine.playSnap();
                      hapticEngine.trigger('selection');
                      onOpenLightbox(itemIndex);
                    }}
                    className="group relative min-h-[180px] rounded-3xl overflow-hidden glass-panel border border-brand-gold/30 hover:border-brand-gold shadow-lg bg-black cursor-pointer flex flex-col justify-end"
                  >
                    <div className="absolute inset-0 bg-black/60 overflow-hidden">
                      {item.mediaType === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-black/80">
                          <Film className="w-8 h-8 text-brand-gold" />
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={titleText}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          unoptimized
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>

                    <div className="relative z-10 p-4 space-y-1 text-left rtl:text-right">
                      <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                        {CATEGORY_NAMES[item.category]?.[language] || item.category}
                      </span>
                      <h4 className="font-clash text-sm font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                        {titleText}
                      </h4>
                    </div>
                  </motion.div>
                );
              })}

              {/* Scholastic Inscription Card if only 1-3 secondary items */}
              {secondaryItems.length < 4 && (
                <div className="p-6 rounded-3xl glass-panel border border-brand-gold/25 bg-gradient-to-br from-brand-gold/10 to-transparent flex flex-col justify-between text-left rtl:text-right">
                  <Quote className="w-6 h-6 text-brand-gold mb-2 opacity-80" />
                  <p className="text-xs text-neutral-300 italic leading-relaxed">
                    “The sacred halaqah does not end at the graduation gate; it expands into universities, research laboratories, and societal service.”
                  </p>
                  <span className="text-[11px] text-brand-gold font-bold mt-3 block">
                    — The Suhbah Horizon
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
