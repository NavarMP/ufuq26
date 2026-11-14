'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  FileText,
  Building2,
  Music,
  ArrowRight,
  Search,
} from 'lucide-react';
import { Registration, DarsAccount, AudioTrack } from '@/types';
import { AdminTab } from '../layout/AdminSidebar';
import StatusBadge from '../shared/StatusBadge';

interface DashboardLiveActivityFeedProps {
  registrations: Registration[];
  darsAccounts: DarsAccount[];
  audioTracks: AudioTrack[];
  onSelectTab: (tab: AdminTab) => void;
}

type ActivityCategory = 'all' | 'registrations' | 'dars' | 'media';

interface FeedEvent {
  id: string;
  type: 'registration' | 'dars' | 'media';
  title: string;
  subtitle: string;
  timestamp: string;
  dateObj: Date;
  status?: string;
  badge: string;
  targetTab: AdminTab;
}

// Format relative time helper
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) return 'Just now';
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function DashboardLiveActivityFeed({
  registrations,
  darsAccounts,
  audioTracks,
  onSelectTab,
}: DashboardLiveActivityFeedProps) {
  const [filter, setFilter] = useState<ActivityCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Synthesize events stream
  const events = useMemo<FeedEvent[]>(() => {
    const list: FeedEvent[] = [];

    // Add registrations
    registrations.forEach((r) => {
      const date = new Date(r.submittedAt);
      list.push({
        id: `reg-${r.id}`,
        type: 'registration',
        title: r.fullName,
        subtitle: `${r.darsName || r.darsRegNo || 'Direct Public Applicant'} • Ref: ${r.id}`,
        timestamp: r.submittedAt,
        dateObj: isNaN(date.getTime()) ? new Date() : date,
        status: r.status,
        badge: r.status === 'confirmed' ? 'Confirmed Delegate' : 'Application Received',
        targetTab: 'registrations',
      });
    });

    // Add Dars account activity
    darsAccounts.forEach((d) => {
      const time = d.lastLoginAt || d.updatedAt || d.createdAt;
      const date = new Date(time);
      list.push({
        id: `dars-${d.id}`,
        type: 'dars',
        title: d.darsNameEn,
        subtitle: `Usthad ${d.mudarris} • Reg No: ${d.regNo} (${d.isActive ? 'Active Pass' : 'Locked'})`,
        timestamp: time,
        dateObj: isNaN(date.getTime()) ? new Date() : date,
        badge: d.lastLoginAt ? 'Mudarris Login' : 'Hub Seeded',
        targetTab: 'dars',
      });
    });

    // Add Audio activity
    audioTracks.forEach((t) => {
      const time = t.uploadedAt || new Date().toISOString();
      const date = new Date(time);
      list.push({
        id: `audio-${t.id}`,
        type: 'media',
        title: t.title,
        subtitle: `${t.artist || 'ADSA Media Wing'} • Soundscape ${t.enabled ? 'Live' : 'Muted'}`,
        timestamp: time,
        dateObj: isNaN(date.getTime()) ? new Date() : date,
        badge: 'Audio Asset',
        targetTab: 'audio',
      });
    });

    // Sort chronologically descending
    return list.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [registrations, darsAccounts, audioTracks]);

  // Filter and search
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (filter === 'registrations' && e.type !== 'registration') return false;
      if (filter === 'dars' && e.type !== 'dars') return false;
      if (filter === 'media' && e.type !== 'media') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.subtitle.toLowerCase().includes(q) ||
          e.badge.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, filter, searchQuery]);

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-clash font-bold text-lg text-neutral-900 dark:text-white">
                Live Residency Activity Feed
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-mono text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Chronological log of delegate submissions, institutional logins, and media updates
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity stream..."
            className="w-full pl-9 pr-3 py-2 rounded-xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-brand-gold text-brand-navy shadow-sm'
              : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('registrations')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            filter === 'registrations'
              ? 'bg-brand-gold text-brand-navy shadow-sm'
              : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Registrations ({registrations.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('dars')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            filter === 'dars'
              ? 'bg-brand-gold text-brand-navy shadow-sm'
              : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Dars Hubs ({darsAccounts.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('media')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
            filter === 'media'
              ? 'bg-brand-gold text-brand-navy shadow-sm'
              : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Media & Audio ({audioTracks.length})
        </button>
      </div>

      {/* Event Items List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-2xl">
            No activity events found matching your filter.
          </div>
        ) : (
          filteredEvents.slice(0, 15).map((evt, index) => {
            const isReg = evt.type === 'registration';
            const isDars = evt.type === 'dars';

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="p-3.5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 hover:border-brand-gold/40 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isReg
                        ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                        : isDars
                        ? 'bg-brand-gold/15 text-brand-gold border-brand-gold/30'
                        : 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                    }`}
                  >
                    {isReg ? (
                      <FileText className="w-4 h-4" />
                    ) : isDars ? (
                      <Building2 className="w-4 h-4" />
                    ) : (
                      <Music className="w-4 h-4" />
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        {evt.title}
                      </h4>
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 text-[10px] font-mono text-neutral-400 shrink-0">
                        {evt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {evt.subtitle}
                    </p>
                  </div>
                </div>

                {/* Relative Timestamp & Inspect Button */}
                <div className="flex items-center gap-3 shrink-0">
                  {evt.status && (
                    <div className="hidden sm:block">
                      <StatusBadge status={evt.status} />
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-neutral-400 block">
                      {formatRelativeTime(evt.dateObj)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectTab(evt.targetTab)}
                    className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-gold hover:text-brand-navy text-neutral-400 transition-all"
                    title={`Inspect in ${evt.targetTab}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-brand-gold/15 flex items-center justify-between text-xs">
        <span className="text-neutral-400 font-mono text-[11px]">
          Showing latest events • Stream auto-refreshes on incoming database updates
        </span>
        <button
          type="button"
          onClick={() => onSelectTab('registrations')}
          className="text-brand-gold hover:underline font-bold flex items-center gap-1"
        >
          <span>View All Applications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
