'use client';

import React from 'react';
import { usePreferences, AccentColor, GlassmorphismTier } from '@/context/PreferencesContext';
import { Sun, Moon, Laptop, Eye, Sparkles, Droplet, ShieldCheck, Check } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function AppearanceTab() {
  const { preferences, updatePreference } = usePreferences();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('theme', newTheme);
  };

  const handleAccentChange = (accent: AccentColor) => {
    soundEngine.playClick(1.3);
    hapticEngine.trigger('subtle');
    updatePreference('accentColor', accent);
  };

  const handleGlassChange = (glass: GlassmorphismTier) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('glassmorphism', glass);
  };

  const accents: { id: AccentColor; name: string; color: string; desc: string }[] = [
    { id: 'gold', name: 'Royal Gold', color: '#c9a45c', desc: 'UFUQ official celestial gold' },
    { id: 'teal', name: 'Sufi Teal', color: '#527a70', desc: 'Spiritual serene emerald' },
    { id: 'midnight', name: 'Celestial Blue', color: '#3b82f6', desc: 'Intellectual sapphire clarity' },
    { id: 'amber', name: 'ADSA Amber', color: '#f5ad1f', desc: 'Historic association energy' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. THEME MODE SELECTOR */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Interface Theme
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'light' as const, label: 'Light', icon: Sun, desc: 'Desert Cream' },
            { id: 'dark' as const, label: 'Dark', icon: Moon, desc: 'Celestial Navy' },
            { id: 'system' as const, label: 'System', icon: Laptop, desc: 'Sync with OS' },
          ].map(({ id, label, icon: Icon, desc }) => {
            const isSelected = preferences.theme === id;
            return (
              <button
                key={id}
                onClick={() => handleThemeChange(id)}
                type="button"
                className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-brand-gold/15 border-brand-gold text-brand-navy dark:text-white shadow-md ring-1 ring-brand-gold/40'
                    : 'bg-black/5 dark:bg-white/5 border-neutral-200/60 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-brand-gold/40'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-brand-gold' : ''}`} />
                <span className="text-xs font-bold">{label}</span>
                <span className="text-[10px] opacity-70 mt-0.5">{desc}</span>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* OLED Pure Black toggle (visible when dark or system) */}
        {(preferences.theme === 'dark' || preferences.theme === 'system') && (
          <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10">
            <div>
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                OLED Pure Black Mode
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                True #000000 background for mobile OLED screens & maximum power saving
              </p>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick();
                hapticEngine.trigger('subtle');
                updatePreference('oledBlack', !preferences.oledBlack);
              }}
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                preferences.oledBlack ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.oledBlack ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* 2. ROYAL HERITAGE ACCENT PALETTES */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Royal Heritage Accent Color
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {accents.map((acc) => {
            const isSelected = preferences.accentColor === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => handleAccentChange(acc.id)}
                type="button"
                className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/10 shadow-sm'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className="w-5 h-5 rounded-full shadow-inner border border-white/20"
                    style={{ backgroundColor: acc.color }}
                  />
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                </div>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  {acc.name}
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight mt-0.5">
                  {acc.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. GLASSMORPHISM & BLUR TIERS */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Frosted Glass & Depth
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'cinematic' as const, label: 'Cinematic', desc: '24px Luxury Blur' },
            { id: 'balanced' as const, label: 'Balanced', desc: '10px Standard Blur' },
            { id: 'solid' as const, label: 'Solid Low-GPU', desc: 'Opaque / High Perf' },
          ].map(({ id, label, desc }) => {
            const isSelected = preferences.glassmorphism === id;
            return (
              <button
                key={id}
                onClick={() => handleGlassChange(id)}
                type="button"
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-navy dark:text-white'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span className="block text-xs font-bold">{label}</span>
                <span className="block text-[10px] opacity-70 mt-0.5">{desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. HIGH CONTRAST & LIQUID CURSOR TOGGLES */}
      <div className="space-y-3 pt-2 border-t border-black/5 dark:border-white/10">
        {/* High Contrast */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                High Contrast Mode (WCAG AAA)
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Enhanced border definitions & 7:1 text contrast for bright outdoor reading
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              hapticEngine.trigger('subtle');
              updatePreference(
                'contrastMode',
                preferences.contrastMode === 'high' ? 'standard' : 'high'
              );
            }}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.contrastMode === 'high' ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.contrastMode === 'high' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Custom Liquid Cursor */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Custom Liquid Cursor & Ripple Shockwaves
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Smooth magnetic pointer and click ripples on desktop trackpad/mouse
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              hapticEngine.trigger('subtle');
              updatePreference('customCursor', !preferences.customCursor);
            }}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.customCursor ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.customCursor ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
