'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGuideStore } from '@/store/guideStore';
import { useApp } from '@/context/AppContext';

export default function SoundFxToggle() {
  const { soundEnabled, toggleSound } = useGuideStore();
  const { language } = useApp();

  const label = soundEnabled
    ? language === 'ml'
      ? 'ശബ്ദം: ഓൺ'
      : language === 'ar'
      ? 'المؤثرات: مفعلة'
      : 'Audio FX: On'
    : language === 'ml'
    ? 'ശബ്ദം: ഓഫ്'
    : language === 'ar'
    ? 'المؤثرات: معطلة'
    : 'Audio FX: Muted';

  return (
    <button
      onClick={toggleSound}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
        soundEnabled
          ? 'bg-brand-gold/15 border-brand-gold/40 text-brand-gold hover:bg-brand-gold/25'
          : 'bg-black/5 dark:bg-white/5 border-neutral-300 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-white'
      }`}
      aria-label={label}
      title={label}
    >
      {soundEnabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-brand-gold" />
          <span className="hidden sm:inline font-mono text-[11px]">{label}</span>
          {/* Subtle live acoustic wave visualizer indicator */}
          <span className="flex items-center gap-0.5 ml-0.5" aria-hidden="true">
            <span className="w-0.5 h-2.5 bg-brand-gold rounded-full animate-pulse" />
            <span className="w-0.5 h-3.5 bg-brand-gold rounded-full animate-pulse delay-75" />
            <span className="w-0.5 h-2 bg-brand-gold rounded-full animate-pulse delay-150" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono text-[11px]">{label}</span>
        </>
      )}
    </button>
  );
}
