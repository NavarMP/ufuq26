'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { useApp } from '@/context/AppContext';
import { Sparkles, Calendar, ArrowRight, Volume2, ShieldCheck, Check } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function SettingsPreviewStage() {
  const { preferences } = usePreferences();
  const { isRtl } = useApp();

  const handleInteractiveClick = () => {
    soundEngine.playClick(1.2);
    hapticEngine.trigger('subtle');
  };

  return (
    <div className="rounded-2xl p-4 bg-black/5 dark:bg-white/5 border border-brand-gold/25 relative overflow-hidden transition-all duration-300">
      {/* Subtle glowing ambient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-gold/15 blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Live Preview Stage
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
          Scale: {preferences.fontSize.toUpperCase()}
        </span>
      </div>

      {/* Mock Interactive Card */}
      <div className="rounded-xl p-4 glass-panel bg-white/70 dark:bg-brand-navy/70 border border-brand-gold/30 shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/20 text-brand-gold">
                DEC 24–30, 2026
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Alathurpadi Campus
              </span>
            </div>
            <h4 className="font-clash font-bold text-base text-brand-navy dark:text-white leading-tight">
              {preferences.language === 'ar'
                ? 'أُفُق ٢٠٢٦ — مخيم القيادة والتحول'
                : preferences.language === 'ml'
                ? 'ഉഫുഖ് ’26 — നേതൃത്വ സംഗമം'
                : 'UFUQ ’26 — Leadership Camp'}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
              {preferences.language === 'ar'
                ? 'متجذر في العلم، مستعد للعالم. برنامج تدريبي متكامل لخريجي صفة درس.'
                : preferences.language === 'ml'
                ? 'ഇൽമിൽ വേരൂന്നി, ലോകത്തെ നയിക്കാൻ. സുഫാ ദർസ് പ്രതിഭകളുടെ പരിവർത്തന ക്യാമ്പ്.'
                : 'Rooted in Ilm. Ready for the World. A week-long transformative leadership camp.'}
            </p>
          </div>
        </div>

        {/* Action Buttons in preview */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={handleInteractiveClick}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-sm transition-transform active:scale-95"
          >
            <span>Test Sound & Haptic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="capitalize">{preferences.accentColor} Accent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
