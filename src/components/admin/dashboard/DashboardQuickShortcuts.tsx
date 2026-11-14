'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Calendar,
  Users,
  Building2,
  Music,
  Download,
  HelpCircle,
  Settings,
  Globe,
} from 'lucide-react';
import { AdminTab } from '../layout/AdminSidebar';

interface DashboardQuickShortcutsProps {
  onSelectTab: (tab: AdminTab) => void;
  onOpenSessionModal: () => void;
  onOpenGuestModal: () => void;
  onExportRegistrationsCsv: () => void;
}

export default function DashboardQuickShortcuts({
  onSelectTab,
  onOpenSessionModal,
  onOpenGuestModal,
  onExportRegistrationsCsv,
}: DashboardQuickShortcutsProps) {
  const creationActions = [
    {
      label: 'Add Session',
      subtext: '7-Day timetable itinerary',
      icon: Calendar,
      color: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
      action: () => {
        onSelectTab('sessions');
        onOpenSessionModal();
      },
    },
    {
      label: 'Add Speaker',
      subtext: 'Scholars & dignitaries',
      icon: Users,
      color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      action: () => {
        onSelectTab('guests');
        onOpenGuestModal();
      },
    },
    {
      label: 'Add Dars Hub',
      subtext: 'Seed affiliate institution',
      icon: Building2,
      color: 'bg-brand-teal/15 text-brand-teal dark:text-cyan-400 border-brand-teal/30',
      action: () => onSelectTab('dars'),
    },
    {
      label: 'Add FAQ Entry',
      subtext: 'Knowledge base & AI',
      icon: HelpCircle,
      color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      action: () => onSelectTab('faqs'),
    },
  ];

  const operationalActions = [
    {
      label: 'Export Registrations',
      subtext: 'Download delegate CSV',
      icon: Download,
      action: onExportRegistrationsCsv,
    },
    {
      label: 'Soundscape Studio',
      subtext: 'Manage MP3 background tracks',
      icon: Music,
      action: () => onSelectTab('audio'),
    },
    {
      label: 'Residency Settings',
      subtext: 'Dates, venue, registration gate',
      icon: Settings,
      action: () => onSelectTab('settings'),
    },
    {
      label: 'Public Website',
      subtext: 'Preview landing page (/)',
      icon: Globe,
      action: () => window.open('/', '_blank'),
    },
  ];

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-clash font-bold text-lg text-neutral-900 dark:text-white">
              Executive Speed-Dial Deck
            </h3>
            <p className="text-xs text-neutral-500">
              One-click creators and operational fast shortcuts
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">⌘K</kbd> for command palette
        </span>
      </div>

      {/* Creation Fast Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
          Entity Creation Fast-Actions
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {creationActions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={item.action}
                className="p-4 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold/10 text-left transition-all group flex flex-col justify-between"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-3 group-hover:scale-110 transition-transform ${item.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-clash font-bold text-sm text-neutral-900 dark:text-white group-hover:text-brand-gold transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {item.subtext}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Secondary Operational Fast Buttons */}
      <div className="space-y-2 pt-2 border-t border-brand-gold/15">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
          Operational & Data Pipelines
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {operationalActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="p-3 rounded-xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/10 hover:border-brand-gold/30 hover:bg-black/10 dark:hover:bg-white/10 text-left transition-all flex items-center gap-2.5 group"
              >
                <Icon className="w-4 h-4 text-neutral-400 group-hover:text-brand-gold transition-colors shrink-0" />
                <div className="min-w-0">
                  <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate block">
                    {item.subtext}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
