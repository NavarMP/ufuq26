'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HeartHandshake, Compass, Users, Sparkles, Feather, GraduationCap, Globe } from 'lucide-react';

export default function SuhbaPhilosophySection() {
  const { t } = useApp();
  const [activeDimension, setActiveDimension] = useState<number>(0);

  const dimensions = [
    {
      id: 0,
      icon: GraduationCap,
      title: t('aboutPage.suhba.dim1Title'),
      desc: t('aboutPage.suhba.dim1Desc'),
      arabic: 'صُحْبَةُ الأُسْتَاذ — التَّرْبِيَةُ وَالأَدَب',
      quote: '“He who sits in the company of the illuminated scholar absorbs more from his silence than an inattentive reader does from volumes of books.”',
    },
    {
      id: 1,
      icon: Users,
      title: t('aboutPage.suhba.dim2Title'),
      desc: t('aboutPage.suhba.dim2Desc'),
      arabic: 'صُحْبَةُ الإِخْوَان — المَحْرَابُ وَالمُذَاكَرَة',
      quote: '“The bond of the Dars mat is eternal; brothers who shared oil lamps in the night of revision remain anchors for one another throughout life.”',
    },
    {
      id: 2,
      icon: Compass,
      title: t('aboutPage.suhba.dim3Title'),
      desc: t('aboutPage.suhba.dim3Desc'),
      arabic: 'صُحْبَةُ الإِرْشَاد — التَّوْجِيهُ الأَكَادِيمِي',
      quote: '“Stepping into the university does not mean severing tradition; it means carrying the Suhbah circle into every research seminar and doctoral lab.”',
    },
    {
      id: 3,
      icon: Globe,
      title: t('aboutPage.suhba.dim4Title'),
      desc: t('aboutPage.suhba.dim4Desc'),
      arabic: 'صُحْبَةُ الأُمَّة — الخِدْمَةُ وَالأَخْلَاق',
      quote: '“Knowledge becomes a luminous light only when it is transformed into humble, selfless service to fellow human beings.”',
    },
  ];

  return (
    <section
      id="suhba"
      aria-label="Philosophy of Suhba"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Background Radial Tint */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <HeartHandshake className="w-3.5 h-3.5" />
          {t('aboutPage.suhba.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.suhba.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.suhba.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Narrative Concept Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/30 shadow-2xl mb-12 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="font-arabic text-3xl sm:text-4xl text-brand-gold font-bold select-none block">
            الصُّحْبَةُ وَالأَدَب
          </span>
          <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-200 leading-relaxed">
            {t('aboutPage.suhba.desc')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 text-brand-gold text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Heartbeat of the UFUQ Mentorship Circle</span>
          </div>
        </div>
      </div>

      {/* 4 Dimensions Interactive Tabs & Showcase */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Selector Buttons */}
        <div className="lg:col-span-5 space-y-3">
          {dimensions.map((dim, idx) => {
            const Icon = dim.icon;
            const isActive = activeDimension === idx;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveDimension(idx)}
                className={`w-full p-4 rounded-2xl text-left rtl:text-right flex items-center gap-3.5 transition-all duration-300 border ${
                  isActive
                    ? 'glass-panel border-brand-gold bg-brand-gold/15 shadow-xl scale-[1.02]'
                    : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-brand-gold/30 hover:bg-black/10 dark:hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-brand-gold text-brand-navy font-bold shadow-md'
                      : 'bg-brand-navy/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-clash font-bold text-sm sm:text-base leading-tight ${
                      isActive ? 'text-brand-gold dark:text-brand-gold-light' : 'text-brand-navy dark:text-white'
                    }`}
                  >
                    {dim.title}
                  </h3>
                  <span className="font-arabic text-[11px] text-neutral-500 dark:text-neutral-400 block truncate mt-0.5">
                    {dim.arabic}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Detailed Dimension Spotlight Card */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/35 shadow-2xl relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            <div
              aria-hidden="true"
              className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"
            />

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-brand-gold/15 pb-4">
                <div className="flex items-center gap-2.5">
                  {React.createElement(dimensions[activeDimension].icon, {
                    className: 'w-6 h-6 text-brand-gold',
                  })}
                  <h3 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
                    {dimensions[activeDimension].title}
                  </h3>
                </div>
                <span className="font-arabic text-sm text-brand-teal dark:text-emerald-400 font-bold">
                  {dimensions[activeDimension].arabic}
                </span>
              </div>

              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-200 leading-relaxed">
                {dimensions[activeDimension].desc}
              </p>

              <blockquote className="p-4 rounded-2xl bg-brand-gold/10 border-l-4 rtl:border-l-0 rtl:border-r-4 border-brand-gold italic text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                {dimensions[activeDimension].quote}
              </blockquote>
            </div>

            <div className="pt-6 mt-6 border-t border-brand-gold/15 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Dimension {activeDimension + 1} of 4</span>
              <span className="font-arabic text-brand-gold">بركة الصُّحْبَة النَّبَوِيَّة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
