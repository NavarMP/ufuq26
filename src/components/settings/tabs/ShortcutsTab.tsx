'use client';

import React from 'react';
import { Command, Keyboard, Sparkles } from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';

export default function ShortcutsTab() {
  const shortcuts: { keys: string[]; description: string; category: string }[] = [
    { keys: ['⌘', ','], description: 'Open / Close Global Preferences', category: 'Navigation' },
    { keys: ['⌘', 'K'], description: 'Open Global Camp Search', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close any active modal or drawer', category: 'Navigation' },
    { keys: ['Space'], description: 'Play / Pause Ambient Soundscape', category: 'Audio' },
    { keys: ['M'], description: 'Toggle Global Sound Mute', category: 'Audio' },
    { keys: ['1'], description: 'Jump to Appearance & Theming Tab', category: 'Preferences' },
    { keys: ['2'], description: 'Jump to Typography & Language Tab', category: 'Preferences' },
    { keys: ['3'], description: 'Jump to Audio & Haptics Tab', category: 'Preferences' },
    { keys: ['4'], description: 'Jump to Motion & Performance Tab', category: 'Preferences' },
    { keys: ['5'], description: 'Jump to Camp Timetable & Cache Tab', category: 'Preferences' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-gold/10 border border-brand-gold/25">
        <Keyboard className="w-4 h-4 text-brand-gold shrink-0" />
        <p className="text-xs text-neutral-700 dark:text-neutral-300">
          UFUQ ’26 is equipped with universal keyboard navigation. On Windows and Linux, replace <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">⌘</kbd> with <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[10px]">Ctrl</kbd>.
        </p>
      </div>

      <div className="space-y-2">
        {shortcuts.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-neutral-200/50 dark:border-white/10 hover:border-brand-gold/40 transition-colors"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {item.description}
              </span>
              <span className="block text-[10px] text-neutral-500 dark:text-neutral-400">
                {item.category}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {item.keys.map((k, kIdx) => (
                <kbd
                  key={kIdx}
                  className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-white dark:bg-black/40 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-white/20 shadow-sm"
                >
                  {k}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
