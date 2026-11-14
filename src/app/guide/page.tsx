'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import AIAssistant from '@/components/AIAssistant';

// Guide Architecture Components
import GuideHero from '@/components/guide/GuideHero';
import RoleTrackSelector from '@/components/guide/RoleTrackSelector';
import HorizonRoadmap from '@/components/guide/HorizonRoadmap';
import InteractiveSimulator from '@/components/guide/InteractiveSimulator';
import DelegateChecklist from '@/components/guide/DelegateChecklist';
import CampusTransitGuide from '@/components/guide/CampusTransitGuide';
import KeyboardShortcutsHud from '@/components/guide/KeyboardShortcutsHud';
import InAppTourModal from '@/components/guide/InAppTourModal';

import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';
import { ROLE_STEPS } from '@/lib/guideData';

export default function GuidePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { activeRole } = useGuideStore();
  const { language, isRtl } = useApp();

  const activeSteps = ROLE_STEPS[activeRole] || ROLE_STEPS.delegate;

  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-brand-cream/30 dark:bg-brand-dark">
      {/* Navigation Header */}
      <Navigation onOpenSearch={() => setIsSearchOpen(true)} />

      <main id="main-content" className="flex-1 focus:outline-none">
        {/* 1. Cinematic Hero & Horizon Identity */}
        <GuideHero />

        {/* 2. Main Content Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
          {/* Section: Role Track Selector */}
          <section>
            <RoleTrackSelector />
          </section>

          {/* Section: Active Role Curriculum Steps */}
          <section className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
              <div>
                <span className="text-xs font-semibold tracking-wider text-brand-gold uppercase">
                  {language === 'ml' ? 'ഘട്ടം ഘട്ടമായുള്ള വഴികാട്ടി' : language === 'ar' ? 'خطوات التنفيذ المنهجية' : 'Curated Step-by-Step Pathway'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-clash font-bold text-brand-navy dark:text-white mt-1">
                  {language === 'ml' ? 'നിങ്ങൾ ചെയ്യേണ്ട പ്രധാന കാര്യങ്ങൾ' : language === 'ar' ? 'دليلك الإجرائي المباشر' : 'Actionable Guidelines for Your Role'}
                </h2>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {activeSteps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/30 shadow-xl hover:border-brand-gold/50 transition-all relative overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-navy font-clash font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                          0{step.stepNumber}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-0.5 rounded-full text-xs font-bold font-mono bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                              {step.badge[language]}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-clash font-bold text-brand-navy dark:text-white mb-2">
                            {step.title[language]}
                          </h3>

                          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl mb-4">
                            {step.description[language]}
                          </p>

                          {/* Practical Tips */}
                          <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-neutral-200/60 dark:border-white/10 max-w-3xl mb-4">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block mb-2">
                              {language === 'ml' ? 'പ്രധാന നിർദ്ദേശങ്ങൾ:' : language === 'ar' ? 'توجيهات مهمة:' : 'Essential Recommendations:'}
                            </span>
                            <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                              {step.tips[language].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-brand-gold font-bold">·</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action Button */}
                          {step.actionUrl && step.actionLabel && (
                            <Link
                              href={step.actionUrl}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs sm:text-sm hover:bg-brand-gold-light transition-all shadow-md active:scale-95"
                            >
                              <span>{step.actionLabel[language]}</span>
                              {isRtl ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Section: 7-Day Horizon Interactive Roadmap */}
          <HorizonRoadmap />

          {/* Section: Interactive Feature Simulators */}
          <InteractiveSimulator />

          {/* Section: Delegate Readiness Checklist */}
          <DelegateChecklist />

          {/* Section: Campus Transit Logistics */}
          <CampusTransitGuide />
        </div>
      </main>

      <Footer />

      {/* Global Modals & Floats */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AIAssistant />
      <KeyboardShortcutsHud />
      <InAppTourModal />
    </div>
  );
}
