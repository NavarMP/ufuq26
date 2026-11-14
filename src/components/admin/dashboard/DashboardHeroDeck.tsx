'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Clock,
  Radio,
  Database,
  Cloud,
  Printer,
  Music,
} from 'lucide-react';
import { EventInfo, AudioTrack } from '@/types';
import { AdminTab } from '../layout/AdminSidebar';
import { User } from 'firebase/auth';

interface DashboardHeroDeckProps {
  user: User | null;
  eventInfo: EventInfo;
  audioTracks: AudioTrack[];
  onOpenReportModal: () => void;
  onExportCsv: () => void;
  onSelectTab: (tab: AdminTab) => void;
  onToggleRegistration: () => Promise<void>;
  isTogglingRegistration?: boolean;
}

export default function DashboardHeroDeck({
  user,
  eventInfo,
  audioTracks,
  onOpenReportModal,
  onExportCsv,
  onSelectTab,
  onToggleRegistration,
  isTogglingRegistration = false,
}: DashboardHeroDeckProps) {
  // Live Countdown to Dec 24, 2026 09:00 IST
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-12-24T09:00:00+05:30').getTime();

    const calculateCountdown = () => {
      const now = Date.now();
      const difference = Math.max(0, targetDate - now);

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time of day greeting
  const [greeting, setGreeting] = useState('Welcome back');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const defaultTrack = audioTracks.find((t) => t.isDefault) || audioTracks[0];

  return (
    <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl glass-panel bg-gradient-to-br from-brand-navy via-[#141d30] to-brand-navy border border-brand-gold/30 shadow-2xl text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Organizer Brief & Countdown */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-[11px] font-mono font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
              <span>EXECUTIVE CONTROL CENTER</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              ADSA Live Portal
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="font-clash text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {greeting}, {user?.displayName || 'Organizer'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              UFUQ ’26 — 7-Day Residency Camp &amp; SUFFA Dars Leadership Portal. Real-time institutional telemetry, delegate admissions, and event governance.
            </p>
          </div>

          {/* Live Countdown Clock */}
          <div className="pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[10px] font-mono uppercase text-brand-gold tracking-widest font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Residency Starts:</span>
            </span>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <div className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="font-bold text-brand-gold">{timeLeft.days}</span>
                <span className="text-[9px] text-neutral-400 ml-1">DAYS</span>
              </div>
              <span className="text-neutral-500 font-bold">:</span>
              <div className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 ml-1">HRS</span>
              </div>
              <span className="text-neutral-500 font-bold">:</span>
              <div className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="font-bold text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 ml-1">MIN</span>
              </div>
              <span className="text-neutral-500 font-bold">:</span>
              <div className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="font-bold text-brand-gold-light">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 ml-1">SEC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons & Report Trigger */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-xs shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 group"
              title="Generate printable executive summary report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Executive Report</span>
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="px-3.5 py-2.5 rounded-2xl glass-panel bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
              title="Export all delegate registrations as CSV"
            >
              <Download className="w-3.5 h-3.5 text-brand-gold" />
              <span className="hidden sm:inline">Export</span>
              <span>CSV</span>
            </button>
          </div>

          {/* Registration Gate Live Toggle */}
          <button
            type="button"
            onClick={onToggleRegistration}
            disabled={isTogglingRegistration}
            className={`w-full px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 transition-all ${
              eventInfo.registrationOpen
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
            }`}
            title="Click to toggle public registration portal status"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  eventInfo.registrationOpen
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
              />
              <span className="text-[11px] font-mono">
                INTAKE: {eventInfo.registrationOpen ? 'OPEN (ACCEPTING)' : 'CLOSED'}
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 hover:text-white underline">
              Toggle
            </span>
          </button>
        </div>
      </div>

      {/* System Telemetry Bar */}
      <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-gold shrink-0" />
          <div className="truncate">
            <span className="text-neutral-400 block text-[10px]">FIRESTORE SYNC</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-time Active</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-brand-teal dark:text-emerald-400 shrink-0" />
          <div className="truncate">
            <span className="text-neutral-400 block text-[10px]">SUPABASE CDN</span>
            <span className="text-white font-bold truncate">ufuq-media Cloud</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-brand-gold shrink-0" />
          <div className="truncate">
            <span className="text-neutral-400 block text-[10px]">CAMP DATES</span>
            <span className="text-brand-gold font-bold">Dec 24 – 30, 2026</span>
          </div>
        </div>

        <div
          onClick={() => onSelectTab('audio')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Click to manage audio playlist"
        >
          <Music className="w-4 h-4 text-brand-gold shrink-0 group-hover:scale-110 transition-transform" />
          <div className="truncate">
            <span className="text-neutral-400 block text-[10px]">SOUNDSCAPE STREAM</span>
            <span className="text-neutral-200 font-bold truncate group-hover:text-brand-gold">
              {defaultTrack?.title || 'UFUQ Ambient'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
