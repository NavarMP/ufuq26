'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar, { AdminTab } from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminCommandPalette from './AdminCommandPalette';
import { User } from 'firebase/auth';
import { ScheduleSession, Guest, FAQ, SuffaDars, Registration } from '@/types';

interface AdminShellProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
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
  children: React.ReactNode;

  // Command palette hooks
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

export default function AdminShell({
  activeTab,
  setActiveTab,
  user,
  onSignOut,
  counts,
  children,
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
}: AdminShellProps) {
  // Sidebar collapsed state: default expanded (false) as requested
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Restore preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ufuq_admin_sidebar_collapsed');
      if (saved !== null) {
        setIsCollapsed(saved === 'true');
      }
    }
  }, []);

  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ufuq_admin_sidebar_collapsed', String(collapsed));
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }

      // [ or Cmd+B to toggle sidebar on desktop
      if (
        (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b')
      ) {
        e.preventDefault();
        handleSetCollapsed(!isCollapsed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCollapsed]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Collapsible Ergonomic Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSetCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
        onSignOut={onSignOut}
        counts={counts}
      />

      {/* Main Content Area */}
      <div
        className={`min-h-screen flex flex-col transition-[margin-left] duration-300 ease-in-out ${
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          user={user}
          onSignOut={onSignOut}
        />

        {/* Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenSessionModal={onOpenSessionModal}
        onOpenGuestModal={onOpenGuestModal}
        onOpenFaqModal={onOpenFaqModal}
        onOpenDarsModal={onOpenDarsModal}
        onExportCsv={onExportCsv}
        sessions={sessions}
        guests={guests}
        faqs={faqs}
        darsList={darsList}
        registrations={registrations}
      />
    </div>
  );
}
