'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Calendar,
  Users,
  Building2,
  FileText,
  HelpCircle,
  Music,
  Settings,
  Plus,
  Download,
  Moon,
  Sun,
  Laptop,
  ArrowRight,
  Sparkles,
  Shield,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';
import { ScheduleSession, Guest, FAQ, SuffaDars, Registration } from '@/types';
import { useApp } from '@/context/AppContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: AdminTab) => void;
  onOpenSessionModal?: () => void;
  onOpenGuestModal?: () => void;
  onOpenFaqModal?: () => void;
  onOpenDarsModal?: () => void;
  onExportCsv?: () => void;
  sessions?: ScheduleSession[];
  guests?: Guest[];
  faqs?: FAQ[];
  darsList?: SuffaDars[];
  registrations?: Registration[];
}

interface PaletteAction {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Actions' | 'Sessions' | 'Speakers' | 'Institutions' | 'Theme';
  icon: React.ComponentType<{ className?: string }>;
  handler: () => void;
}

export default function AdminCommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onOpenSessionModal,
  onOpenGuestModal,
  onOpenFaqModal,
  onOpenDarsModal,
  onExportCsv,
  sessions = [],
  guests = [],
  faqs = [],
  darsList = [],
  registrations = [],
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme } = useApp();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const actions = useMemo<PaletteAction[]>(() => {
    const list: PaletteAction[] = [
      // Navigation
      {
        id: 'nav-dashboard',
        title: 'Go to Dashboard',
        subtitle: 'Executive KPIs and live pulse',
        category: 'Navigation',
        icon: Shield,
        handler: () => onSelectTab('dashboard'),
      },
      {
        id: 'nav-registrations',
        title: 'Go to Registrations',
        subtitle: `Manage ${registrations.length} delegate applications`,
        category: 'Navigation',
        icon: FileText,
        handler: () => onSelectTab('registrations'),
      },
      {
        id: 'nav-dars',
        title: 'Go to SUFFA Dars & Logins',
        subtitle: '39 Institutional centers and student portal logins',
        category: 'Navigation',
        icon: Building2,
        handler: () => onSelectTab('dars'),
      },
      {
        id: 'nav-schedule',
        title: 'Go to Schedule Matrix',
        subtitle: `7-Day residency timetable (${sessions.length} sessions)`,
        category: 'Navigation',
        icon: Calendar,
        handler: () => onSelectTab('sessions'),
      },
      {
        id: 'nav-speakers',
        title: 'Go to Faculty & Speakers',
        subtitle: `Scholars, keynote speakers, patrons (${guests.length})`,
        category: 'Navigation',
        icon: Users,
        handler: () => onSelectTab('guests'),
      },
      {
        id: 'nav-faqs',
        title: 'Go to FAQs',
        subtitle: `Multilingual knowledge base (${faqs.length} entries)`,
        category: 'Navigation',
        icon: HelpCircle,
        handler: () => onSelectTab('faqs'),
      },
      {
        id: 'nav-gallery',
        title: 'Go to Gallery Showcase',
        subtitle: 'Curate photos, video reels, and historical moments',
        category: 'Navigation',
        icon: ImageIcon,
        handler: () => onSelectTab('gallery'),
      },
      {
        id: 'nav-audio',
        title: 'Go to Background Music',
        subtitle: 'Playlist studio and Supabase audio uploads',
        category: 'Navigation',
        icon: Music,
        handler: () => onSelectTab('audio'),
      },
      {
        id: 'nav-settings',
        title: 'Go to Event Settings',
        subtitle: 'Registration status, dates, and venue settings',
        category: 'Navigation',
        icon: Settings,
        handler: () => onSelectTab('settings'),
      },

      // Quick Actions
      {
        id: 'action-add-session',
        title: 'Add New Schedule Session',
        subtitle: 'Create a timetable session for Days 1-7',
        category: 'Actions',
        icon: Plus,
        handler: () => {
          onSelectTab('sessions');
          onOpenSessionModal?.();
        },
      },
      {
        id: 'action-add-speaker',
        title: 'Add Guest Speaker',
        subtitle: 'Upload photo and profile for a new dignitary',
        category: 'Actions',
        icon: Plus,
        handler: () => {
          onSelectTab('guests');
          onOpenGuestModal?.();
        },
      },
      {
        id: 'action-add-faq',
        title: 'Add New FAQ',
        subtitle: 'Add multilingual question and response',
        category: 'Actions',
        icon: Plus,
        handler: () => {
          onSelectTab('faqs');
          onOpenFaqModal?.();
        },
      },
      {
        id: 'action-add-dars',
        title: 'Add SUFFA Dars Center',
        subtitle: 'Register new institution in SUFFA network',
        category: 'Actions',
        icon: Plus,
        handler: () => {
          onSelectTab('dars');
          onOpenDarsModal?.();
        },
      },
      {
        id: 'action-export-csv',
        title: 'Export Registrations (CSV)',
        subtitle: 'Download complete delegate roster spreadsheet',
        category: 'Actions',
        icon: Download,
        handler: () => {
          onExportCsv?.();
        },
      },

      // Theme options
      {
        id: 'theme-light',
        title: 'Switch to Light Theme',
        subtitle: 'Warm parchment and gold palette',
        category: 'Theme',
        icon: Sun,
        handler: () => setTheme('light'),
      },
      {
        id: 'theme-dark',
        title: 'Switch to Dark Theme',
        subtitle: 'Midnight obsidian glass palette',
        category: 'Theme',
        icon: Moon,
        handler: () => setTheme('dark'),
      },
      {
        id: 'theme-system',
        title: 'Synchronize Theme with System',
        subtitle: 'Follow OS automatic appearance',
        category: 'Theme',
        icon: Laptop,
        handler: () => setTheme('system'),
      },
    ];

    // Append sessions search
    sessions.slice(0, 15).forEach((s) => {
      list.push({
        id: `session-${s.id}`,
        title: s.title.en,
        subtitle: `Day ${s.day} • ${s.startTime} - ${s.endTime} • ${s.category || 'Session'}`,
        category: 'Sessions',
        icon: Calendar,
        handler: () => onSelectTab('sessions'),
      });
    });

    // Append speakers search
    guests.forEach((g) => {
      list.push({
        id: `guest-${g.id}`,
        title: g.name.en,
        subtitle: g.title?.en || 'Guest Speaker / Faculty',
        category: 'Speakers',
        icon: Users,
        handler: () => onSelectTab('guests'),
      });
    });

    // Append institutions search
    darsList.slice(0, 15).forEach((d) => {
      list.push({
        id: `dars-${d.id}`,
        title: `${d.regNo} — ${d.nameEn}`,
        subtitle: `${d.mudarris} • ${d.district || 'Kerala'}`,
        category: 'Institutions',
        icon: Building2,
        handler: () => onSelectTab('dars'),
      });
    });

    return list;
  }, [
    onSelectTab,
    onOpenSessionModal,
    onOpenGuestModal,
    onOpenFaqModal,
    onOpenDarsModal,
    onExportCsv,
    sessions,
    guests,
    faqs,
    darsList,
    registrations,
    setTheme,
  ]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) {
      return actions.slice(0, 14);
    }
    const q = query.toLowerCase().trim();
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q)
    );
  }, [query, actions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredActions.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].handler();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-2xl rounded-3xl glass-panel bg-white/95 dark:bg-[#0c1220]/95 border border-brand-gold/30 shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Input Header */}
            <div className="relative flex items-center px-5 py-4 border-b border-brand-gold/15">
              <Search className="w-5 h-5 text-brand-gold shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search anything or jump to section... (e.g. 'schedule', 'dars', 'add speaker')"
                className="w-full bg-transparent pl-3 pr-8 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {filteredActions.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No matching admin actions or records found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filteredActions.map((action, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => {
                        action.handler();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-brand-gold/15 border border-brand-gold/30 text-brand-navy dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-brand-gold text-brand-navy border-brand-gold'
                              : 'bg-black/5 dark:bg-white/10 text-neutral-500 border-transparent'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold truncate">{action.title}</div>
                          {action.subtitle && (
                            <div className="text-[11px] text-neutral-400 truncate">
                              {action.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-neutral-400">
                          {action.category}
                        </span>
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with keyboard hints */}
            <div className="px-5 py-2.5 border-t border-brand-gold/15 bg-black/5 dark:bg-white/5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]">
                    &uarr; &darr;
                  </kbd>{' '}
                  Navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]">
                    Enter
                  </kbd>{' '}
                  Select
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px]">
                    Esc
                  </kbd>{' '}
                  Close
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-brand-gold">
                <Sparkles className="w-3 h-3" />
                <span>ADSA QuickCommand</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
