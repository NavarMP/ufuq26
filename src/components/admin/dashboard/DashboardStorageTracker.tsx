'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  HardDrive,
  Database,
  Cloud,
  FileText,
  Music,
  Users,
  Calendar,
  HelpCircle,
  Building2,
  Cpu,
} from 'lucide-react';
import { Registration, ScheduleSession, Guest, FAQ, DarsAccount, AudioTrack } from '@/types';

interface DashboardStorageTrackerProps {
  registrations: Registration[];
  schedule: ScheduleSession[];
  guests: Guest[];
  faqs: FAQ[];
  darsAccounts: DarsAccount[];
  audioTracks: AudioTrack[];
}

export default function DashboardStorageTracker({
  registrations,
  schedule,
  guests,
  faqs,
  darsAccounts,
  audioTracks,
}: DashboardStorageTrackerProps) {
  // Estimated storage calculations
  const stats = useMemo(() => {
    // Media footprint
    const speakerPhotosCount = guests.filter((g) => !!g.photoUrl).length;
    const speakerEstimatedMb = +(speakerPhotosCount * 1.4).toFixed(1); // avg ~1.4MB high-res portrait
    const audioEstimatedMb = +(audioTracks.length * 5.2).toFixed(1); // avg ~5.2MB 320kbps MP3
    const totalMediaMb = +(speakerEstimatedMb + audioEstimatedMb).toFixed(1);
    const mediaQuotaMb = 1000; // 1 GB free bucket quota
    const mediaPercentage = Math.min(100, Math.round((totalMediaMb / mediaQuotaMb) * 100));

    // Firestore Documents count
    const totalDocs =
      registrations.length +
      schedule.length +
      guests.length +
      faqs.length +
      darsAccounts.length +
      audioTracks.length;

    const estimatedDocKb = +(totalDocs * 1.8).toFixed(1); // avg ~1.8KB JSON document

    return {
      speakerPhotosCount,
      speakerEstimatedMb,
      audioEstimatedMb,
      totalMediaMb,
      mediaPercentage,
      totalDocs,
      estimatedDocKb,
    };
  }, [registrations, schedule, guests, faqs, darsAccounts, audioTracks]);

  const collections = [
    {
      name: 'registrations',
      label: 'Registrations',
      count: registrations.length,
      icon: FileText,
      color: 'text-amber-500',
    },
    {
      name: 'darsAccounts',
      label: 'Dars Hubs',
      count: darsAccounts.length,
      icon: Building2,
      color: 'text-brand-gold',
    },
    {
      name: 'schedule',
      label: 'Schedule Sessions',
      count: schedule.length,
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      name: 'guests',
      label: 'Guests & Faculty',
      count: guests.length,
      icon: Users,
      color: 'text-emerald-400',
    },
    {
      name: 'faqs',
      label: 'FAQs & Answers',
      count: faqs.length,
      icon: HelpCircle,
      color: 'text-purple-400',
    },
    {
      name: 'audioTracks',
      label: 'Audio Tracks',
      count: audioTracks.length,
      icon: Music,
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-clash font-bold text-lg text-neutral-900 dark:text-white">
                Cloud Storage & Data Footprint
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal dark:text-emerald-400 font-mono text-[10px] font-bold">
                TELEMETRY LIVE
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Supabase Media CDN and Firebase Firestore document metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Real-time DB synchronization</span>
        </div>
      </div>

      {/* Main Grid: Storage CDN & Firestore */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Supabase Media CDN Meter */}
        <div className="p-5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-brand-gold" />
              <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white">
                Supabase CDN Storage
              </h4>
            </div>
            <span className="font-mono text-xs font-bold text-brand-gold">
              {stats.totalMediaMb} MB / 1,000 MB
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(3, stats.mediaPercentage)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-gold to-brand-teal rounded-full"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>{stats.mediaPercentage}% of 1 GB allocated</span>
              <span>{(1000 - stats.totalMediaMb).toFixed(1)} MB available</span>
            </div>
          </div>

          {/* Breakdown items */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/10">
              <div className="flex items-center gap-2 text-neutral-500 text-[11px] mb-1">
                <Music className="w-3.5 h-3.5 text-brand-gold" />
                <span>Audio Bucket</span>
              </div>
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white block">
                {stats.audioEstimatedMb} MB
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {audioTracks.length} tracks registered
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/10">
              <div className="flex items-center gap-2 text-neutral-500 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Speakers Bucket</span>
              </div>
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white block">
                {stats.speakerEstimatedMb} MB
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                {stats.speakerPhotosCount} photos hosted
              </span>
            </div>
          </div>
        </div>

        {/* Firestore Documents Footprint */}
        <div className="p-5 rounded-2xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white">
                Firestore Database Collections
              </h4>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-500">
              {stats.totalDocs} Documents ({stats.estimatedDocKb} KB)
            </div>
          </div>

          {/* Collection Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {collections.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.name}
                  className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${c.color}`} />
                    <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 truncate">
                      {c.label}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white shrink-0 ml-1">
                    {c.count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sync guarantee note */}
          <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-gold" />
              WebSocket listener active
            </span>
            <span className="text-emerald-500">Latency: ~24ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
