'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, BookOpen, Layers, Users, Sparkles, Feather } from 'lucide-react';

export default function HeritageSection() {
  const { t } = useApp();

  const coreDisciplines = [
    { titleEn: 'Tafsir & Hadith', titleAr: 'التفسير والحديث', desc: 'Baydawi, Jalalayn, Bukhari, and sacred exegesis traditions.' },
    { titleEn: 'Fiqh & Usul', titleAr: 'الفقه والأصول', desc: 'Shafi‘i jurisprudence, Jam‘ al-Jawami‘, and legal methodologies.' },
    { titleEn: 'Nahw & Balaghah', titleAr: 'النحو والبلاغة', desc: 'Alfiyyah ibn Malik, Talkhis al-Miftah, and rhetorical mastery.' },
    { titleEn: 'Mantiq & Kalam', titleAr: 'المنطق والكلام', desc: 'Formal Aristotelian-Islamic logic, dialectics, and rational theology.' },
    { titleEn: 'Tasawwuf & Adab', titleAr: 'التصوف والأدب', desc: 'Ghazali’s Ihya’, purification of soul, humility, and moral ethics.' },
  ];

  return (
    <section
      id="heritage"
      aria-label="Alathurpadi Dars Heritage"
      className="py-20 md:py-32 px-4 max-w-6xl mx-auto relative"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest border border-brand-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          {t('aboutPage.darsHeritage.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.darsHeritage.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.darsHeritage.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Narrative Card with Typographic Crest */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/30 shadow-2xl mb-12 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none"
        />

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Narrative Prose */}
          <div className="md:col-span-7 space-y-5 text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Centuries of Scholarship · Malabar Tradition</span>
            </div>

            <p className="text-neutral-700 dark:text-neutral-200 text-sm sm:text-base leading-relaxed">
              {t('aboutPage.darsHeritage.description')}
            </p>

            <blockquote className="p-4 rounded-2xl bg-brand-gold/10 border-l-4 rtl:border-l-0 rtl:border-r-4 border-brand-gold italic text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm leading-relaxed">
              {t('aboutPage.darsHeritage.quote')}
            </blockquote>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                Melmuri, Malappuram
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-teal" />
                Classical Curriculum
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Unbroken Transmission
              </span>
            </div>
          </div>

          {/* Dars Typographic Identity Plate */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-8 rounded-2xl bg-brand-navy text-center border-2 border-brand-gold/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/15 to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
            
            <div className="w-full max-w-[240px] h-24 relative mb-4">
              <Image
                src="/images/dars-typo.svg"
                alt="Alathurpadi Dars Typography"
                fill
                className="object-contain filter invert opacity-95 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            <div className="relative z-10 space-y-1">
              <span className="font-arabic text-lg text-brand-gold font-bold tracking-wider block">
                دار العلثورپادي
              </span>
              <p className="text-xs text-neutral-300 max-w-xs">
                The Historic Sanctuary of Islamic Epistemology in Kerala
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillar Features of Classical Dars System */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl glass-panel p-6 border border-brand-gold/20 hover:border-brand-gold/50 shadow-lg transition-all duration-300 hover:-translate-y-1 text-left rtl:text-right">
          <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-clash font-bold text-base sm:text-lg text-brand-navy dark:text-white mb-2">
            {t('aboutPage.darsHeritage.feature1Title')}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('aboutPage.darsHeritage.feature1Desc')}
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-brand-gold/20 hover:border-brand-gold/50 shadow-lg transition-all duration-300 hover:-translate-y-1 text-left rtl:text-right">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/20 text-brand-teal dark:text-emerald-400 flex items-center justify-center mb-4">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-clash font-bold text-base sm:text-lg text-brand-navy dark:text-white mb-2">
            {t('aboutPage.darsHeritage.feature2Title')}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('aboutPage.darsHeritage.feature2Desc')}
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-brand-gold/20 hover:border-brand-gold/50 shadow-lg transition-all duration-300 hover:-translate-y-1 text-left rtl:text-right">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-clash font-bold text-base sm:text-lg text-brand-navy dark:text-white mb-2">
            {t('aboutPage.darsHeritage.feature3Title')}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {t('aboutPage.darsHeritage.feature3Desc')}
          </p>
        </div>
      </div>

      {/* Classical Canon Grid (Halaqah Sciences) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/25 shadow-xl">
        <div className="flex items-center gap-2 mb-6">
          <Feather className="w-5 h-5 text-brand-gold" />
          <h3 className="font-clash font-bold text-lg sm:text-xl text-brand-navy dark:text-white">
            The Classical Canon of Alathurpadi
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreDisciplines.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 hover:border-brand-gold/40 transition-colors"
            >
              <span className="font-arabic text-sm text-brand-gold block font-semibold mb-1">
                {item.titleAr}
              </span>
              <h4 className="font-clash font-bold text-sm text-brand-navy dark:text-white mb-1.5">
                {item.titleEn}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
