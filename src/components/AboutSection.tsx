'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { BookOpen, Compass, ExternalLink, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const { eventInfo } = useEvent();
  const { language, t, isRtl } = useApp();

  return (
    <section
      id="about"
      aria-label="About the Camp and Organizers"
      className="py-20 md:py-32 px-4 max-w-6xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {t('about.title')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {t('about.campTitle')}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
      </div>

      {/* Main Camp Purpose / Story Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/30 shadow-2xl mb-12 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none"
        />
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4 text-left rtl:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal dark:text-emerald-400 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Transition & Leadership</span>
            </div>
            <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">
              Bridging Sacred Tradition & Modern Higher Studies
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
              {resolveLocalized(eventInfo.description, language)}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-brand-gold/15">
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="font-clash font-bold text-xl text-brand-gold">7 Days</div>
                <div className="text-xs text-neutral-500 mt-0.5">Intensive Residency</div>
              </div>
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="font-clash font-bold text-xl text-brand-teal dark:text-emerald-400">1-on-1</div>
                <div className="text-xs text-neutral-500 mt-0.5">Alumni Mentorship</div>
              </div>
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="font-clash font-bold text-xl text-brand-gold">360°</div>
                <div className="text-xs text-neutral-500 mt-0.5">Academic Roadmap</div>
              </div>
            </div>
          </div>

          {/* Dars Typographic Identity Showcase */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-brand-navy text-center border border-brand-gold/20 shadow-inner">
            <div className="w-full max-w-[200px] h-20 relative mb-4">
              <Image
                src="/images/dars-typo.svg"
                alt="Alathurpadi Dars Typography"
                fill
                className="object-contain filter invert opacity-90"
              />
            </div>
            <span className="text-xs font-arabic text-brand-gold tracking-wider">
              دار العلثورپادي
            </span>
            <span className="text-[11px] text-neutral-400 mt-1">
              Established seat of classical learning in Malabar
            </span>
          </div>
        </div>
      </div>

      {/* Two Pillars: ADSA & SUFFA (Dedicated Editable Sections) */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* ADSA CARD */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/25 shadow-xl flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy p-2 flex items-center justify-center shrink-0 border border-brand-gold/30">
                <Image
                  src="/images/adsa-logo.svg"
                  alt="ADSA Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">
                  The Organizer
                </span>
                <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white leading-tight">
                  Alathurpadi Dars Students Association
                </h3>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {t('about.adsaDescription')}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-gold/15 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Official Body</span>
            <a
              href="https://alathurpadidars.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-gold hover:text-brand-gold-hover font-semibold"
            >
              <span>alathurpadidars.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* SUFFA CARD */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/25 shadow-xl flex flex-col justify-between hover:border-brand-gold/50 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 p-2 flex items-center justify-center shrink-0 border border-brand-teal/30">
                <BookOpen className="w-6 h-6 text-brand-teal dark:text-emerald-400" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-brand-teal dark:text-emerald-400 uppercase tracking-wider">
                  The Students Union
                </span>
                <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white leading-tight">
                  SUFFA Dars
                </h3>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              <strong>SUFFA</strong> (Scholars Union For Fundamental Activities) is the vibrant union of students studying at Alathurpadi Dars. Throughout the year, SUFFA cultivates academic rigor, community welfare, and literary pursuits. UFUQ ’26 is specially designed to empower SUFFA members graduating this year as they step into university corridors.
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-gold/15 flex items-center justify-between text-xs">
            <span className="text-neutral-500 font-medium">Student Fraternity</span>
            <span className="text-brand-teal dark:text-emerald-400 font-mono font-medium">Graduating Cohort ’26</span>
          </div>
        </div>
      </div>

      {/* Usthad Spotlight Feature (Verified Local Asset) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 border border-brand-gold/30 shadow-xl bg-gradient-to-br from-brand-navy/5 via-transparent to-brand-gold/5">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-brand-gold/40 shadow-2xl">
              <Image
                src="/images/Usthad.png"
                alt="Usthad of Alathurpadi Dars"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="md:col-span-8 space-y-3 text-left rtl:text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Spiritual & Academic Guidance</span>
            </div>
            <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">
              Rooted in the Heritage of Alathurpadi
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Alathurpadi Dars is celebrated for preserving the unblemished tradition of classical Islamic scholarship in Kerala. Under the beloved guidance of our respected Usthad, generations of students have absorbed not merely texts, but deep spiritual etiquette, ethical discipline, and service to humanity. UFUQ ’26 carries this sacred legacy forward into every academic faculty.
            </p>
            <p className="text-xs text-brand-teal dark:text-emerald-400 font-medium italic">
              &ldquo;Knowledge without ethical roots is fragile; with Ilm, our scholars stand prepared for any challenge the world presents.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Dedicated Masterpiece About Page Gateway Banner */}
      <div className="mt-12 rounded-3xl glass-panel p-6 sm:p-10 border-2 border-brand-gold/40 shadow-2xl bg-gradient-to-r from-brand-navy/10 via-brand-gold/10 to-brand-teal/10 relative overflow-hidden group hover:border-brand-gold/70 transition-all duration-300">
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500"
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left rtl:md:text-right">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider border border-brand-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Historical Chronicle & Ecosystem</span>
            </div>
            <h3 className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-navy dark:text-white">
              Explore the Dedicated About Experience
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Immerse yourself in the comprehensive history of Alathurpadi Dars, the guidance of our revered Ustads, the fraternities of ADSA and SUFFA, the sacred philosophy of <strong className="text-brand-gold">SUHBA (صُحْبَة)</strong>, and the searchable directory of all <strong>39+ SUFFA Dars institutions</strong>.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-sm shadow-xl shadow-brand-gold/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Explore Dedicated Page</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
