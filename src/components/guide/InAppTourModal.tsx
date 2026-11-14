'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';
import { IN_APP_TOUR_STEPS } from '@/lib/guideData';

export default function InAppTourModal() {
  const { isTourOpen, currentTourIndex, closeTour, nextTourStep, prevTourStep } = useGuideStore();
  const { language, isRtl } = useApp();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const activeStep = IN_APP_TOUR_STEPS[currentTourIndex] || IN_APP_TOUR_STEPS[0];
  const totalSteps = IN_APP_TOUR_STEPS.length;

  // Measure and scroll target into view
  useEffect(() => {
    if (!isTourOpen) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const el = document.querySelector(activeStep.targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        // Fallback to center if element is not in DOM
        setTargetRect(null);
      }
    };

    updatePosition();
    const timer = setTimeout(updatePosition, 300); // Allow smooth scroll to settle
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isTourOpen, currentTourIndex, activeStep]);

  if (!isTourOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Dimmed backdrop with smooth cutout around target */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="tour-mask">
            {/* White covers everything */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black hole cuts out the target */}
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="16"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%" height="100%"
          fill="rgba(0, 0, 0, 0.65)"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* Target Gold Ring Highlight */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            left: `${targetRect.left - 8}px`,
            top: `${targetRect.top - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
          className="rounded-2xl border-2 border-brand-gold shadow-[0_0_25px_rgba(201,164,92,0.6)] pointer-events-none z-10"
        />
      )}

      {/* Floating Tour Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-20">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md rounded-3xl glass-panel p-6 border border-brand-gold/40 shadow-2xl bg-white/95 dark:bg-brand-navy/95 pointer-events-auto"
        >
          {/* Header Row: Step Badge + Close */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
              <Sparkles className="w-3 h-3" />
              <span>
                {language === 'ml'
                  ? `ഘട്ടം ${currentTourIndex + 1} / ${totalSteps}`
                  : language === 'ar'
                  ? `الخطوة ${currentTourIndex + 1} من ${totalSteps}`
                  : `Step ${currentTourIndex + 1} of ${totalSteps}`}
              </span>
            </span>

            <button
              onClick={closeTour}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Content */}
          <h3 className="text-lg font-clash font-bold text-brand-navy dark:text-white mb-2">
            {activeStep.title[language]}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
            {activeStep.content[language]}
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-white/10">
            <button
              onClick={prevTourStep}
              disabled={currentTourIndex === 0}
              className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-xl transition-colors ${
                currentTourIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-neutral-400'
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'ml' ? 'മുമ്പ്' : language === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {IN_APP_TOUR_STEPS.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentTourIndex ? 'bg-brand-gold w-4' : 'bg-neutral-300 dark:bg-white/20'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => nextTourStep(totalSteps)}
              className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold-light transition-all shadow-md active:scale-95"
            >
              <span>
                {currentTourIndex === totalSteps - 1
                  ? language === 'ml' ? 'പൂർത്തിയായി' : language === 'ar' ? 'إنهاء الجولة' : 'Finish'
                  : language === 'ml' ? 'അടുത്തത്' : language === 'ar' ? 'التالي' : 'Next'}
              </span>
              {currentTourIndex === totalSteps - 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : isRtl ? (
                <ArrowLeft className="w-3.5 h-3.5" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
