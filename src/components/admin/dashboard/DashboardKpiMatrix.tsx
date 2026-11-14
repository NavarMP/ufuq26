'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Building2,
  Calendar,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Registration, ScheduleSession, Guest, FAQ, DarsAccount, AudioTrack } from '@/types';
import { AdminTab } from '../layout/AdminSidebar';

interface DashboardKpiMatrixProps {
  registrations: Registration[];
  schedule: ScheduleSession[];
  guests: Guest[];
  faqs: FAQ[];
  darsAccounts: DarsAccount[];
  audioTracks: AudioTrack[];
  onSelectTab: (tab: AdminTab) => void;
}

export default function DashboardKpiMatrix({
  registrations,
  schedule,
  guests,
  faqs,
  darsAccounts,
  audioTracks,
  onSelectTab,
}: DashboardKpiMatrixProps) {
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;
  const confirmationRatio = registrations.length > 0
    ? Math.round((confirmedCount / registrations.length) * 100)
    : 0;

  const activeDarsLogins = darsAccounts.filter((d) => d.isActive).length;
  const publishedSessions = schedule.filter((s) => s.published).length;
  const publishedFaqs = faqs.filter((f) => f.published).length;

  const kpis = [
    {
      id: 'registrations',
      label: 'Total Registrations',
      value: registrations.length,
      subtext: `${confirmedCount} confirmed (${confirmationRatio}%)`,
      badge: `${pendingCount} pending`,
      badgePositive: pendingCount === 0,
      icon: FileText,
      accentGradient: 'from-amber-400 to-amber-600',
      iconBg: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
      targetTab: 'registrations' as AdminTab,
      sparkline: [2, 5, 8, 12, 19, 28, Math.max(30, registrations.length)],
    },
    {
      id: 'dars',
      label: 'SUFFA Dars Network',
      value: darsAccounts.length,
      subtext: `${activeDarsLogins} active student logins`,
      badge: '39 Hubs Seeded',
      badgePositive: true,
      icon: Building2,
      accentGradient: 'from-brand-gold to-brand-gold-hover',
      iconBg: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
      targetTab: 'dars' as AdminTab,
      sparkline: [5, 12, 20, 28, 35, 39, 39],
    },
    {
      id: 'schedule',
      label: 'Residency Timetable',
      value: schedule.length,
      subtext: `${publishedSessions} published sessions`,
      badge: '7 Days Planned',
      badgePositive: true,
      icon: Calendar,
      accentGradient: 'from-blue-400 to-blue-600',
      iconBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      targetTab: 'sessions' as AdminTab,
      sparkline: [3, 6, 10, 14, 18, 20, Math.max(22, schedule.length)],
    },
    {
      id: 'faculty',
      label: 'Faculty & Scholars',
      value: guests.length,
      subtext: `${publishedFaqs} FAQs • ${audioTracks.length} Audio`,
      badge: 'Patrons & Dignitaries',
      badgePositive: true,
      icon: Users,
      accentGradient: 'from-emerald-400 to-teal-500',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      targetTab: 'guests' as AdminTab,
      sparkline: [2, 4, 7, 9, 12, 14, Math.max(16, guests.length)],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;

        // Render micro sparkline SVG
        const minVal = Math.min(...kpi.sparkline);
        const maxVal = Math.max(...kpi.sparkline);
        const range = maxVal - minVal || 1;
        const width = 80;
        const height = 24;
        const points = kpi.sparkline
          .map((v, i) => {
            const x = (i / (kpi.sparkline.length - 1)) * width;
            const y = height - ((v - minVal) / range) * (height - 6) - 3;
            return `${x},${y}`;
          })
          .join(' ');

        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -3 }}
            onClick={() => onSelectTab(kpi.targetTab)}
            className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 hover:border-brand-gold/50 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 group text-left relative overflow-hidden"
          >
            {/* Top row: Icon and Trend Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform ${kpi.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-tight border ${
                  kpi.badgePositive
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}
              >
                {kpi.badge}
              </span>
            </div>

            {/* Metric Value & Label */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block font-semibold">
                {kpi.label}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-clash font-extrabold text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
                  {kpi.value}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                {kpi.subtext}
              </p>
            </div>

            {/* Bottom Row: Micro sparkline & Jump Arrow */}
            <div className="pt-2 border-t border-brand-gold/10 flex items-center justify-between">
              {/* Sparkline curve */}
              <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                <svg width={width} height={height} className="overflow-visible">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-gold"
                    points={points}
                  />
                </svg>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 group-hover:text-brand-gold transition-colors">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
