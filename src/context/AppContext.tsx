'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Theme } from '@/types';
import { getTranslation } from '@/lib/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
  isRtl: boolean;
  mounted: boolean;
  isOnline: boolean;
  isAudioPlaying: boolean;
  toggleAudio: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [ambientOsc, setAmbientOsc] = useState<GainNode | null>(null);

  // Initialize from localStorage and listeners
  useEffect(() => {
    setMounted(true);
    
    // Online/offline listeners
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Load saved language
      const savedLang = localStorage.getItem('ufuq_language') as Language;
      if (savedLang && ['en', 'ml', 'ar'].includes(savedLang)) {
        setLanguageState(savedLang);
      }

      // Load saved theme
      const savedTheme = localStorage.getItem('ufuq_theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Update HTML document attributes when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  // Update theme class on HTML element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ufuq_language', lang);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ufuq_theme', newTheme);
    }
  };

  // Subtle web audio ambient soundscape (warm meditative pad chords)
  const toggleAudio = () => {
    if (typeof window === 'undefined') return;

    if (isAudioPlaying) {
      if (audioCtx) {
        audioCtx.suspend();
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = audioCtx || new AudioContextClass();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        if (!ambientOsc) {
          // Create gentle harmonic ambient pad (432Hz root, soft chord)
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.04, ctx.currentTime);
          masterGain.connect(ctx.destination);

          // Frequencies: meditative harmonic resonance
          const notes = [216, 324, 432, 540];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Subtle LFO modulation
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(0.1 + idx * 0.05, ctx.currentTime);
            lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
            lfo.connect(osc.frequency);
            lfo.start();

            gain.gain.setValueAtTime(0.2 / notes.length, ctx.currentTime);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
          });

          setAmbientOsc(masterGain);
        }

        setAudioCtx(ctx);
        setIsAudioPlaying(true);
      } catch (err) {
        console.warn('Audio playback error', err);
      }
    }
  };

  const t = (key: string) => getTranslation(language, key);
  const isRtl = language === 'ar';

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        t,
        isRtl,
        mounted,
        isOnline,
        isAudioPlaying,
        toggleAudio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
