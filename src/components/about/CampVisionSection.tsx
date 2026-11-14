'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Compass, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CampVisionSection() {
  const { t, isRtl } = useApp();
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const daysData = [
    {
      day: 1,
      date: 'Dec 24, 2026',
      title: t('aboutPage.campVision.day1'),
      tagline: 'Cohort Identity, Camp Ethos & The Horizon Ahead',
      highlights: [
        'Welcome & blessing by respected Usthad & ADSA leadership',
        'Cohort orientation: navigating the transition from Dars to University',
        'Personal baseline assessment & mentorship pairing',
      ],
      leadCategory: 'Orientation',
    },
    {
      day: 2,
      date: 'Dec 25, 2026',
      title: t('aboutPage.campVision.day2'),
      tagline: 'Central Universities, Admissions & Entrance Landscapes',
      highlights: [
        'Comprehensive breakdown of CUET-PG, JNU, AMU, JMI, DU, and HCU',
        'Choosing disciplines: Humanities, Social Sciences, Law, and Languages',
        'Entrance test strategies and mock analytical questions',
      ],
      leadCategory: 'Academics',
    },
    {
      day: 3,
      date: 'Dec 26, 2026',
      title: t('aboutPage.campVision.day3'),
      tagline: 'Critical Thinking, Epistemic Rigor & Intellectual Independence',
      highlights: [
        'Anchoring intellectual discernment in authentic Islamic episteme',
        'Deconstructing postmodern and secular philosophies with confidence',
        'Maintaining spiritual equilibrium in pluralistic campus environments',
      ],
      leadCategory: 'Intellectual',
    },
    {
      day: 4,
      date: 'Dec 27, 2026',
      title: t('aboutPage.campVision.day4'),
      tagline: 'Language Mastery, Statement of Purpose & Research Proposals',
      highlights: [
        'Hands-on workshop on Academic English and vocabulary building',
        'Crafting winning Statements of Purpose (SOP) and personal statements',
        'Structuring initial research proposals for master’s and doctoral degrees',
      ],
      leadCategory: 'Skills Workshop',
    },
    {
      day: 5,
      date: 'Dec 28, 2026',
      title: t('aboutPage.campVision.day5'),
      tagline: 'Fellowships, National & International Scholarships',
      highlights: [
        'Navigating MANF, UGC NET-JRF, ICSSR, and government funding schemes',
        'International scholarships: Chevening, Commonwealth, Erasmus, DAAD',
        'Building a competitive academic profile and portfolio',
      ],
      leadCategory: 'Guidance',
    },
    {
      day: 6,
      date: 'Dec 29, 2026',
      title: t('aboutPage.campVision.day6'),
      tagline: 'Ethical Leadership, Public Speaking & Alumni Mentorship Circles',
      highlights: [
        'Public speaking, articulation, and constructive dialogue skills',
        'Live roundtable with SUFFA alumni studying across top universities',
        'Interactive Q&A: real-world campus life experiences and pitfalls to avoid',
      ],
      leadCategory: 'Mentorship',
    },
    {
      day: 7,
      date: 'Dec 30, 2026',
      title: t('aboutPage.campVision.day7'),
      tagline: 'Individual Horizon Blueprints, Valedictory Assembly & Du’a',
      highlights: [
        'Finalizing personal 3-year transition roadmaps with assigned mentors',
        'Formal pledge of community service, humility, and lifelong Suhbah',
        'Culmination assembly with senior scholars, certificates, and blessed Du’a',
      ],
      leadCategory: 'Valedictory',
    },
  ];

  const currentDayData = daysData.find((d) => d.day === selectedDay) || daysData[0];

  return (
    <section
      id="camp-matrix"
      aria-label="Camp UFUQ Vision & 7-Day Matrix"
      className="py-20 md:py-28 px-4 max-w-6xl mx-auto relative"
    >
      {/* Background Soft Glow */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/15 text-brand-teal dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest border border-brand-teal/30">
          <Compass className="w-3.5 h-3.5" />
          {t('aboutPage.campVision.badge')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white">
          {t('aboutPage.campVision.title')}
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          {t('aboutPage.campVision.subtitle')}
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-teal to-transparent mx-auto mt-4 rounded-full" />
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 text-center">
          <div className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-gold">7 Days</div>
          <div className="text-xs text-neutral-500 mt-1">Full Residential Immersion</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 text-center">
          <div className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-teal dark:text-emerald-400">100</div>
          <div className="text-xs text-neutral-500 mt-1">Selected Graduating Cohort</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 text-center">
          <div className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-gold">1-on-1</div>
          <div className="text-xs text-neutral-500 mt-1">Suhba Alumni Mentorship</div>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 text-center">
          <div className="font-clash text-2xl sm:text-3xl font-extrabold text-brand-teal dark:text-emerald-400">360°</div>
          <div className="text-xs text-neutral-500 mt-1">Academic & Ethical Roadmap</div>
        </div>
      </div>

      {/* Interactive Day Selection Track */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/30 shadow-2xl mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h3 className="font-clash font-bold text-lg sm:text-xl text-brand-navy dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-gold" />
            <span>Interactive Day-by-Day Journey</span>
          </h3>
          <span className="text-xs text-neutral-500 font-medium">
            December 24–30, 2026 · Alathurpadi Campus
          </span>
        </div>

        {/* 7 Day Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {daysData.map((d) => {
            const isSelected = d.day === selectedDay;
            return (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`flex-1 min-w-[100px] sm:min-w-[130px] p-3 rounded-2xl transition-all duration-300 text-center border ${
                  isSelected
                    ? 'bg-brand-gold text-brand-navy border-brand-gold font-bold shadow-lg scale-105'
                    : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-brand-gold/30 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className={`text-xs uppercase tracking-wider ${isSelected ? 'text-brand-navy' : 'text-neutral-500'}`}>
                  Day {d.day}
                </div>
                <div className="font-clash font-bold text-sm sm:text-base mt-0.5 whitespace-nowrap">
                  {d.date.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Content Card */}
        <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal dark:text-emerald-400 text-xs font-semibold">
              {currentDayData.leadCategory}
            </span>
            <span className="text-xs text-brand-gold font-mono font-medium">
              Day {currentDayData.day} / 7
            </span>
          </div>

          <div>
            <h4 className="font-clash text-xl sm:text-2xl font-bold text-brand-navy dark:text-white">
              {currentDayData.title}
            </h4>
            <p className="text-sm text-brand-gold-light dark:text-brand-gold font-medium mt-1">
              {currentDayData.tagline}
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-brand-gold/15">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
              Core Modules & Outcomes
            </span>
            {currentDayData.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs">
            <Link
              href="/#schedule"
              className="inline-flex items-center gap-1.5 text-brand-gold hover:underline font-semibold"
            >
              <span>{t('aboutPage.cta.scheduleBtn')}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
            <span className="text-neutral-400">Full syllabus provided at camp check-in</span>
          </div>
        </div>
      </div>
    </section>
  );
}
