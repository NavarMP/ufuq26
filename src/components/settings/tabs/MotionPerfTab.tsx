'use client';

import React from 'react';
import { usePreferences, MotionMode, ScrollInertia } from '@/context/PreferencesContext';
import { Zap, Activity, BatteryCharging, Wind, Check } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function MotionPerfTab() {
  const { preferences, updatePreference } = usePreferences();

  const handleMotionChange = (mode: MotionMode) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('motionMode', mode);
  };

  const handleScrollChange = (inertia: ScrollInertia) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('smoothScrollInertia', inertia);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. MOTION SENSITIVITY TIERS */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Animation & Motion Experience
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: 'cinematic' as const,
              title: 'Cinematic',
              desc: 'Full 3D springs, Lenis scroll, Anime.js ripples & GSAP reveals',
            },
            {
              id: 'balanced' as const,
              title: 'Balanced',
              desc: 'Smooth standard fades & fluid micro-interactions',
            },
            {
              id: 'reduced' as const,
              title: 'Reduced Motion',
              desc: 'Instant transitions, zero parallax, vestibular friendly',
            },
          ].map((m) => {
            const isSelected = preferences.motionMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMotionChange(m.id)}
                type="button"
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-navy dark:text-white ring-1 ring-brand-gold/40'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:border-brand-gold/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold">{m.title}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LENIS SMOOTH SCROLL INERTIA */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Lenis Smooth Inertia Scrolling
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'glide' as const, label: 'Velvet Glide', desc: '1.4s Exponential decay' },
            { id: 'snappy' as const, label: 'Snappy', desc: '0.8s Modern response' },
            { id: 'native' as const, label: 'Native OS', desc: 'Direct browser scroll' },
          ].map((s) => {
            const isSelected = preferences.smoothScrollInertia === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleScrollChange(s.id)}
                type="button"
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-navy dark:text-white ring-1 ring-brand-gold/40 font-bold'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                }`}
              >
                <span className="block text-xs font-bold">{s.label}</span>
                <span className="block text-[10px] opacity-70 mt-0.5">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BATTERY SAVER / LOW POWER MODE */}
      <div className="pt-2 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
              <BatteryCharging className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Low-Power / Battery Saver Mode
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Throttles canvas visualizers and disables heavy GPU blur to extend battery life
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              hapticEngine.trigger('subtle');
              updatePreference('lowPowerMode', !preferences.lowPowerMode);
            }}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.lowPowerMode ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.lowPowerMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
