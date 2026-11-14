'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  ExternalLink,
  Shield,
  FileText,
  Building2,
  Calendar,
  Users,
  HelpCircle,
  Music,
  Settings,
  LogOut,
  DoorOpen,
  Image as ImageIcon,
  Bell,
} from 'lucide-react';
import AdminThemeSwitcher from './AdminThemeSwitcher';
import { AdminTab } from './AdminSidebar';
import { User } from 'firebase/auth';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  user: User | null;
  onSignOut: () => void;
}

const tabTitles: Record<AdminTab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  dashboard: { label: 'Executive Dashboard', icon: Shield },
  registrations: { label: 'Delegate Registrations', icon: FileText },
  notifications: { label: 'Dispatch & Notification Hub', icon: Bell },
  dars: { label: 'SUFFA Dars & Logins', icon: Building2 },
  gate: { label: 'Campus Gate & Check-in', icon: DoorOpen },
  sessions: { label: 'Schedule & Program Matrix', icon: Calendar },
  guests: { label: 'Faculty & Guest Speakers', icon: Users },
  faqs: { label: 'Knowledge Base & FAQs', icon: HelpCircle },
  gallery: { label: 'Gallery Showcase', icon: ImageIcon },
  audio: { label: 'Background Audio Studio', icon: Music },
  settings: { label: 'Event Configuration', icon: Settings },
};

export default function AdminHeader({
  activeTab,
  onOpenMobileSidebar,
  onOpenCommandPalette,
  user,
  onSignOut,
}: AdminHeaderProps) {
  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;
  const TabIcon = currentTabInfo.icon;

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-brand-gold/20 glass-panel bg-white/70 dark:bg-[#080c14]/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300">
      {/* Left: Mobile Menu Trigger + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb & Section Name */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30 shrink-0">
            <TabIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] font-mono text-neutral-400">
                UFUQ ’26
              </span>
              <span className="hidden sm:inline text-neutral-400 text-xs">/</span>
              <h1 className="font-clash font-bold text-sm sm:text-base text-neutral-900 dark:text-white tracking-tight">
                {currentTabInfo.label}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/20 hover:border-brand-gold/50 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-brand-gold transition-colors" />
            <span>Search anything in portal...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-black/10 dark:bg-white/10 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Theme Switcher & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="md:hidden p-2 rounded-xl text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Search"
          title="Search (Cmd+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Integrated Theme Switcher */}
        <AdminThemeSwitcher showLabels={false} className="hidden sm:inline-flex" />

        {/* Live Site Link */}
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/20 hover:border-brand-gold text-neutral-700 dark:text-neutral-200 hover:text-brand-gold transition-colors"
          title="Open live public website in new tab"
        >
          <span className="hidden sm:inline">Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
        </Link>

        {/* Organizer Email Pill */}
        {user?.email && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-xs text-neutral-700 dark:text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[11px] truncate max-w-[160px]">{user.email}</span>
          </div>
        )}

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors"
          title="Sign out of organizer session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
