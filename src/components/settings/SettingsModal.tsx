'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { useApp } from '@/context/AppContext';
import {
  X,
  Palette,
  Type,
  Volume2,
  Activity,
  HardDrive,
  Keyboard,
  RotateCcw,
  Sparkles,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

import AppearanceTab from './tabs/AppearanceTab';
import TypographyTab from './tabs/TypographyTab';
import AudioHapticsTab from './tabs/AudioHapticsTab';
import MotionPerfTab from './tabs/MotionPerfTab';
import CampOfflineTab from './tabs/CampOfflineTab';
import ShortcutsTab from './tabs/ShortcutsTab';
import SettingsPreviewStage from './SettingsPreviewStage';

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'appearance', label: 'Appearance & Ambience', icon: Palette, tag: 'Theme & Accents' },
  { id: 'typography', label: 'Language & Typography', icon: Type, tag: 'Font & Scripts' },
  { id: 'audio', label: 'Audio & Haptics', icon: Volume2, tag: 'Sound & Vibration' },
  { id: 'motion', label: 'Motion & Performance', icon: Activity, tag: 'Physics & Speed' },
  { id: 'camp', label: 'Camp & Offline Vault', icon: HardDrive, tag: 'Storage & Alerts' },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard, tag: 'Navigation' },
];

export default function SettingsModal() {
  const {
    isSettingsOpen,
    closeSettings,
    activeTab,
    setActiveTab,
    resetToDefaults,
    hasCustomSettings,
    preferences,
  } = usePreferences();
  const { isRtl } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap body scroll when modal is open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSettingsOpen]);

  // Numerical hotkeys (1-6) to jump between tabs when modal is active
  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= CATEGORIES.length) {
        e.preventDefault();
        setActiveTab(CATEGORIES[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setActiveTab]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSettings();
    }
  };

  const filteredCategories = searchQuery.trim()
    ? CATEGORIES.filter(
        (c) =>
          c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CATEGORIES;

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return <AppearanceTab />;
      case 'typography':
        return <TypographyTab />;
      case 'audio':
        return <AudioHapticsTab />;
      case 'motion':
        return <MotionPerfTab />;
      case 'camp':
        return <CampOfflineTab />;
      case 'shortcuts':
        return <ShortcutsTab />;
      default:
        return <AppearanceTab />;
    }
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preferences-modal-title"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/65 backdrop-blur-md transition-opacity duration-300"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* DESKTOP & MOBILE WRAPPER */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[85vh] h-[92vh] md:h-auto rounded-t-3xl md:rounded-3xl glass-panel bg-white/95 dark:bg-[#0c121e]/95 border border-brand-gold/30 shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
          >
            {/* Ambient Background Glow Highlights */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />

            {/* Mobile Sheet Drag Handle */}
            <div className="md:hidden flex items-center justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-neutral-300 dark:bg-white/20" />
            </div>

            {/* TOP HEADER BAR */}
            <header className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-neutral-200/60 dark:border-white/10 shrink-0 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold shadow-sm">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="preferences-modal-title"
                      className="font-clash font-bold text-base md:text-lg text-brand-navy dark:text-white leading-tight"
                    >
                      Global Preferences Hub
                    </h2>
                    {hasCustomSettings && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold">
                        Customized
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Personalize your UFUQ ’26 digital experience
                  </p>
                </div>
              </div>

              {/* Actions: Reset & Close Button */}
              <div className="flex items-center gap-2">
                {hasCustomSettings && (
                  <button
                    onClick={resetToDefaults}
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-red-500 hover:bg-red-500/10 border border-neutral-200/50 dark:border-white/10 transition-colors"
                    title="Reset to factory defaults"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  onClick={closeSettings}
                  type="button"
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Close preferences dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* MOBILE HORIZONTAL CATEGORY PILLS */}
            <div className="md:hidden flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto border-b border-neutral-200/60 dark:border-white/10 scrollbar-none shrink-0 bg-black/5 dark:bg-white/5">
              {CATEGORIES.map((cat) => {
                const isSelected = activeTab === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-brand-gold text-brand-navy shadow-sm'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* MAIN CONTENT SPLIT VIEW */}
            <div className="flex-1 flex overflow-hidden">
              {/* DESKTOP CATEGORY SIDEBAR */}
              <aside className="hidden md:flex flex-col w-64 border-r border-neutral-200/60 dark:border-white/10 p-4 shrink-0 overflow-y-auto">
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search settings..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <nav className="space-y-1">
                  {filteredCategories.map((cat, idx) => {
                    const isSelected = activeTab === cat.id;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        type="button"
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left rtl:text-right transition-all group ${
                          isSelected
                            ? 'bg-brand-gold/15 text-brand-navy dark:text-white font-bold border border-brand-gold/30 shadow-sm'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`w-4 h-4 ${
                              isSelected ? 'text-brand-gold' : 'text-neutral-400'
                            }`}
                          />
                          <span className="text-xs">{cat.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 opacity-60">
                          {idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </nav>

                {/* Desktop Sidebar Live Preview Stage */}
                <div className="mt-auto pt-4 border-t border-neutral-200/60 dark:border-white/10">
                  <SettingsPreviewStage />
                </div>
              </aside>

              {/* TAB CONTENT ACTIVE AREA */}
              <main className="flex-1 p-5 md:p-7 overflow-y-auto">
                {renderActiveTabContent()}
              </main>
            </div>

            {/* FOOTER BAR */}
            <footer className="flex items-center justify-between px-5 md:px-7 py-3 border-t border-neutral-200/60 dark:border-white/10 text-xs text-neutral-500 dark:text-neutral-400 bg-black/5 dark:bg-white/5 shrink-0">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  {preferences.language.toUpperCase()} · {preferences.theme} · {preferences.fontSize.toUpperCase()} text · SFX {preferences.uiSoundsEnabled ? 'On' : 'Off'}
                </span>
              </div>
              <span className="hidden sm:inline text-[11px] font-mono text-neutral-400">
                Press <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">Esc</kbd> to exit
              </span>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
