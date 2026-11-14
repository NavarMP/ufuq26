'use client';

import React from 'react';
import { Registration } from '@/types';
import { CheckCircle2, Clock, XCircle, Archive, Users } from 'lucide-react';

export type SegmentTab = 'active' | 'confirmed' | 'pending' | 'cancelled' | 'archived';

interface RegistrationSegmentTabsProps {
  currentTab: SegmentTab;
  onTabChange: (tab: SegmentTab) => void;
  registrations: Registration[];
}

export default function RegistrationSegmentTabs({
  currentTab,
  onTabChange,
  registrations,
}: RegistrationSegmentTabsProps) {
  const activeCount = registrations.filter((r) => !r.isArchived).length;
  const confirmedCount = registrations.filter((r) => !r.isArchived && r.status === 'confirmed').length;
  const pendingCount = registrations.filter((r) => !r.isArchived && r.status === 'pending').length;
  const cancelledCount = registrations.filter((r) => !r.isArchived && r.status === 'cancelled').length;
  const archivedCount = registrations.filter((r) => r.isArchived).length;

  const tabs: {
    id: SegmentTab;
    label: string;
    count: number;
    icon: React.ElementType;
    badgeClass: string;
    activeClass: string;
  }[] = [
    {
      id: 'active',
      label: 'All Active',
      count: activeCount,
      icon: Users,
      badgeClass: 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-300',
      activeClass: 'bg-brand-gold text-brand-navy font-bold shadow-md',
    },
    {
      id: 'confirmed',
      label: 'Confirmed',
      count: confirmedCount,
      icon: CheckCircle2,
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      activeClass: 'bg-emerald-600 text-white font-bold shadow-md',
    },
    {
      id: 'pending',
      label: 'Pending',
      count: pendingCount,
      icon: Clock,
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      activeClass: 'bg-amber-500 text-white font-bold shadow-md',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: cancelledCount,
      icon: XCircle,
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      activeClass: 'bg-rose-600 text-white font-bold shadow-md',
    },
    {
      id: 'archived',
      label: 'Archived',
      count: archivedCount,
      icon: Archive,
      badgeClass: 'bg-neutral-500/15 text-neutral-500 dark:text-neutral-400',
      activeClass: 'bg-neutral-700 text-white font-bold shadow-md dark:bg-neutral-300 dark:text-neutral-900',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap shrink-0 ${
              isActive
                ? tab.activeClass
                : 'bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10 font-medium'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-bold ${
                isActive ? 'bg-black/20 dark:bg-white/25 text-inherit' : tab.badgeClass
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
