'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Compass, Sparkles, Printer, HelpCircle, ArrowLeft, ArrowRight, PlayCircle } from 'lucide-react';
import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';
import SoundFxToggle from '@/components/guide/SoundFxToggle';

export default function GuideHero() {
  const { language, isRtl } = useApp();
  const { openTour, openShortcuts } = useGuideStore();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden border-b border-brand-gold/15 bg-gradient-to-b from-brand-navy/90 via-brand-navy to-brand-navy/95 text-white">
      {/* Decorative Celestial Horizon Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[350px] bg-gradient-to-b from-brand-gold/15 via-brand-teal/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 bg-brand-gold/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-brand-teal/15 rounded-full blur-2xl" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent bg-[size:32px_32px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation Row: Back to Home + Sound FX Toggle + Shortcuts Trigger */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/80 hover:text-brand-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-full px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ml' ? 'ഹോം പേജിലേക്ക്' : language === 'ar' ? 'العودة للرئيسية' : 'Back to Event Site'}</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <SoundFxToggle />

            <button
              onClick={openShortcuts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline font-mono">Hotkeys</span>
              <kbd className="hidden sm:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono border border-white/20">?</kbd>
            </button>
          </div>
        </div>

        {/* Hero Title & Identity Cluster */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold mb-4"
          >
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="font-clash tracking-wide uppercase">
              {language === 'ml' ? 'അുഫുഖ് ’26 സമഗ്ര വഴികാട്ടി' : language === 'ar' ? 'دليل أُفُق التفاعلي الشامل' : 'The Horizon Navigator · Interactive Guide'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-clash font-bold tracking-tight text-white leading-tight mb-4"
          >
            {language === 'ml' ? (
              <>
                വിജ്ഞാനത്തിൽ ഉറച്ച്, ലോകത്തിലേക്ക്.{' '}
                <span className="text-gold-gradient block sm:inline">അുഫുഖ് ’26 സമ്പൂർണ്ണ ഗൈഡ്</span>
              </>
            ) : language === 'ar' ? (
              <>
                راسخون في العلم. متأهبون للعالم.{' '}
                <span className="text-gold-gradient block sm:inline">دليلك الكامل لمعالم المخيم</span>
              </>
            ) : (
              <>
                Rooted in Ilm. Ready for the World.{' '}
                <span className="text-gold-gradient block sm:inline">Your Master Companion to UFUQ ’26.</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed mb-8 max-w-2xl font-light"
          >
            {language === 'ml'
              ? 'സുഫാ ദർസ് വിദ്യാർത്ഥികൾക്കായുള്ള 7 ദിന പരിവർത്തന ക്യാമ്പിന്റെ റൂട്ടുകൾ, രജിസ്ട്രേഷൻ ഘട്ടങ്ങൾ, ഷെഡ്യൂൾ വിവരങ്ങൾ, ക്യാമ്പസ് ചിട്ടകൾ എന്നിവ ഒരൊറ്റ വേദിയിൽ മനസ്സിലാക്കൂ.'
              : language === 'ar'
              ? 'كل ما تحتاج لمعرفته حول مخيم الانتقال والريادة لطلاب حلقات الصفة: خطوات التسجيل، وجدول الآفاق السبعة، وإرشادات السكن والحرم الجامعي بألاطوربادي.'
              : 'The comprehensive interactive handbook for SUFFA Dars delegates, institution mudarris coordinators, mentors, and organizers. Learn how to navigate registrations, schedules, and camp life.'}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => openTour(0)}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold text-sm shadow-lg shadow-brand-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <PlayCircle className="w-4 h-4" />
              <span>{language === 'ml' ? 'ഇന്ററാക്ടീവ് ടൂർ ആരംഭിക്കുക' : language === 'ar' ? 'بدء الجولة التفاعلية' : 'Launch In-App Tour'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Printer className="w-4 h-4 text-brand-gold" />
              <span>{language === 'ml' ? 'ഫീൽഡ് ഗൈഡ് പ്രിന്റ് ചെയ്യുക' : language === 'ar' ? 'طباعة بطاقة الإرشادات' : 'Print Field Guide'}</span>
            </button>

            <Link
              href="/#register"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-teal/30 hover:bg-brand-teal/50 text-white font-medium text-sm border border-brand-teal/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>{language === 'ml' ? 'രജിസ്ട്രേഷൻ' : language === 'ar' ? 'التسجيل المباشر' : 'Register Now'}</span>
            </Link>
          </motion.div>
        </div>

        {/* Quick Spec Highlights Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-white/10 text-xs text-white/70">
          <div className="flex flex-col">
            <span className="font-mono text-brand-gold text-lg font-bold">Dec 24–30</span>
            <span className="text-[11px] uppercase tracking-wider">{language === 'ml' ? '7 ദിനങ്ങൾ' : language === 'ar' ? '7 أيام متواصلة' : '7 Days of Horizon'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-brand-gold text-lg font-bold">38+ Sessions</span>
            <span className="text-[11px] uppercase tracking-wider">{language === 'ml' ? 'സെഷനുകൾ' : language === 'ar' ? 'ورشة ومحاضرة' : 'Master Halqas'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-brand-gold text-lg font-bold">Alathurpadi</span>
            <span className="text-[11px] uppercase tracking-wider">{language === 'ml' ? 'മലപ്പുറം, കേരളം' : language === 'ar' ? 'ملابورم، كيرلا' : 'Campus Venue'}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-brand-gold text-lg font-bold">EN · ML · AR</span>
            <span className="text-[11px] uppercase tracking-wider">{language === 'ml' ? 'ത്രിഭാഷാ പിന്തുണ' : language === 'ar' ? 'ثلاث لغات رسمية' : 'Trilingual Support'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
