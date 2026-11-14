'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Calendar, MapPin, Sparkles, Film, Clock } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryChronologicalTimelineProps {
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

export default function GalleryChronologicalTimeline({
  items,
  onOpenLightbox,
}: GalleryChronologicalTimelineProps) {
  const { language } = useApp();

  return (
    <div className="relative max-w-4xl mx-auto py-8">
      {/* Central Golden Spine */}
      <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-brand-gold via-amber-400 to-brand-gold/20" />

      <div className="space-y-8">
        {items.map((item, idx) => {
          const isEven = idx % 2 === 0;
          const titleText = item.title[language] || item.title.en;
          const captionText = item.caption?.[language] || item.caption?.en;
          const catLabel = CATEGORY_NAMES[item.category]?.[language] || item.category;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={`relative flex items-center ${
                isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'
              } flex-col pl-12 sm:pl-0`}
            >
              {/* Central Glowing Node */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-gold border-4 border-brand-navy z-20 shadow-lg shadow-brand-gold/50" />

              {/* Card Container */}
              <div className="w-full sm:w-1/2 sm:px-6">
                <div
                  onClick={() => {
                    soundEngine.playSnap();
                    hapticEngine.trigger('selection');
                    onOpenLightbox(idx);
                  }}
                  className="group rounded-3xl overflow-hidden glass-panel border border-brand-gold/30 hover:border-brand-gold shadow-xl bg-black/40 cursor-pointer p-4 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-3.5 bg-black/60">
                    {item.mediaType === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-black/80">
                        <Film className="w-8 h-8 text-brand-gold" />
                      </div>
                    ) : (
                      <Image
                        src={item.url}
                        alt={titleText}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-brand-gold border border-brand-gold/30">
                      {catLabel}
                    </div>
                  </div>

                  {/* Date & Hijri header */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
                    <span className="flex items-center gap-1 text-brand-gold font-bold">
                      <Clock className="w-3 h-3" />
                      {item.date || 'Horizon Era'}
                    </span>
                    {item.hijriDate && (
                      <span className="font-arabic text-brand-gold-light">{item.hijriDate}</span>
                    )}
                  </div>

                  {/* Title & Caption */}
                  <h4 className="font-clash text-base font-bold text-white group-hover:text-brand-gold transition-colors">
                    {titleText}
                  </h4>
                  {captionText && (
                    <p className="text-xs text-neutral-300 line-clamp-2 mt-1">
                      {captionText}
                    </p>
                  )}
                  {item.location?.en && (
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-2">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      <span>{item.location[language] || item.location.en}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
