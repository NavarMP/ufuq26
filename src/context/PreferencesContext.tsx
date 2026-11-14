'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Language, Theme } from '@/types';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export type AccentColor = 'gold' | 'teal' | 'midnight' | 'amber';
export type GlassmorphismTier = 'cinematic' | 'balanced' | 'solid';
export type ContrastMode = 'standard' | 'high';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';
export type MotionMode = 'cinematic' | 'balanced' | 'reduced';
export type ScrollInertia = 'glide' | 'snappy' | 'native';
export type CountdownFormat = 'days' | 'full' | 'compact';

export interface PreferencesState {
  // Appearance & Theming
  theme: Theme;
  accentColor: AccentColor;
  glassmorphism: GlassmorphismTier;
  contrastMode: ContrastMode;
  oledBlack: boolean;
  customCursor: boolean;

  // Language & Typography
  language: Language;
  fontSize: FontSizeScale;
  fontHeading: 'clash' | 'sans';
  fontArabic: 'dgsahabah' | 'naskh';
  fontMalayalam: 'arima' | 'manjari';
  dyslexicFont: boolean;

  // Audio & Ambience
  masterAudioEnabled: boolean;
  masterVolume: number; // 0.0 - 1.0
  uiSoundsEnabled: boolean; // default: true
  uiSoundsVolume: number; // default: 0.25
  hapticsEnabled: boolean;
  hapticIntensity: 'subtle' | 'crisp' | 'off';

  // Motion & Performance
  motionMode: MotionMode;
  smoothScrollInertia: ScrollInertia;
  lowPowerMode: boolean;

  // Camp Experience & Offline
  countdownFormat: CountdownFormat;
  sessionRemindersEnabled: boolean;
  reminderLeadMinutes: 15 | 30 | 60;
  autoSaveDrafts: boolean;
}

const DEFAULT_PREFERENCES: PreferencesState = {
  theme: 'system',
  accentColor: 'gold',
  glassmorphism: 'cinematic',
  contrastMode: 'standard',
  oledBlack: false,
  customCursor: true,

  language: 'en',
  fontSize: 'md',
  fontHeading: 'clash',
  fontArabic: 'dgsahabah',
  fontMalayalam: 'arima',
  dyslexicFont: false,

  masterAudioEnabled: true,
  masterVolume: 0.8,
  uiSoundsEnabled: true,
  uiSoundsVolume: 0.25,
  hapticsEnabled: true,
  hapticIntensity: 'subtle',

  motionMode: 'cinematic',
  smoothScrollInertia: 'glide',
  lowPowerMode: false,

  countdownFormat: 'days',
  sessionRemindersEnabled: false,
  reminderLeadMinutes: 15,
  autoSaveDrafts: true,
};

const ACCENT_PALETTES: Record<
  AccentColor,
  { primary: string; hover: string; light: string; rgb: string }
> = {
  gold: {
    primary: '#c9a45c',
    hover: '#b8924b',
    light: '#ecdcb9',
    rgb: '201, 164, 92',
  },
  teal: {
    primary: '#527a70',
    hover: '#41635b',
    light: '#a1c2b9',
    rgb: '82, 122, 112',
  },
  midnight: {
    primary: '#3b82f6',
    hover: '#2563eb',
    light: '#bfdbfe',
    rgb: '59, 130, 246',
  },
  amber: {
    primary: '#f5ad1f',
    hover: '#df9710',
    light: '#fed7aa',
    rgb: '245, 173, 31',
  },
};

const FONT_SIZE_MAP: Record<FontSizeScale, string> = {
  sm: '87.5%', // 14px
  md: '100%', // 16px default
  lg: '112.5%', // 18px
  xl: '125%', // 20px
};

