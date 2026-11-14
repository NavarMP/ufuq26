'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Cpu,
  Radio,
  Globe2,
  Lock,
  Sparkles,
  Zap,
  Layers,
  Palette,
  Terminal,
  Volume2,
} from 'lucide-react';

export default function DigitalCraftSection() {
  const { t } = useApp();

  const features = [
    {
      icon: Radio,
      title: 'Real-Time Audio Spectrum',
      desc: t('aboutPage.digitalCraft.featureAudio'),
      badge: 'Web Audio API',
    },
    {
      icon: Globe2,
      title: 'Native Trilingual & RTL Engine',
      desc: t('aboutPage.digitalCraft.featureLang'),
      badge: 'EN · ML · AR',
    },
    {
      icon: Lock,
      title: 'Dual Portal Access',
      desc: t('aboutPage.digitalCraft.featurePortals'),
      badge: 'Role-Based Auth',
    },
    {
      icon: Sparkles,
      title: 'Conversational AI Assistant',
      desc: t('aboutPage.digitalCraft.featureAssistant'),
      badge: 'Gemini + Local Fallback',
    },
    {
      icon: Terminal,
      title: 'Keyboard Command Palette',
      desc: 'Instant fuzzy discovery across 7 days of schedules, guests, and FAQs via ⌘K / Ctrl+K.',
      badge: 'Cmd + K',
    },
    {
      icon: Zap,
      title: 'PWA & Offline Ergonomics',
      desc: t('aboutPage.digitalCraft.featureOffline'),
      badge: 'PWA + Lenis',
    },
  ];

  const techBadges = [
    'Next.js 15.1 App Router',
    'React 19',
    'TypeScript 5.7',
    'Tailwind CSS 3.4',
    'Motion & GSAP',
    'Cloud Firestore',
    'Firebase Auth',
    'Supabase Storage',
    'Web Audio API',
    'Lenis Scroll',
  ];

  return (
    <section
      id="digital-craft"
      aria-label="Web Application Architecture and Features"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <Cpu className="w-3.5 h-3.5" />
          {t('aboutPage.digitalCraft.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.digitalCraft.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.digitalCraft.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Engineering Philosophy Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/30 shadow-2xl mb-12 relative overflow-hidden">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4 text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Modern Web Architecture</span>
            </div>
            <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">
              Rooted in Tradition. Engineered for the World.
            </h3>
            <p className="text-neutral-700 dark:text-neutral-200 text-sm sm:text-base leading-relaxed">
              {t('aboutPage.digitalCraft.stackDesc')}
            </p>
            {/* Tech badges pill cluster */}
            <div className="flex flex-wrap gap-2 pt-2">
              {techBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 font-mono text-xs border border-brand-gold/20"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Design Palette Showcase Plate */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-brand-navy text-white border border-brand-gold/30 shadow-xl space-y-3 text-left rtl:text-right">
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
              <Palette className="w-4 h-4" />
              <span>Design System Tokens</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-neutral-300">Midnight Navy</span>
                <span className="font-mono text-brand-gold">#101D32</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-neutral-300">Imperial Gold</span>
                <span className="font-mono text-brand-gold">#C9A45C</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                <span className="font-semibold text-neutral-300">Quiet Teal</span>
                <span className="font-mono text-emerald-400">#527A70</span>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 pt-1">
              Typography: Clash Display (EN) · DG Sahabah (AR) · Arima (ML)
            </p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-panel p-6 border border-brand-gold/20 hover:border-brand-gold/50 shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-bold text-brand-teal dark:text-emerald-400 border border-brand-gold/20">
                    {feat.badge}
                  </span>
                </div>
                <h4 className="font-clash font-bold text-base sm:text-lg text-brand-navy dark:text-white">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-gold/10 text-[11px] text-brand-gold font-medium">
                Production-Tested Feature
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
