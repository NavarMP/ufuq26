'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { soundEngine } from '@/lib/soundEngine';
import {
  Compass,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  Quote,
  Feather,
  Info,
} from 'lucide-react';

type TabKey = 'title' | 'geometry' | 'colors' | 'manifesto' | 'mission';

export default function AboutHero() {
  const { t, isRtl, language } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('title');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Mouse-reactive ambient light glow on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTabChange = (tab: TabKey) => {
    soundEngine.playSnap();
    setActiveTab(tab);
  };

  const scrollToContent = (elementId: string) => {
    soundEngine.playClick(1.0);
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMonograph = () => {
    soundEngine.playChime();
    const el = document.getElementById('horizon-monograph');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollGuide = () => {
    soundEngine.playWhoosh('out');
    const el = document.getElementById('heritage');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label="About UFUQ '26 Hero & Monograph"
      className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-mesh-pattern transition-colors duration-300"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. ATMOSPHERIC CANVAS & CELESTIAL MIHRAB ARCH
          ───────────────────────────────────────────────────────────── */}
      {/* Dynamic Mouse-Tracking Glow Sheen (Desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[650px] h-[650px] rounded-full blur-3xl transition-opacity duration-500 ease-out z-0 hidden lg:block"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(201, 164, 92, 0.16) 0%, rgba(82, 122, 112, 0.12) 40%, transparent 70%)',
          opacity: isHovering ? 1 : 0.4,
        }}
      />

      {/* Atmospheric Horizon Ambient Blooms */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] lg:w-[1000px] h-[350px] sm:h-[600px] lg:h-[800px] bg-gradient-to-b from-brand-gold/15 via-brand-teal/10 to-transparent rounded-full blur-3xl pointer-events-none animate-glow-pulse -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 -left-28 w-96 h-96 rounded-full bg-brand-teal/15 blur-3xl pointer-events-none -z-10"
      />

      {/* Celestial Mihrab Light Arch Outline SVG Silhouette */}
      <div
        aria-hidden="true"
        className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[650px] pointer-events-none -z-10 opacity-30 dark:opacity-25"
      >
        <svg
          viewBox="0 0 1000 650"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full stroke-brand-gold/40"
        >
          {/* Outer Mihrab Arch */}
          <path
            d="M 150 650 L 150 320 C 150 120, 350 40, 500 40 C 650 40, 850 120, 850 320 L 850 650"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          {/* Inner Concentric Horizon Arc */}
          <path
            d="M 230 650 L 230 340 C 230 180, 380 110, 500 110 C 620 110, 770 180, 770 340 L 770 650"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* Subtle Zenith Keystone Star */}
          <polygon
            points="500,28 504,38 514,40 506,47 508,57 500,51 492,57 494,47 486,40 496,38"
            fill="currentColor"
            className="text-brand-gold"
          />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO MAIN CONTENT CLUSTER
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Return Breadcrumb / Presenting Entity Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-brand-gold/40 shadow-lg text-xs font-medium text-neutral-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <Link
              href="/"
              onClick={() => soundEngine.playClick(1.0)}
              className="flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover transition-colors font-semibold"
            >
              <span>{isRtl ? '→' : '←'}</span>
              <span>{t('aboutPage.backToHome')}</span>
            </Link>
            <span className="text-neutral-400">/</span>
            <span className="text-brand-teal dark:text-emerald-400 font-semibold tracking-wide">
              {t('aboutPage.badge')}
            </span>
          </div>
        </motion.div>

        {/* Central Architectural Crest: Emblem & Grand Calligraphy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center justify-center space-y-4 pt-2"
        >
          {/* Polished Jewel Halo Cradling the BrandLogo */}
          <div className="relative group cursor-pointer" onClick={() => soundEngine.playClick(1.2)}>
            <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[var(--logo-tile)] p-4 flex items-center justify-center shadow-2xl border-2 border-brand-gold/60 group-hover:border-brand-gold group-hover:scale-105 transition-all duration-300">
              <BrandLogo
                width={78}
                height={78}
                className="object-contain relative z-10 drop-shadow-md group-hover:rotate-3 transition-transform duration-500"
              />
              {/* Corner Accent Ornaments */}
              <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
              <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
            </div>
          </div>

          {/* Monumental Arabic Calligraphy & Poetic Sub-Bar */}
          <div className="space-y-1.5">
            <h1 className="font-arabic text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-normal text-gold-gradient py-1 select-none drop-shadow-md">
              {t('aboutPage.hero.titleStudy.arabicWord') || 'أُفُـق'}
            </h1>
            <div className="inline-flex items-center gap-2.5 px-4 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/25 text-brand-teal dark:text-emerald-400 font-arabic text-sm sm:text-base font-medium tracking-wide">
              <span>✦</span>
              <span>{t('aboutPage.hero.arabicSub')}</span>
              <span>✦</span>
            </div>
          </div>
        </motion.div>

        {/* Editorial Headline & Mission Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <h2 className="font-clash text-2xl sm:text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white leading-tight tracking-tight">
            {t('aboutPage.hero.tagline')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('aboutPage.hero.description')}
          </p>
        </motion.div>

        {/* Tactile Action Controls (Audio-Enabled) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2"
        >
          {/* Primary CTA: Explore Heritage */}
          <button
            onClick={() => scrollToContent('heritage')}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-sm md:text-base shadow-xl shadow-brand-gold/25 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
          >
            <BookOpen className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>{t('aboutPage.hero.exploreHeritage')}</span>
            <ArrowRight
              className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`}
            />
          </button>

          {/* Secondary CTA: Camp Curriculum */}
          <button
            onClick={() => scrollToContent('camp-vision')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-panel hover:bg-black/5 dark:hover:bg-white/10 text-neutral-800 dark:text-white font-semibold text-sm md:text-base border border-brand-gold/30 hover:border-brand-gold transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Compass className="w-4 h-4 text-brand-teal dark:text-emerald-400" />
            <span>{t('aboutPage.hero.exploreCamp')}</span>
          </button>

          {/* Tertiary CTA: Horizon Monograph */}
          <button
            onClick={scrollToMonograph}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full glass-panel hover:bg-brand-gold/15 text-brand-gold font-semibold text-sm border border-brand-gold/40 hover:border-brand-gold transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>{t('aboutPage.hero.deepStudy') || 'Horizon Monograph'}</span>
          </button>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            3. PRESTIGE METRICS GROUNDING RIBBON
            ───────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="pt-6 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-3xl glass-panel border border-brand-gold/30 shadow-xl bg-white/40 dark:bg-black/20">
            {/* Metric 1: Decades of Isnad */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15 text-center flex flex-col justify-center">
              <span className="font-clash font-extrabold text-xl sm:text-2xl text-brand-gold">
                {t('aboutPage.hero.metrics.isnadValue')}
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                {t('aboutPage.hero.metrics.isnadLabel')}
              </span>
            </div>

            {/* Metric 2: 39+ Dars Network */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15 text-center flex flex-col justify-center">
              <span className="font-clash font-extrabold text-xl sm:text-2xl text-brand-teal dark:text-emerald-400">
                {t('aboutPage.hero.metrics.networkValue')}
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                {t('aboutPage.hero.metrics.networkLabel')}
              </span>
            </div>

            {/* Metric 3: 7 Days Curriculum */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15 text-center flex flex-col justify-center">
              <span className="font-clash font-extrabold text-xl sm:text-2xl text-brand-navy dark:text-white">
                {t('aboutPage.hero.metrics.daysValue')}
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                {t('aboutPage.hero.metrics.daysLabel')}
              </span>
            </div>

            {/* Metric 4: 4 Foundational Pillars */}
            <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/15 text-center flex flex-col justify-center">
              <span className="font-clash font-extrabold text-xl sm:text-2xl text-brand-gold">
                {t('aboutPage.hero.metrics.pillarsValue')}
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider mt-0.5">
                {t('aboutPage.hero.metrics.pillarsLabel')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. INTERACTIVE "HORIZON ANATOMY DECK" (DEEP MONOGRAPH)
          ───────────────────────────────────────────────────────────── */}
      <div id="horizon-monograph" className="pt-24 sm:pt-32 max-w-5xl mx-auto relative z-10">
        {/* Monograph Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{t('aboutPage.hero.anatomyTitle')}</span>
          </span>
          <h3 className="font-clash text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy dark:text-white">
            {t('aboutPage.hero.anatomySubtitle')}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            Explore the five foundational pillars deconstructing the sacred geometry, title etymology, color symbolism, and institutional manifesto of Camp UFUQ ’26.
          </p>
        </div>

        {/* 5 Segmented Inspector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-3xl glass-panel border border-brand-gold/30 shadow-lg max-w-3xl w-full">
            {[
              { key: 'title', label: t('aboutPage.hero.tabs.title'), icon: BookOpen },
              { key: 'geometry', label: t('aboutPage.hero.tabs.geometry'), icon: Layers },
              { key: 'colors', label: t('aboutPage.hero.tabs.colors'), icon: Palette },
              { key: 'manifesto', label: t('aboutPage.hero.tabs.manifesto'), icon: Compass },
              { key: 'mission', label: t('aboutPage.hero.tabs.mission'), icon: Award },
            ].map(({ key, label, icon: Icon }) => {
              const isSelected = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key as TabKey)}
                  className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-brand-gold text-brand-navy shadow-md shadow-brand-gold/20 scale-102 font-bold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                  aria-selected={isSelected}
                  role="tab"
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-navy' : 'text-brand-gold'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Inspector Body (Animated Transitions) */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/30 shadow-2xl relative overflow-hidden bg-white/50 dark:bg-black/30">
          <AnimatePresence mode="wait">
            {/* ───────────── TAB 1: TITLE & ETYMOLOGY ───────────── */}
            {activeTab === 'title' && (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-gold/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
                      01
                    </span>
                    <div>
                      <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                        {t('aboutPage.hero.titleStudy.badge')}
                      </span>
                      <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                        {t('aboutPage.hero.titleStudy.transliteration')}
                      </h4>
                    </div>
                  </div>
                  <span className="font-arabic text-3xl sm:text-4xl text-brand-gold font-bold">
                    أُفُـق
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4 text-left rtl:text-right">
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed">
                      {t('aboutPage.hero.titleStudy.rootMeaning')}
                    </p>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.titleStudy.campSignificance')}
                    </p>
                  </div>

                  {/* Sacred Qur'anic Text Callout */}
                  <div className="p-6 rounded-2xl bg-brand-navy text-neutral-100 border-2 border-brand-gold/40 shadow-xl space-y-3 relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/15 to-transparent pointer-events-none" />
                    <Quote className="w-6 h-6 text-brand-gold mx-auto opacity-75" />
                    <p className="font-arabic text-lg sm:text-xl text-brand-gold-light leading-relaxed font-semibold">
                      {t('aboutPage.hero.titleStudy.quranVerse')}
                    </p>
                    <span className="text-[11px] text-neutral-400 tracking-wider uppercase block">
                      Divine Invocations of the Cosmic Horizon
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───────────── TAB 2: SACRED GEOMETRY ───────────── */}
            {activeTab === 'geometry' && (
              <motion.div
                key="geometry"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
                  <span className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
                    02
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                      {t('aboutPage.hero.geometryStudy.badge')}
                    </span>
                    <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                      {t('aboutPage.hero.geometryStudy.concept')}
                    </h4>
                  </div>
                </div>

                <div className="grid md:grid-cols-12 gap-8 items-center">
                  {/* Emblem Blueprint Showcase */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-brand-navy border-2 border-brand-gold/30 shadow-xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-radial-gradient from-brand-gold/20 to-transparent pointer-events-none" />
                    <BrandLogo width={120} height={120} className="relative z-10 drop-shadow-xl" />
                    <div className="pt-4 space-y-1 relative z-10">
                      <span className="text-xs font-mono font-bold text-brand-gold tracking-widest">
                        45° GEOMETRIC PROPORTION
                      </span>
                      <p className="text-[11px] text-neutral-300">
                        Islamic Tiling Meets Modern Ascending Vector
                      </p>
                    </div>
                  </div>

                  {/* Three Geometric Principles */}
                  <div className="md:col-span-7 space-y-4 text-left rtl:text-right">
                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 space-y-1">
                      <h5 className="font-clash font-bold text-brand-navy dark:text-brand-gold-light text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-gold" />
                        {t('aboutPage.hero.geometryStudy.point1Title')}
                      </h5>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('aboutPage.hero.geometryStudy.point1Desc')}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 space-y-1">
                      <h5 className="font-clash font-bold text-brand-navy dark:text-brand-gold-light text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-teal" />
                        {t('aboutPage.hero.geometryStudy.point2Title')}
                      </h5>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('aboutPage.hero.geometryStudy.point2Desc')}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 space-y-1">
                      <h5 className="font-clash font-bold text-brand-navy dark:text-brand-gold-light text-sm sm:text-base flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {t('aboutPage.hero.geometryStudy.point3Title')}
                      </h5>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {t('aboutPage.hero.geometryStudy.point3Desc')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───────────── TAB 3: COLOR SYSTEM ───────────── */}
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
                  <span className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
                    03
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                      {t('aboutPage.hero.colorStudy.badge')}
                    </span>
                    <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                      {t('aboutPage.hero.colorStudy.title')}
                    </h4>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Color 1: Midnight Navy */}
                  <div className="p-5 rounded-2xl bg-[#101d32] text-white border-2 border-brand-gold/30 shadow-lg flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold font-mono">
                          {t('aboutPage.hero.colorStudy.color1Hex')}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-[#101d32] border border-white/40" />
                      </div>
                      <h5 className="font-clash font-bold text-base">
                        {t('aboutPage.hero.colorStudy.color1Name')}
                      </h5>
                      <span className="text-[11px] text-brand-teal dark:text-emerald-400 font-semibold block">
                        {t('aboutPage.hero.colorStudy.color1Concept')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.colorStudy.color1Meaning')}
                    </p>
                  </div>

                  {/* Color 2: Sacred Gold */}
                  <div className="p-5 rounded-2xl bg-[#c9a45c] text-brand-navy border-2 border-brand-gold/60 shadow-lg flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-navy font-mono">
                          {t('aboutPage.hero.colorStudy.color2Hex')}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-[#c9a45c] border border-brand-navy/40" />
                      </div>
                      <h5 className="font-clash font-bold text-base">
                        {t('aboutPage.hero.colorStudy.color2Name')}
                      </h5>
                      <span className="text-[11px] text-brand-navy/80 font-bold block">
                        {t('aboutPage.hero.colorStudy.color2Concept')}
                      </span>
                    </div>
                    <p className="text-xs text-brand-navy/90 font-medium leading-relaxed">
                      {t('aboutPage.hero.colorStudy.color2Meaning')}
                    </p>
                  </div>

                  {/* Color 3: Coastal Teal */}
                  <div className="p-5 rounded-2xl bg-[#527a70] text-white border-2 border-emerald-400/30 shadow-lg flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-200 font-mono">
                          {t('aboutPage.hero.colorStudy.color3Hex')}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-[#527a70] border border-white/40" />
                      </div>
                      <h5 className="font-clash font-bold text-base">
                        {t('aboutPage.hero.colorStudy.color3Name')}
                      </h5>
                      <span className="text-[11px] text-emerald-200 font-semibold block">
                        {t('aboutPage.hero.colorStudy.color3Concept')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed">
                      {t('aboutPage.hero.colorStudy.color3Meaning')}
                    </p>
                  </div>

                  {/* Color 4: Parchment Cream */}
                  <div className="p-5 rounded-2xl bg-[#f5f0e8] text-brand-navy border-2 border-brand-gold/40 shadow-lg flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold font-mono">
                          {t('aboutPage.hero.colorStudy.color4Hex')}
                        </span>
                        <span className="w-3 h-3 rounded-full bg-[#f5f0e8] border border-neutral-400" />
                      </div>
                      <h5 className="font-clash font-bold text-base">
                        {t('aboutPage.hero.colorStudy.color4Name')}
                      </h5>
                      <span className="text-[11px] text-brand-teal font-semibold block">
                        {t('aboutPage.hero.colorStudy.color4Concept')}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                      {t('aboutPage.hero.colorStudy.color4Meaning')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───────────── TAB 4: THE 5W+1H MANIFESTO ───────────── */}
            {activeTab === 'manifesto' && (
              <motion.div
                key="manifesto"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
                  <span className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
                    04
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                      {t('aboutPage.hero.manifesto.badge')}
                    </span>
                    <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.title')}
                    </h4>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left rtl:text-right">
                  {/* WHAT */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold tracking-widest">
                      {t('aboutPage.hero.manifesto.whatLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.whatTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.whatDesc')}
                    </p>
                  </div>

                  {/* WHY */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-teal/20 text-brand-teal dark:text-emerald-400 tracking-widest">
                      {t('aboutPage.hero.manifesto.whyLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.whyTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.whyDesc')}
                    </p>
                  </div>

                  {/* HOW */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 tracking-widest">
                      {t('aboutPage.hero.manifesto.howLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.howTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.howDesc')}
                    </p>
                  </div>

                  {/* WHEN */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold tracking-widest">
                      {t('aboutPage.hero.manifesto.whenLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.whenTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.whenDesc')}
                    </p>
                  </div>

                  {/* WHERE */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-teal/20 text-brand-teal dark:text-emerald-400 tracking-widest">
                      {t('aboutPage.hero.manifesto.whereLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.whereTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.whereDesc')}
                    </p>
                  </div>

                  {/* WHO */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 space-y-2 hover:border-brand-gold transition-colors">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 tracking-widest">
                      {t('aboutPage.hero.manifesto.whoLabel')}
                    </span>
                    <h5 className="font-clash font-bold text-sm sm:text-base text-brand-navy dark:text-white">
                      {t('aboutPage.hero.manifesto.whoTitle')}
                    </h5>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {t('aboutPage.hero.manifesto.whoDesc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ───────────── TAB 5: MISSION & VISION ───────────── */}
            {activeTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-brand-gold/20 pb-4">
                  <span className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center font-bold">
                    05
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                      {t('aboutPage.hero.missionVision.badge')}
                    </span>
                    <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                      {t('aboutPage.hero.missionVision.title')}
                    </h4>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-left rtl:text-right">
                  {/* Mission Card */}
                  <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-brand-gold/30 shadow-md space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{t('aboutPage.hero.missionVision.missionLabel')}</span>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed">
                      {t('aboutPage.hero.missionVision.mission')}
                    </p>
                  </div>

                  {/* Vision Card */}
                  <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-brand-teal/40 shadow-md space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('aboutPage.hero.missionVision.visionLabel')}</span>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed">
                      {t('aboutPage.hero.missionVision.vision')}
                    </p>
                  </div>
                </div>

                {/* Core Institutional Motto */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-brand-teal/10 to-brand-gold/15 border border-brand-gold/30 text-center space-y-1">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block">
                    Institutional Motto
                  </span>
                  <p className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-brand-gold">
                    &ldquo;{t('aboutPage.hero.missionVision.motto')}&rdquo;
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. MODERN SCROLL GUIDE (NO BOUNCE ARROW)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="pt-16 pb-4 flex flex-col items-center justify-center cursor-pointer group"
        onClick={handleScrollGuide}
      >
        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 tracking-widest uppercase mb-2 group-hover:text-brand-gold transition-colors">
          {t('aboutPage.hero.scrollPrompt') || 'Scroll to Discover'}
        </span>
        {/* Luxury Slender Glass Pill with Drifting Bead */}
        <div className="w-6 h-10 rounded-full border-2 border-brand-gold/40 group-hover:border-brand-gold p-1 flex justify-center glass-panel transition-colors duration-200">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="w-1.5 h-2.5 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
