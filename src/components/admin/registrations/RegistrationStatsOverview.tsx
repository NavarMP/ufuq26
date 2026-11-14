'use client';

import React from 'react';
import { Registration, SuffaDars } from '@/types';
import { isToday } from './registrationUtils';
import { Users, CheckCircle2, Clock, Building2, TrendingUp, Sparkles } from 'lucide-react';

interface RegistrationStatsOverviewProps {
  registrations: Registration[];
  darsList: SuffaDars[];
}

export default function RegistrationStatsOverview({
  registrations,
  darsList,
}: RegistrationStatsOverviewProps) {
  const activeRegs = registrations.filter((r) => !r.isArchived);
  const totalActive = activeRegs.length;
  const confirmedCount = activeRegs.filter((r) => r.status === 'confirmed').length;
  const pendingCount = activeRegs.filter((r) => r.status === 'pending').length;
  const cancelledCount = activeRegs.filter((r) => r.status === 'cancelled').length;
  const archivedCount = registrations.filter((r) => r.isArchived).length;
  
  const todayCount = activeRegs.filter((r) => isToday(r.submittedAt)).length;
  const confirmedPercent = totalActive > 0 ? Math.round((confirmedCount / totalActive) * 100) : 0;

  // Distinct SUFFA institutions represented
  const distinctDarsIds = new Set(
    activeRegs.map((r) => r.darsRegNo || r.darsId || r.darsName).filter(Boolean)
  );
  const darsRepresentedCount = distinctDarsIds.size;
  const totalDarsCount = darsList.length || 39;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Active Registrations */}
      <div className="glass-panel p-4 rounded-2xl border border-brand-gold/20 relative overflow-hidden group hover:border-brand-gold/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Total Active
          </span>
          <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
            {totalActive}
          </span>
          {todayCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              +{todayCount} today
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-neutral-400 truncate">
          {archivedCount > 0 ? `${archivedCount} archived entries` : 'All records in active pool'}
        </div>
      </div>

      {/* 2. Confirmed Delegates */}
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80">
            Confirmed
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
            {confirmedCount}
          </span>
          <span className="text-xs font-mono text-neutral-400">({confirmedPercent}%)</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2 w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${confirmedPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Pending Review */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/20 relative overflow-hidden group hover:border-amber-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600/80 dark:text-amber-400/80">
            Pending Review
          </span>
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
            {pendingCount}
          </span>
          {pendingCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              Action needed
            </span>
          )}
        </div>
        <div className="mt-1 text-[11px] text-neutral-400 truncate">
          {cancelledCount > 0 ? `${cancelledCount} cancelled requests` : 'Awaiting confirmation'}
        </div>
      </div>

      {/* 4. Institutions Represented */}
      <div className="glass-panel p-4 rounded-2xl border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80">
            Institutions
          </span>
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
            {darsRepresentedCount}
          </span>
          <span className="text-xs font-mono text-neutral-400">/ {totalDarsCount} Dars</span>
        </div>
        <div className="mt-1 text-[11px] text-neutral-400 truncate flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-gold" />
          <span>Kerala SUFFA network</span>
        </div>
      </div>
    </div>
  );
}
