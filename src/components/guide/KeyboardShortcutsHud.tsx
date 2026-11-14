'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Keyboard } from 'lucide-react';
import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';
import { KEYBOARD_SHORTCUTS } from '@/lib/guideData';

export default function KeyboardShortcutsHud() {
  const { isShortcutsOpen, closeShortcuts, openShortcuts, openTour } = useGuideStore();
  const { language } = useApp();

  // Listen globally for '?' key to toggle HUD, and 'T' for tour
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside form inputs or textareas
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (isShortcutsOpen) {
          closeShortcuts();
        } else {
          openShortcuts();
        }
      } else if (e.key === 'Escape' && isShortcutsOpen) {
        e.preventDefault();
        closeShortcuts();
      } else if ((e.key === 't' || e.key === 'T') && !isShortcutsOpen) {
        e.preventDefault();
        openTour(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, openShortcuts, closeShortcuts, openTour]);

  return (
    <AnimatePresence>
      {isShortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeShortcuts}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/40 shadow-2xl z-10 bg-white/95 dark:bg-brand-navy/95"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="shortcuts-title" className="text-lg font-clash font-bold text-brand-navy dark:text-white">
                    {language === 'ml' ? 'കീബോർഡ് ഷോർട്ട്കട്ടുകൾ' : language === 'ar' ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts HUD'}
                  </h3>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {language === 'ml' ? 'അതിവേഗ നാവിഗേഷൻ കൺട്രോളുകൾ' : language === 'ar' ? 'تحكم سريع وسلس في كامل المنصة' : 'Power navigation controls for UFUQ ’26'}
                  </span>
                </div>
              </div>

              <button
                onClick={closeShortcuts}
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                aria-label="Close shortcuts modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-3 mb-6">
              {KEYBOARD_SHORTCUTS.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 text-xs sm:text-sm"
                >
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {sc.description[language]}
                  </span>
                  <div className="flex items-center gap-1">
                    {sc.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-brand-navy border border-neutral-300 dark:border-white/20 text-neutral-800 dark:text-brand-gold font-mono text-xs font-bold shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span>Press <kbd className="font-mono bg-black/5 dark:bg-white/10 px-1 rounded">Esc</kbd> to close</span>
              <span>UFUQ ’26 Horizon Engine</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
