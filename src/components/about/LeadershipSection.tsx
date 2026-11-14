'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Award, Heart, Sparkles, GraduationCap } from 'lucide-react';

export default function LeadershipSection() {
  const { t } = useApp();

  return (
    <section
      id="leadership"
      aria-label="Spiritual and Academic Leadership"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t('aboutPage.leadership.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.leadership.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.leadership.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Usthad Spotlight Feature Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/35 shadow-2xl bg-gradient-to-br from-brand-navy/5 via-transparent to-brand-gold/10 relative overflow-hidden">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Portrait Container with Islamic Arch Profile */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-[2.5rem] overflow-hidden border-2 border-brand-gold/60 shadow-2xl p-1 bg-gradient-to-b from-brand-gold/40 via-brand-navy to-brand-gold/20 group">
              <div className="relative w-full h-full rounded-[2.3rem] overflow-hidden">
                <Image
                  src="/images/Usthad.png"
                  alt="Ustad Dr. C K Abdurahman Faizy Aripra"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="font-arabic text-base sm:text-lg text-brand-gold font-bold block">
                فضيلة الدكتور سي كي عبد الرحمن فيضي أريبرا
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                Patron & Chief Spiritual Guide
              </span>
            </div>
          </div>

          {/* Biography & Vision */}
          <div className="md:col-span-7 space-y-5 text-left rtl:text-right">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Synthesis of Classical Ilm & University Scholarship</span>
              </div>
              <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white leading-tight">
                {t('aboutPage.leadership.name')}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-brand-teal dark:text-emerald-400 mt-1">
                {t('aboutPage.leadership.role')}
              </p>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed">
              {t('aboutPage.leadership.bio')}
            </p>

            {/* Inspiring Quote Box */}
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 relative overflow-hidden">
              <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-100 italic leading-relaxed">
                {t('aboutPage.leadership.quote')}
              </div>
              <div className="mt-2 text-[11px] text-brand-gold font-semibold text-right rtl:text-left">
                — {t('aboutPage.leadership.quoteSource')}
              </div>
            </div>

            {/* 3 Core Pillars of Usthad's Pedagogy */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-brand-navy/5 dark:bg-white/5 border border-brand-gold/15 text-center">
                <div className="font-clash font-bold text-sm text-brand-gold">Adab & Tarbiyah</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Character First</div>
              </div>
              <div className="p-3 rounded-xl bg-brand-navy/5 dark:bg-white/5 border border-brand-gold/15 text-center">
                <div className="font-clash font-bold text-sm text-brand-teal dark:text-emerald-400">Authentic Isnad</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Pure Lineage</div>
              </div>
              <div className="p-3 rounded-xl bg-brand-navy/5 dark:bg-white/5 border border-brand-gold/15 text-center">
                <div className="font-clash font-bold text-sm text-brand-gold">Global Vision</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">Academic Rigor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
