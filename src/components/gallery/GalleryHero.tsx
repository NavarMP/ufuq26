'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, BookOpen, Compass, Building2, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';

interface GalleryHeroProps {
  totalCount: number;
  featuredCount: number;
}

export default function GalleryHero({
  totalCount,
  featuredCount,
}: GalleryHeroProps) {
  const { language, t, isRtl } = useApp();

  return (
    <div className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 max-w-7xl mx-auto overflow-hidden text-center">
      {/* Background Soft Golden Blooms */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Back to Home Breadcrumb */}
      <div className="mb-6 flex justify-center">
        <Link
          href="/"
          onClick={() => soundEngine.playClick(1.0)}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-gold/30 text-xs font-semibold text-brand-gold hover:text-white hover:bg-brand-gold/20 transition-all duration-200"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
          <span>{t('gallery.backToCamp') || 'Back to Camp Home'}</span>
        </Link>
      </div>

      {/* Arabic Calligraphic Watermark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-arabic text-2xl sm:text-3xl text-brand-gold/80 font-bold mb-2 tracking-wide"
      >
        نُورٌ عَلَى نُور — أُفُق ٢٠٢٦
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-clash text-4xl sm:text-5xl md:text-6xl font-bold text-brand-navy dark:text-white leading-tight tracking-tight mb-4"
      >
        {t('gallery.title') || 'Gallery & Horizon Archive'}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-10"
      >
        {t('gallery.subtitle') ||
          'A curated visual sanctuary documenting centuries of sacred scholarship at Alathurpadi Dars, the guiding light of our Ustads, fraternal bonds of SUFFA, and the transformative 7-day journey of Camp UFUQ ’26.'}
      </motion.p>

      {/* Key Metric Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto"
      >
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/25 bg-black/5 dark:bg-black/20 text-center">
          <span className="font-clash text-2xl sm:text-3xl font-bold text-brand-gold block">
            {totalCount}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            {t('gallery.totalArtifacts') || 'Curated Artifacts'}
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/25 bg-black/5 dark:bg-black/20 text-center">
          <span className="font-clash text-2xl sm:text-3xl font-bold text-brand-teal dark:text-emerald-400 block">
            7
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            Thematic Pillars
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/25 bg-black/5 dark:bg-black/20 text-center">
          <span className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white block">
            39+
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            SUFFA Sister Dars
          </span>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/25 bg-black/5 dark:bg-black/20 text-center">
          <span className="font-clash text-2xl sm:text-3xl font-bold text-amber-500 block">
            {featuredCount}
          </span>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
            Featured Highlights
          </span>
        </div>
      </motion.div>
    </div>
  );
}
