'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Maximize2, MapPin, Sparkles, Film, Star } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryMasonryViewProps {
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

export default function GalleryMasonryView({
  items,
  onOpenLightbox,
}: GalleryMasonryViewProps) {
  const { language } = useApp();

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {items.map((item, idx) => {
        const titleText = item.title[language] || item.title.en;
        const captionText = item.caption?.[language] || item.caption?.en;
        const catLabel = CATEGORY_NAMES[item.category]?.[language] || item.category;

        // Dynamic aspect ratio calculation based on metadata or fallback
        const aspectClass =
          item.aspectRatio === 'portrait'
            ? 'aspect-[3/4]'
            : item.aspectRatio === 'square'
            ? 'aspect-square'
            : item.aspectRatio === 'ultrawide'
            ? 'aspect-[21/9]'
            : 'aspect-[16/10]';

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (idx % 6) * 0.05 }}
            onClick={() => {
              soundEngine.playSnap();
              hapticEngine.trigger('selection');
              onOpenLightbox(idx);
            }}
            className="group break-inside-avoid relative rounded-3xl overflow-hidden glass-panel border border-brand-gold/30 hover:border-brand-gold shadow-xl bg-black/40 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-brand-gold/10"
          >
            {/* Media Image */}
            <div className={`relative w-full ${aspectClass} overflow-hidden bg-black/60`}>
              {item.mediaType === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                  <Film className="w-10 h-10 text-brand-gold" />
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={titleText}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  unoptimized
                />
              )}

              {/* Gradient Shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 group-hover:from-black/95 transition-all duration-300" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-brand-gold text-[10px] font-semibold border border-brand-gold/40">
                  {catLabel}
                </span>

                <div className="flex items-center gap-1">
                  {item.featured && (
                    <span className="p-1 rounded-full bg-brand-gold text-brand-navy shadow" title="Featured">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                  {item.heroSpotlight && (
                    <span className="p-1 rounded-full bg-amber-400 text-brand-navy shadow" title="Spotlight">
                      <Sparkles className="w-3 h-3 fill-current" />
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(idx);
                    }}
                    className="p-1.5 rounded-full bg-black/60 text-white/80 hover:text-brand-gold hover:bg-black/90 transition-colors backdrop-blur-md"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 space-y-1 text-left rtl:text-right z-10">
                <h4 className="font-clash text-sm sm:text-base font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {titleText}
                </h4>

                {captionText && (
                  <p className="text-[11px] text-neutral-300 line-clamp-2 leading-relaxed">
                    {captionText}
                  </p>
                )}

                {item.location?.en && (
                  <div className="flex items-center gap-1 text-[10px] text-brand-gold/90 font-medium pt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{item.location[language] || item.location.en}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
