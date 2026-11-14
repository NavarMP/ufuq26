'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Theme } from '@/types';
import { Sun, Moon, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminThemeSwitcherProps {
  variant?: 'segmented' | 'dropdown' | 'icon-only';
  className?: string;
  showLabels?: boolean;
}

export default function AdminThemeSwitcher({
  variant = 'segmented',
  className = '',
  showLabels = true,
}: AdminThemeSwitcherProps) {
  const { theme, setTheme } = useApp();

  const options: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  if (variant === 'icon-only') {
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

    return (
      <button
        type="button"
        onClick={() => setTheme(nextTheme)}
        className={`p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative group ${className}`}
        title={`Current theme: ${theme}. Click to switch.`}
        aria-label={`Current theme: ${theme}. Click to switch.`}
      >
        {theme === 'dark' ? (
          <Moon className="w-4 h-4 text-brand-gold" />
        ) : theme === 'light' ? (
          <Sun className="w-4 h-4 text-amber-500" />
        ) : (
          <Laptop className="w-4 h-4 text-brand-teal dark:text-neutral-300" />
        )}
      </button>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`inline-flex items-center p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 backdrop-blur-md ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        const Icon = opt.icon;

        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.id)}
            className={`relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 z-10 ${
              isActive
                ? 'text-brand-navy font-bold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title={`Switch to ${opt.label} mode`}
          >
            {isActive && (
              <motion.span
                layoutId="admin-active-theme-pill"
                className="absolute inset-0 bg-brand-gold rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}
            <Icon
              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                isActive ? 'scale-110 text-brand-navy' : 'text-current'
              }`}
            />
            {showLabels && <span className="text-[11px] font-mono tracking-tight">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
