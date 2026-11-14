'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { Compass, BookOpen, ArrowRight, ArrowDown } from 'lucide-react';

export default function AboutHero() {
  const { t, isRtl } = useApp();

  const scrollToContent = () => {
    const el = document.getElementById('heritage');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      aria-label="About UFUQ Hero"
      className="relative min-h-[85vh] md:min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 overflow-hidden bg-mesh-pattern"
    >
      {/* Dynamic Animated Cosmic Horizon Background Glows */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] lg:w-[850px] h-[350px] sm:h-[600px] lg:h-[850px] bg-gradient-to-b from-brand-gold/15 via-brand-teal/10 to-transparent rounded-full blur-3xl pointer-events-none animate-glow-pulse"
      />
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-brand-teal/15 blur-3xl pointer-events-none"
      />

      {/* Floating Geometric Stars SVG Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l3 21 21 3-21 3-3 21-3-21-21-3 21-3z' fill='%23c9a45c' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Navigation Breadcrumb / Return Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-gold/40 shadow-lg text-xs font-medium text-neutral-700 dark:text-neutral-200"
        >
          <Link
            href="/"
            className="flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover transition-colors font-semibold"
          >
            <span>←</span>
            <span>{t('aboutPage.backToHome')}</span>
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-brand-teal dark:text-emerald-400 font-semibold">
            {t('aboutPage.badge')}
          </span>
        </motion.div>

        {/* Central Logo & Calligraphy Horizon Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center justify-center space-y-3"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-brand-navy p-3 flex items-center justify-center shadow-2xl border-2 border-brand-gold/50 group">
            <div className="absolute inset-0 rounded-3xl bg-brand-gold/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <Image
              src="/images/UFUQ-Logo.svg"
              alt="UFUQ '26 Logo"
              width={70}
              height={70}
              className="object-contain relative z-10 drop-shadow-md"
              priority
            />
          </div>

          {/* Grand Sacred Arabic Calligraphy */}
          <div className="space-y-1">
            <h1 className="font-arabic text-5xl sm:text-7xl md:text-8xl font-bold tracking-normal text-gold-gradient py-1 select-none">
              أُفُـق
            </h1>
            <p className="font-arabic text-sm sm:text-base text-brand-teal dark:text-emerald-400 font-medium tracking-wide">
              {t('aboutPage.hero.arabicSub')}
            </p>
          </div>
        </motion.div>

        {/* Hero Title & Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h2 className="font-clash text-2xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white leading-tight tracking-tight">
            {t('aboutPage.hero.tagline')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto">
            {t('aboutPage.hero.description')}
          </p>
        </motion.div>

        {/* Quick Jump Action Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
        >
          <button
            onClick={scrollToContent}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-sm shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('aboutPage.hero.exploreHeritage')}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>

          <a
            href="#camp-matrix"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-panel hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-semibold text-sm border border-brand-gold/30 hover:border-brand-gold transition-all duration-200"
          >
            <Compass className="w-4 h-4 text-brand-teal dark:text-emerald-400" />
            <span>{t('aboutPage.hero.exploreCamp')}</span>
          </a>
        </motion.div>

        {/* Scroll Indicator Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-8 flex flex-col items-center justify-center"
        >
          <button
            onClick={scrollToContent}
            aria-label="Scroll down to Heritage"
            className="p-2 rounded-full text-neutral-400 hover:text-brand-gold transition-colors animate-bounce focus:outline-none"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
