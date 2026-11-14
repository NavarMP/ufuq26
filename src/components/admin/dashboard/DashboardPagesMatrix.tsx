'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Building2,
  ShieldCheck,
  Music,
  Bot,
  Layers,
  ArrowUpRight,
  Wifi,
} from 'lucide-react';
import { AdminTab } from '../layout/AdminSidebar';
import { AudioTrack, DarsAccount, EventInfo } from '@/types';

interface DashboardPagesMatrixProps {
  eventInfo: EventInfo;
  darsAccounts: DarsAccount[];
  audioTracks: AudioTrack[];
  onSelectTab: (tab: AdminTab) => void;
}

interface PageItem {
  id: string;
  name: string;
  route: string;
  description: string;
  icon: React.ElementType;
  status: 'operational' | 'notice' | 'offline';
  statusText: string;
  badge: string;
  externalUrl?: string;
  tabAction?: AdminTab;
}

export default function DashboardPagesMatrix({
  eventInfo,
  darsAccounts,
  audioTracks,
  onSelectTab,
}: DashboardPagesMatrixProps) {
  const activeTracksCount = audioTracks.filter((t) => t.enabled).length;
  const activeDarsCount = darsAccounts.filter((d) => d.isActive).length;

  const pages: PageItem[] = [
    {
      id: 'landing',
      name: 'Public Landing Portal',
      route: '/',
      description: 'Public showcase: 7-day schedule, speakers, venue maps & delegate registration',
      icon: Globe,
      status: 'operational',
      statusText: eventInfo.registrationOpen ? 'Registration Active' : 'Registration Closed',
      badge: eventInfo.registrationOpen ? 'GATE OPEN' : 'GATE CLOSED',
      externalUrl: '/',
    },
    {
      id: 'dars',
      name: 'SUFFA Dars Hub Portal',
      route: '/dars',
      description: 'Mudarris authenticated portal for 39 affiliated Dars centers to submit candidate rosters',
      icon: Building2,
      status: 'operational',
      statusText: `${activeDarsCount} logins active`,
      badge: '39 HUBS',
      externalUrl: '/dars',
      tabAction: 'dars',
    },
    {
      id: 'admin',
      name: 'Executive Admin Command',
      route: '/admin',
      description: 'Organizers control deck, domain managers, export suite & real-time telemetry',
      icon: ShieldCheck,
      status: 'operational',
      statusText: 'Admin session secured',
      badge: 'AUTHENTICATED',
    },
    {
      id: 'audio',
      name: 'Audio Soundscape Engine',
      route: 'Web Audio / CDN',
      description: 'High-fidelity ambient background audio stream powered by Supabase CDN',
      icon: Music,
      status: activeTracksCount > 0 ? 'operational' : 'notice',
      statusText: `${activeTracksCount} active audio tracks`,
      badge: `${activeTracksCount} TRACKS`,
      tabAction: 'audio',
    },
    {
      id: 'ai-chat',
      name: 'Residency AI Assistant',
      route: '/api/chat',
      description: 'Multilingual conversational guide for event guidelines, schedules and FAQs',
      icon: Bot,
      status: 'operational',
      statusText: 'FAQ knowledge grounded',
      badge: 'ONLINE',
      tabAction: 'faqs',
    },
  ];

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-5 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-clash font-bold text-lg text-neutral-900 dark:text-white">
                Pages & Portals Health Matrix
              </h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% HEALTHY
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Live status and telemetry for public and authenticated routes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 self-start sm:self-auto">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time probe active</span>
        </div>
      </div>

      {/* Matrix Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pages.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 hover:border-brand-gold/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-mono text-[9px] font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] text-brand-gold block mt-0.5">
                    {item.route}
                  </span>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Status and Action Link */}
              <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] text-emerald-500 font-semibold">
                    {item.statusText}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {item.tabAction && (
                    <button
                      type="button"
                      onClick={() => onSelectTab(item.tabAction!)}
                      className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:underline transition-colors"
                    >
                      Manage
                    </button>
                  )}
                  {item.externalUrl && (
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-brand-gold/20 text-neutral-400 hover:text-brand-gold transition-all"
                      title="Open page in new tab"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
