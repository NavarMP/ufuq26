'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Maximize2, MapPin, Sparkles, Film, Star } from 'lucide-react';
import { GalleryItem, GalleryCategory } from '@/types/gallery';
import { useApp } from '@/context/AppContext';
import TiltCard from '@/components/effects/TiltCard';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface GalleryBentoGridProps {
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

export default function GalleryBentoGrid({
  items,
  onOpenLightbox,
}: GalleryBentoGridProps) {
  const { language } = useApp();

  if (items.length === 0) return null;

  // Bento span assignments for visual rhythm (up to 6 items)
  const getBentoClasses = (idx: number) => {
    switch (idx) {
      case 0:
        // Hero Panoramic / Big Square
        return 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 min-h-[340px] sm:min-h-[420px]';
      case 1:
        // Tall Portrait
        return 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-2 min-h-[340px] sm:min-h-[420px]';
      case 2:
        // Square
        return 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[200px]';
      case 3:
        // Square
        return 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[200px]';
      case 4:
        // Panoramic
        return 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 min-h-[220px]';
      default:
        return 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 min-h-[220px]';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
      {items.slice(0, 6).map((item, idx) => {
        const titleText = item.title[language] || item.title.en;
        const captionText = item.caption?.[language] || item.caption?.en;
        const catLabel = CATEGORY_NAMES[item.category]?.[language] || item.category;

        return (
          <TiltCard
            key={item.id}
            maxTilt={6}
            glare={true}
            className={`w-full h-full ${getBentoClasses(idx)}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => {
                soundEngine.playSnap();
                hapticEngine.trigger('selection');
                onOpenLightbox(idx);
              }}
              className="group relative w-full h-full rounded-3xl overflow-hidden glass-panel border border-brand-gold/30 hover:border-brand-gold shadow-2xl bg-black/40 cursor-pointer flex flex-col justify-end"
            >
              {/* Media Layer */}
              <div className="absolute inset-0 bg-black/60 overflow-hidden">
                {item.mediaType === 'video' ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                    <Film className="w-12 h-12 text-brand-gold" />
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

                {/* Ambient Shadows & Bloom */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark via-black/40 to-black/10 group-hover:from-brand-navy-dark/95 transition-all duration-300" />
              </div>

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-brand-gold text-[11px] font-semibold border border-brand-gold/40 shadow">
                  {catLabel}
                </span>

                <div className="flex items-center gap-1.5">
                  {item.heroSpotlight && (
                    <span className="p-1.5 rounded-full bg-amber-400 text-brand-navy shadow-lg" title="Spotlight">
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                  {item.featured && (
                    <span className="p-1.5 rounded-full bg-brand-gold text-brand-navy shadow-lg" title="Featured">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLightbox(idx);
                    }}
                    className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-brand-gold hover:bg-black/90 transition-colors"
                    title="Expand (Cinema Lightbox)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Details Overlay */}
              <div className="relative z-10 p-5 sm:p-6 space-y-1.5 text-left rtl:text-right transform group-hover:-translate-y-1 transition-transform duration-300">
                <h3 className="font-clash text-lg sm:text-xl font-bold text-white group-hover:text-brand-gold transition-colors leading-snug">
                  {titleText}
                </h3>

                {captionText && (
                  <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                    {captionText}
                  </p>
                )}

                {item.location?.en && (
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-gold/90 font-medium pt-1">
                    <MapPin className="w-3 h-3 text-brand-gold" />
                    <span>{item.location[language] || item.location.en}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </TiltCard>
        );
      })}
    </div>
  );
}
