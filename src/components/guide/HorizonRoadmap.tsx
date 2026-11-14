'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useGuideStore } from '@/store/guideStore';
import { soundFx } from '@/lib/soundFx';
import { SEVEN_HORIZONS } from '@/lib/guideData';

export default function HorizonRoadmap() {
  const { language } = useApp();
  const { soundEnabled } = useGuideStore();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [expandedSessionsDay, setExpandedSessionsDay] = useState<number | null>(1);

  const activeHorizon = SEVEN_HORIZONS.find((h) => h.dayNumber === selectedDay) || SEVEN_HORIZONS[0];

  const handleDaySelect = (dayNum: number) => {
    soundFx.step(soundEnabled);
    soundFx.haptic(10);
    setSelectedDay(dayNum);
    setExpandedSessionsDay(dayNum);
  };

  const handleDownloadDayCalendar = (day: typeof activeHorizon) => {
    soundFx.success(soundEnabled);
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UFUQ 26//Horizon Day ${day.dayNumber}//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:UFUQ '26 - Day ${day.dayNumber}: ${day.title.en}
DESCRIPTION:${day.theme.en}\\nAlathurpadi Dars Campus, Malappuram
DTSTART;VALUE=DATE:${day.date.replace(/-/g, '')}
DTEND;VALUE=DATE:${day.date.replace(/-/g, '')}
LOCATION:Alathurpadi Dars Campus, Malappuram, Kerala
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `UFUQ26-Day-${day.dayNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
            {language === 'ml' ? '7 ദിന ചക്രവാളങ്ങൾ' : language === 'ar' ? 'الآفاق السبعة للمخيم' : 'The 7 Days of Horizon'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
            {language === 'ml' ? 'സമ്പൂർണ്ണ ക്യാമ്പ് റോഡ്മാപ്പ്' : language === 'ar' ? 'خارطة طريق المخيم يوماً بيوم' : 'Comprehensive Daily Journey'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-sm">
          {language === 'ml'
            ? 'ഡിസംബർ 24 മുതൽ 30 വരെയുള്ള ഓരോ ദിവസത്തെയും പ്രധാന വിഷയങ്ങളും വർക്ക്‌ഷോപ്പുകളും ഇവിടെ വിശദമായി പരിശോധിക്കാം.'
            : language === 'ar'
            ? 'استعرض المحاور الرئيسية لكل يوم من 24 إلى 30 ديسمبر مع مواعيد الجلسات وقائمة العلماء المشاركين.'
            : 'Explore each day’s spiritual milestones, intellectual sessions, and actionable competencies from Dec 24 to 30.'}
        </p>
      </div>

      {/* Day Selector Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {SEVEN_HORIZONS.map((horizon) => {
          const isActive = selectedDay === horizon.dayNumber;
          return (
            <button
              key={horizon.dayNumber}
              onClick={() => handleDaySelect(horizon.dayNumber)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                isActive
                  ? 'bg-brand-navy text-white dark:bg-brand-gold dark:text-brand-navy border-brand-gold shadow-md font-bold'
                  : 'bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-white/10 hover:border-brand-gold/40'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive ? 'bg-brand-gold text-brand-navy dark:bg-brand-navy dark:text-brand-gold' : 'bg-neutral-100 dark:bg-white/10'
              }`}>
                {horizon.dayNumber}
              </span>
              <span className="font-clash">
                {language === 'ml' ? `ദിനം ${horizon.dayNumber}` : language === 'ar' ? `اليوم ${horizon.dayNumber}` : `Day ${horizon.dayNumber}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Horizon Feature Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeHorizon.dayNumber}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/30 shadow-xl relative overflow-hidden"
        >
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute top-2 right-4 text-7xl sm:text-9xl font-bold font-clash text-brand-gold/5 dark:text-brand-gold/10 pointer-events-none select-none">
            0{activeHorizon.dayNumber}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-200/60 dark:border-white/10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-gold/20 text-brand-gold border border-brand-gold/40 font-mono">
                  {activeHorizon.dateFormatted[language]}
                </span>
                <span className="text-xs font-serif italic text-brand-teal dark:text-brand-gold-light">
                  {activeHorizon.tagline[language]}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-clash font-bold text-brand-navy dark:text-white mb-2">
                {activeHorizon.title[language]}
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
                {activeHorizon.theme[language]}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleDownloadDayCalendar(activeHorizon)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold font-semibold text-xs sm:text-sm border border-brand-gold/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                title="Add Day Schedule to Calendar (.ics)"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'ml' ? 'കലണ്ടറിലേക്ക് (.ics)' : language === 'ar' ? 'حفظ اليوم في التقويم' : 'Add Day to Calendar (.ics)'}</span>
              </button>
            </div>
          </div>

          {/* Highlights & Sessions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
            {/* Key Themes / Competency Focus */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'പ്രധാന നാഴികക്കല്ലുകൾ' : language === 'ar' ? 'محاور اليوم وأهدافه' : 'Day Focus & Objectives'}</span>
              </h4>
              <ul className="space-y-2.5">
                {activeHorizon.highlights[language].map((hl, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Sessions Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === 'ml' ? 'സെഷൻ സമയക്രമം' : language === 'ar' ? 'جدول الجلسات المعتمد' : 'Featured Halqa Sessions'}</span>
                </h4>
              </div>

              <div className="space-y-2.5">
                {activeHorizon.sessions.map((sess, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/70 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-brand-gold px-2 py-1 rounded-md bg-brand-gold/10 border border-brand-gold/20 shrink-0">
                        {sess.time}
                      </span>
                      <div>
                        <div className="font-semibold text-brand-navy dark:text-white">
                          {sess.title[language]}
                        </div>
                        {sess.speaker && (
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {sess.speaker}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal dark:text-brand-gold-light border border-brand-teal/30 shrink-0">
                      {sess.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