interface PreferencesContextType {
  preferences: PreferencesState;
  updatePreference: <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => void;
  resetToDefaults: () => void;
  hasCustomSettings: boolean;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'ufuq_preferences_v2';

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { language: appLang, setLanguage: setAppLang, theme: appTheme, setTheme: setAppTheme } = useApp();
  const [preferences, setPreferencesState] = useState<PreferencesState>(DEFAULT_PREFERENCES);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTabState] = useState('appearance');
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and synchronize with AppContext
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferencesState((prev) => ({
          ...prev,
          ...parsed,
          // Sync with AppContext if exists
          language: appLang || parsed.language || prev.language,
          theme: appTheme || parsed.theme || prev.theme,
        }));
      } else {
        // First run: synchronize with existing AppContext language/theme
        setPreferencesState((prev) => ({
          ...prev,
          language: appLang || prev.language,
          theme: appTheme || prev.theme,
        }));
      }
    } catch {
      // Fallback
    }

    // Global keyboard shortcut: Cmd+, or Ctrl+,
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
      }
      // Listen for custom trigger event
      if (e.key === 'Escape' && isSettingsOpen) {
        setIsSettingsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsSettingsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-settings-modal', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-settings-modal', handleCustomOpen);
    };
  }, [appLang, appTheme, isSettingsOpen]);

  // Synchronize procedural sound engine and haptics
  useEffect(() => {
    soundEngine.setEnabled(preferences.uiSoundsEnabled);
    soundEngine.setVolume(preferences.uiSoundsVolume);
    hapticEngine.setEnabled(preferences.hapticsEnabled);
  }, [preferences.uiSoundsEnabled, preferences.uiSoundsVolume, preferences.hapticsEnabled]);

  // Apply CSS Custom Properties and Class Modifiers to documentElement
  useEffect(() => {
    if (typeof document === 'undefined' || !mounted) return;
    const root = document.documentElement;

    // 1. Font Size Scaling
    root.style.fontSize = FONT_SIZE_MAP[preferences.fontSize] || '100%';

    // 2. Accent Color Variables
    const palette = ACCENT_PALETTES[preferences.accentColor] || ACCENT_PALETTES.gold;
    root.style.setProperty('--brand-gold', palette.primary);
    root.style.setProperty('--brand-gold-hover', palette.hover);
    root.style.setProperty('--brand-gold-light', palette.light);
    root.style.setProperty('--brand-gold-rgb', palette.rgb);

    // 3. High Contrast
    if (preferences.contrastMode === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 4. OLED Black
    if (preferences.oledBlack && preferences.theme === 'dark') {
      root.classList.add('oled-black');
    } else {
      root.classList.remove('oled-black');
    }

    // 5. Dyslexic Font
    if (preferences.dyslexicFont) {
      root.classList.add('font-dyslexic');
    } else {
      root.classList.remove('font-dyslexic');
    }

    // 6. Reduced Motion
    if (preferences.motionMode === 'reduced') {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // 7. Glassmorphism Tier
    root.setAttribute('data-glass', preferences.glassmorphism);
  }, [
    mounted,
    preferences.fontSize,
    preferences.accentColor,
    preferences.contrastMode,
    preferences.oledBlack,
    preferences.theme,
    preferences.dyslexicFont,
    preferences.motionMode,
    preferences.glassmorphism,
  ]);

  // Update a single preference
  const updatePreference = useCallback(
    <K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => {
      setPreferencesState((prev) => {
        const next = { ...prev, [key]: value };

        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {}
        }

        // Bridge with AppContext if language or theme changed
        if (key === 'language' && typeof value === 'string') {
          setAppLang(value as Language);
        }
        if (key === 'theme' && typeof value === 'string') {
          setAppTheme(value as Theme);
        }

        return next;
      });
    },
    [setAppLang, setAppTheme]
  );

  // Reset all preferences to factory defaults
  const resetToDefaults = useCallback(() => {
    soundEngine.playSuccess();
    hapticEngine.trigger('success');

    setPreferencesState(DEFAULT_PREFERENCES);
    setAppLang(DEFAULT_PREFERENCES.language);
    setAppTheme(DEFAULT_PREFERENCES.theme);

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    }
  }, [setAppLang, setAppTheme]);

  // Check if non-default settings are active
  const hasCustomSettings = useMemo(() => {
    return (
      preferences.accentColor !== 'gold' ||
      preferences.fontSize !== 'md' ||
      preferences.contrastMode !== 'standard' ||
      preferences.motionMode !== 'cinematic' ||
      preferences.glassmorphism !== 'cinematic' ||
      preferences.oledBlack ||
      preferences.dyslexicFont ||
      !preferences.uiSoundsEnabled ||
      preferences.smoothScrollInertia !== 'glide'
    );
  }, [preferences]);

  const openSettings = useCallback(() => {
    soundEngine.playWhoosh('in');
    hapticEngine.trigger('crisp');
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    soundEngine.playWhoosh('out');
    hapticEngine.trigger('subtle');
    setIsSettingsOpen(false);
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    soundEngine.playChime();
    hapticEngine.trigger('selection');
    setActiveTabState(tab);
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        resetToDefaults,
        hasCustomSettings,
        isSettingsOpen,
        openSettings,
        closeSettings,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
