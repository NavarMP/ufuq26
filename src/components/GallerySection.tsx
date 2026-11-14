'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  Users,
  Building2,
  Heart,
  Cpu,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { GalleryCategory } from '@/types/gallery';
import StoryCirclesBar from './gallery/StoryCirclesBar';
import GalleryBentoGrid from './gallery/GalleryBentoGrid';
import CinematicLightbox from './gallery/CinematicLightbox';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function GallerySection() {
  const { galleryItems } = useEvent();
  const { language, t, isRtl } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Published items only
  const publishedItems = useMemo(() => {
    return galleryItems.filter((i) => i.published);
  }, [galleryItems]);

  // Filtered items for Bento display
  const displayedItems = useMemo(() => {
    if (activeCategory === 'all') {
      // Prioritize featured items on "all"
      const featured = publishedItems.filter((i) => i.featured);
      return featured.length > 0 ? featured : publishedItems;
    }
    return publishedItems.filter((i) => i.category === activeCategory);
  }, [publishedItems, activeCategory]);

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t('gallery.categories.all') || 'All Horizons', icon: Layers },
    { id: 'camp_moments', label: t('gallery.categories.camp_moments') || "Camp UFUQ ’26", icon: Compass },
    { id: 'dars_heritage', label: t('gallery.categories.dars_heritage') || "Dars Heritage", icon: BookOpen },
    { id: 'ustad_scholars', label: t('gallery.categories.ustad_scholars') || "The Ustads", icon: Sparkles },
    { id: 'adsa_initiatives', label: t('gallery.categories.adsa_initiatives') || "ADSA Council", icon: Users },
    { id: 'suffa_fraternity', label: t('gallery.categories.suffa_fraternity') || "39+ SUFFA Dars", icon: Building2 },
    { id: 'suhba_life', label: t('gallery.categories.suhba_life') || "Philosophy of SUHBA", icon: Heart },
    { id: 'digital_craft', label: t('gallery.categories.digital_craft') || "Digital Craft", icon: Cpu },
  ];

  const handleCategoryChange = (catId: string) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    setActiveCategory(catId);
  };

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      aria-label="Camp and Dars Gallery"
      className="py-20 md:py-28 px-4 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Soft Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          {t('gallery.badge') || 'Visual Sanctuary'}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('gallery.title') || 'Gallery & Horizon Archive'}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('gallery.subtitle') ||
            'Moments of sacred scholarship, unbroken heritage, spiritual companionship, and the transformative horizon of Camp UFUQ ’26.'}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Surface Feature 1: "Stories of Horizon" Status Circles */}
      <StoryCirclesBar items={publishedItems} />

      {/* Category Filter Pills Bar */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 custom-scrollbar no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-brand-gold text-brand-navy shadow-lg shadow-brand-gold/20 scale-[1.02]'
                  : 'glass-panel text-neutral-700 dark:text-neutral-300 hover:text-brand-gold hover:border-brand-gold/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Surface Feature 2: Dynamic Bento Grid / Empty State */}
      {displayedItems.length === 0 ? (
        <div className="rounded-3xl glass-panel border border-brand-gold/30 p-12 text-center bg-black/5 dark:bg-black/20 my-6">
          <div className="w-16 h-16 rounded-3xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mx-auto mb-4 border border-brand-gold/30">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-clash text-lg font-bold text-brand-navy dark:text-white">
            {t('gallery.emptyTitle') || 'The Horizon Gallery is Being Curated'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
            {t('gallery.emptyDesc') ||
              'Authentic visual moments from Camp UFUQ ’26 and Alathurpadi Dars will be showcased here. Camp organizers can upload and curate media through the Admin Portal.'}
          </p>
          {/* <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gallery"
              className="px-5 py-2.5 rounded-full text-xs font-semibold glass-panel border border-brand-gold/30 hover:border-brand-gold text-brand-navy dark:text-brand-gold transition-colors"
            >
              {t('gallery.exploreArchive') || 'View Gallery Page'}
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold-hover transition-transform hover:scale-105"
            >
              <span>{t('gallery.openAdmin') || 'Admin Gallery Portal'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div> */}
        </div>
      ) : (
        <GalleryBentoGrid
          items={displayedItems}
          onOpenLightbox={openLightboxAt}
        />
      )}

      {/* Bottom CTA to Full Standalone /gallery Archive */}
      <div className="mt-14 text-center">
        <Link
          href="/gallery"
          onClick={() => {
            soundEngine.playSnap();
            hapticEngine.trigger('selection');
          }}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold text-brand-navy font-bold text-sm shadow-xl shadow-brand-gold/20 hover:shadow-brand-gold/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
        >
          <span>{t('gallery.exploreArchive') || 'Explore Complete Horizon Archive'}</span>
          <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      {/* Cinematic Lightbox Modal */}
      <CinematicLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={displayedItems}
        initialIndex={lightboxIndex}
      />
    </section>
  );
}
