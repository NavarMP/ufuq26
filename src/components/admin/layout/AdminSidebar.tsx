'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  FileText,
  Building2,
  Calendar,
  Users,
  HelpCircle,
  Music,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  DoorOpen,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type AdminTab =
  | 'dashboard'
  | 'registrations'
  | 'dars'
  | 'gate'
  | 'sessions'
  | 'guests'
  | 'faqs'
  | 'audio'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  user: User | null;
  onSignOut: () => void;
  counts: {
    registrations: number;
    darsAccounts: number;
    schedule: number;
    guests: number;
    faqs: number;
    audioTracks: number;
  };
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  user,
  onSignOut,
  counts,
}: AdminSidebarProps) {
  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: Shield,
        },
      ],
    },
    {
      title: 'Delegates & Institutions',
      items: [
        {
          id: 'registrations',
          label: 'Registrations',
          icon: FileText,
          count: counts.registrations,
        },
        {
          id: 'dars',
          label: 'SUFFA Dars & Logins',
          icon: Building2,
          count: counts.darsAccounts,
        },
        {
          id: 'gate',
          label: 'Gate & Attendance',
          icon: DoorOpen,
          badge: 'LIVE',
        },
      ],
    },
    {
      title: 'Event Curation',
      items: [
        {
          id: 'sessions',
          label: 'Schedule Matrix',
          icon: Calendar,
          count: counts.schedule,
        },
        {
          id: 'guests',
          label: 'Faculty & Speakers',
          icon: Users,
          count: counts.guests,
        },
        {
          id: 'faqs',
          label: 'Knowledge & FAQs',
          icon: HelpCircle,
          count: counts.faqs,
        },
      ],
    },
    {
      title: 'Platform & Media',
      items: [
        {
          id: 'audio',
          label: 'Background Music',
          icon: Music,
          count: counts.audioTracks,
        },
        {
          id: 'settings',
          label: 'Event Settings',
          icon: Settings,
        },
      ],
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  // Nav item renderer
  const renderNavButton = (item: NavItem, collapsed: boolean) => {
    const isActive = activeTab === item.id;
    const Icon = item.icon;

    return (
      <div key={item.id} className="relative group">
        <button
          type="button"
          onClick={() => handleSelectTab(item.id)}
          className={`w-full relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 outline-none ${
            isActive
              ? 'text-brand-navy dark:text-neutral-900 font-bold'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
          } ${collapsed ? 'justify-center px-0' : ''}`}
        >
          {/* Active Liquid Pill indicator */}
          {isActive && (
            <motion.div
              layoutId="admin-active-tab-highlight"
              className="absolute inset-0 bg-brand-gold rounded-2xl shadow-md -z-10"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <Icon
            className={`w-4 h-4 shrink-0 transition-transform ${
              isActive ? 'scale-110 text-brand-navy' : 'text-current'
            }`}
          />

          {!collapsed && (
            <div className="flex-1 flex items-center justify-between text-left truncate">
              <span className="truncate">{item.label}</span>
              {typeof item.count === 'number' && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-black/15 text-brand-navy'
                      : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-400 group-hover:bg-brand-gold/20 group-hover:text-brand-gold'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </div>
          )}
        </button>

        {/* Floating Tooltip in Collapsed Rail Mode */}
        {collapsed && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="px-3 py-1.5 rounded-xl glass-panel bg-white/95 dark:bg-[#0f1624]/95 border border-brand-gold/30 shadow-xl text-xs font-semibold whitespace-nowrap text-neutral-900 dark:text-white flex items-center gap-2">
              <span>{item.label}</span>
              {typeof item.count === 'number' && (
                <span className="px-1.5 py-0.5 rounded-md bg-brand-gold/20 text-brand-gold text-[10px] font-mono">
                  {item.count}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (collapsed: boolean, onMobile = false) => (
    <div className="h-full flex flex-col justify-between p-4 overflow-hidden">
      {/* Top Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 px-1">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            title="Go to UFUQ '26 Live Public Site"
          >
            <div className="w-10 h-10 rounded-2xl bg-brand-navy p-1.5 flex items-center justify-center shrink-0 border border-brand-gold/30 shadow-md group-hover:border-brand-gold transition-colors">
              <Image
                src="/images/UFUQ-Logo.svg"
                alt="UFUQ '26"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            {(!collapsed || onMobile) && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-clash font-bold text-sm text-neutral-900 dark:text-white truncate">
                    UFUQ ’26
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-bold">
                    ADSA
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  Organizer Portal
                </span>
              </div>
            )}
          </Link>

          {onMobile && (
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar pr-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {(!collapsed || onMobile) && (
                <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                  {section.title}
                </div>
              )}
              {collapsed && !onMobile && (
                <div className="w-4 h-0.5 bg-brand-gold/20 mx-auto my-2 rounded-full" />
              )}
              <div className="space-y-1">
                {section.items.map((item) => renderNavButton(item, collapsed && !onMobile))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Card & Collapse Toggle */}
      <div className="pt-4 border-t border-brand-gold/15 space-y-3">
        {/* User Card */}
        {(!collapsed || onMobile) ? (
          <div className="p-3 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/20 text-brand-gold font-clash font-bold flex items-center justify-center shrink-0 border border-brand-gold/30 text-xs">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {user?.displayName || 'Organizer'}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono truncate">
                  {user?.email || 'admin@alathurpadidars.in'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="p-1.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors shrink-0"
              title="Sign out of admin session"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-center p-2 rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Collapse / Expand Toggle Button */}
        {!onMobile && (
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs font-mono"
            title={isCollapsed ? 'Expand sidebar (Press [)' : 'Collapse sidebar (Press [)'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Rail</span>
                <kbd className="ml-auto px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-mono text-neutral-400">
                  [
                </kbd>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-[width] duration-300 ease-in-out glass-panel bg-white/80 dark:bg-[#0c1220]/80 border-r border-brand-gold/20 shadow-xl ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Slide-Over Sheet Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Slide-in Sheet */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-72 max-w-[85vw] h-full glass-panel bg-white/95 dark:bg-[#0c1220]/95 border-r border-brand-gold/30 shadow-2xl z-10"
            >
              {sidebarContent(false, true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
