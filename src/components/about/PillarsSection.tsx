'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Users, BookOpen, ExternalLink, ShieldCheck, ArrowRight, Award } from 'lucide-react';

export default function PillarsSection() {
  const { t, isRtl } = useApp();

  return (
    <section
      id="pillars"
      aria-label="ADSA and SUFFA Twin Pillars"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <Award className="w-3.5 h-3.5" />
          {t('aboutPage.pillars.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.pillars.title')}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Two Pillars Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* ADSA Pillar Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/30 shadow-2xl flex flex-col justify-between hover:border-brand-gold/60 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-brand-gold/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform"
          />

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-navy p-2.5 flex items-center justify-center shrink-0 border-2 border-brand-gold/40 shadow-lg">
                <Image
                  src="/images/adsa-logo.svg"
                  alt="ADSA Logo"
                  width={46}
                  height={46}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest block">
                  {t('aboutPage.pillars.adsaRole')}
                </span>
                <h3 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white leading-tight">
                  {t('aboutPage.pillars.adsaTitle')}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t('aboutPage.pillars.adsaDesc')}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                <span className="font-clash font-bold text-sm text-brand-gold block">Alumni Network</span>
                <span className="text-[11px] text-neutral-500">Global scholars & professionals</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                <span className="font-clash font-bold text-sm text-brand-teal dark:text-emerald-400 block">Annual Milestones</span>
                <span className="text-[11px] text-neutral-500">UFUQ leadership & conferences</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-brand-gold/20 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Official Governing Body</span>
            <a
              href="https://alathurpadidars.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover font-semibold transition-colors"
            >
              <span>{t('aboutPage.pillars.websiteLink')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* SUFFA Pillar Card */}
        <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-teal/30 dark:border-emerald-500/30 shadow-2xl flex flex-col justify-between hover:border-brand-teal/60 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-brand-teal/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform"
          />

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-teal/20 dark:bg-emerald-500/20 p-2.5 flex items-center justify-center shrink-0 border-2 border-brand-teal/40 dark:border-emerald-500/40 shadow-lg">
                <BookOpen className="w-8 h-8 text-brand-teal dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-brand-teal dark:text-emerald-400 uppercase tracking-widest block">
                  {t('aboutPage.pillars.suffaRole')}
                </span>
                <h3 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white leading-tight">
                  {t('aboutPage.pillars.suffaTitle')}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t('aboutPage.pillars.suffaDesc')}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-teal/15">
                <span className="font-clash font-bold text-sm text-brand-teal dark:text-emerald-400 block">39+ Dars Network</span>
                <span className="text-[11px] text-neutral-500">Collaborating centers across Kerala</span>
              </div>
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-teal/15">
                <span className="font-clash font-bold text-sm text-brand-gold block">Student Council</span>
                <span className="text-[11px] text-neutral-500">Literary, debate & research wings</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-brand-teal/20 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Student Fraternity & Council</span>
            <Link
              href="/dars"
              className="inline-flex items-center gap-1.5 text-brand-teal dark:text-emerald-400 hover:underline font-semibold transition-colors"
            >
              <span>{t('aboutPage.pillars.portalLink')}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
