'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

interface SettingsTriggerProps {
  variant?: 'navbar-desktop' | 'navbar-mobile' | 'drawer-item' | 'dock-item';
  className?: string;
  onBeforeOpen?: () => void;
}

export default function SettingsTrigger({
  variant = 'navbar-desktop',
  className = '',
  onBeforeOpen,
}: SettingsTriggerProps) {
  const { openSettings, hasCustomSettings, preferences } = usePreferences();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundEngine.playSnap();
    hapticEngine.trigger('crisp');
    if (onBeforeOpen) onBeforeOpen();
    openSettings();
  };

  // 1. DESKTOP FLOATING NAVBAR PILL BUTTON
  if (variant === 'navbar-desktop') {
    return (
      <div className="relative group/settings">
        <button
          onClick={handleClick}
          type="button"
          className={`relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold active:scale-95 ${className}`}
          aria-label="Preferences & Settings (⌘,)"
          title="Preferences (⌘,)"
        >
          <SlidersHorizontal className="w-4 h-4 transition-transform duration-500 ease-out group-hover/settings:rotate-45 group-hover/settings:scale-110" />

          {/* Golden pulsing indicator when user has custom preferences */}
          {hasCustomSettings && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold shadow-[0_0_8px_#c9a45c]" />
            </span>
          )}
        </button>

        {/* Ambient Tooltip on hover */}
        <div className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/settings:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
          <div className="px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide bg-brand-navy/95 dark:bg-brand-dark-surface/95 text-white dark:text-brand-gold-light border border-brand-gold/30 shadow-xl backdrop-blur-md flex items-center gap-1.5">
            <span>Preferences</span>
            <kbd className="px-1 py-0.2 rounded bg-white/15 text-[9px] font-mono">⌘,</kbd>
          </div>
        </div>
      </div>
    );
  }

  // 2. MOBILE HEADER COMPACT BUTTON
  if (variant === 'navbar-mobile') {
    return (
      <button
        onClick={handleClick}
        type="button"
        className={`relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none ${className}`}
        aria-label="Open Preferences"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {hasCustomSettings && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
        )}
      </button>
    );
  }

  // 3. MOBILE FULLSCREEN DRAWER ROW
  if (variant === 'drawer-item') {
    return (
      <button
        onClick={handleClick}
        type="button"
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-left ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Preferences & Experience</span>
              {hasCustomSettings && (
                <span className="px-1.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[9px] font-bold">
                  Custom
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/60 capitalize">
              {preferences.language.toUpperCase()} · {preferences.theme} · {preferences.accentColor}
            </div>
          </div>
        </div>
        <div className="text-brand-gold text-xs font-mono font-medium">⌘,</div>
      </button>
    );
  }

  // 4. MOBILE BOTTOM DOCK ITEM
  return (
    <button
      onClick={handleClick}
      type="button"
      className={`flex flex-col items-center gap-0.5 text-neutral-600 dark:text-neutral-400 hover:text-brand-gold py-1 px-2 focus:outline-none ${className}`}
      aria-label="Preferences"
    >
      <div className="relative">
        <SlidersHorizontal className="w-4 h-4" />
        {hasCustomSettings && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-gold" />
        )}
      </div>
      <span className="text-[10px]">Prefs</span>
    </button>
  );
}
