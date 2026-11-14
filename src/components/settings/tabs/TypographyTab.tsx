'use client';

import React from 'react';
import { usePreferences, FontSizeScale } from '@/context/PreferencesContext';
import { Language } from '@/types';
import { Globe, Type, AlignLeft, AlignRight, BookOpen, Check } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function TypographyTab() {
  const { preferences, updatePreference } = usePreferences();

  const handleLanguageChange = (lang: Language) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('language', lang);
  };

  const handleFontSizeChange = (size: FontSizeScale) => {
    soundEngine.playSliderTick(
      size === 'sm' ? 0.2 : size === 'md' ? 0.5 : size === 'lg' ? 0.8 : 1.0
    );
    hapticEngine.trigger('subtle');
    updatePreference('fontSize', size);
  };

  const languages: {
    id: Language;
    label: string;
    native: string;
    dir: 'ltr' | 'rtl';
    desc: string;
  }[] = [
    { id: 'en', label: 'English', native: 'English', dir: 'ltr', desc: 'Global official edition' },
    { id: 'ml', label: 'Malayalam', native: 'മലയാളം', dir: 'ltr', desc: 'പ്രാദേശിക മാധ്യമം' },
    { id: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl', desc: 'لغة العلم والتراث' },
  ];

  const fontSizes: { id: FontSizeScale; label: string; scale: string; desc: string }[] = [
    { id: 'sm', label: 'Compact', scale: '87.5%', desc: '14px base' },
    { id: 'md', label: 'Standard', scale: '100%', desc: '16px base' },
    { id: 'lg', label: 'Comfort', scale: '112.5%', desc: '18px base' },
    { id: 'xl', label: 'Large', scale: '125%', desc: '20px base' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. LANGUAGE SELECTOR */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Camp Language & Script
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((lang) => {
            const isSelected = preferences.language === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                type="button"
                className={`flex flex-col items-start p-4 rounded-2xl border text-left rtl:text-right transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-navy dark:text-white shadow-sm ring-1 ring-brand-gold/40'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:border-brand-gold/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-base font-bold font-clash">{lang.native}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-gold" />}
                </div>
                <div className="flex items-center gap-1.5 text-xs opacity-75">
                  <Globe className="w-3 h-3" />
                  <span>{lang.label}</span>
                  <span className="uppercase text-[9px] font-mono px-1 rounded bg-black/10 dark:bg-white/10">
                    {lang.dir}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                  {lang.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC TEXT SIZE SCALING */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Text Size Zoom Scaling
          </label>
          <span className="text-xs font-mono font-bold text-brand-gold">
            {fontSizes.find((f) => f.id === preferences.fontSize)?.scale}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {fontSizes.map((size) => {
            const isSelected = preferences.fontSize === size.id;
            return (
              <button
                key={size.id}
                onClick={() => handleFontSizeChange(size.id)}
                type="button"
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/20 text-brand-navy dark:text-white shadow-sm ring-1 ring-brand-gold/40 font-bold'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                }`}
              >
                <span className="block text-xs font-semibold">{size.label}</span>
                <span className="block text-[11px] opacity-70 mt-0.5">{size.scale}</span>
                <span className="block text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {size.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYSLEXIA HIGH LEGIBILITY MODE */}
      <div className="pt-2 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Dyslexia-Friendly High Legibility
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Expands letter-spacing and word-spacing for comfortable reading
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              hapticEngine.trigger('subtle');
              updatePreference('dyslexicFont', !preferences.dyslexicFont);
            }}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.dyslexicFont ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
