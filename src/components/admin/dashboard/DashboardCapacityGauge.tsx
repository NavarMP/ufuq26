'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Registration, EventInfo } from '@/types';

interface DashboardCapacityGaugeProps {
  registrations: Registration[];
  eventInfo: EventInfo;
  onViewRegistrations?: () => void;
}

export default function DashboardCapacityGauge({
  registrations,
  eventInfo,
  onViewRegistrations,
}: DashboardCapacityGaugeProps) {
  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;
  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  // Dynamically read target capacity from eventInfo.maxParticipants with fallback to 150
  const targetCapacity = eventInfo.maxParticipants && eventInfo.maxParticipants > 0
    ? eventInfo.maxParticipants
    : 150;

  const occupancyRate = Math.min(100, Math.round((confirmedCount / targetCapacity) * 100));
  const remainingSeats = Math.max(0, targetCapacity - confirmedCount);

  // SVG Gauge calculations
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (occupancyRate / 100) * circumference;

  const isNearingCapacity = occupancyRate >= 85;
  const isAtCapacity = occupancyRate >= 100;

  return (
    <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg flex flex-col justify-between space-y-5 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center border border-brand-gold/30">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-clash font-bold text-base text-neutral-900 dark:text-white">
              Residency Capacity Gauge
            </h3>
            <p className="text-[11px] text-neutral-500">
              Target quota vs confirmed admissions
            </p>
          </div>
        </div>

        {onViewRegistrations && (
          <button
            type="button"
            onClick={onViewRegistrations}
            className="text-[11px] font-semibold text-brand-gold hover:underline font-mono"
          >
            Review Queue
          </button>
        )}
      </div>

      {/* Center: Radial Circular Arc Meter */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
            {/* Background Track Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-black/10 dark:text-white/10"
            />
            {/* Animated Progress Circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#capacityGaugeGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="capacityGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c9a45c" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-clash font-extrabold text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
              {occupancyRate}%
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Occupancy
            </span>
          </div>
        </div>

        {/* Legend / Metrics Breakdown */}
        <div className="space-y-3 flex-1 w-full sm:w-auto">
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Confirmed Delegates
              </span>
            </div>
            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
              {confirmedCount}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Target Capacity
              </span>
            </div>
            <span className="font-mono font-bold text-sm text-brand-gold">
              {targetCapacity} seats
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Pending Review
              </span>
            </div>
            <span className="font-mono font-bold text-sm text-amber-500">
              {pendingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Status Advisory Banner */}
      <div
        className={`p-3 rounded-2xl text-xs flex items-center justify-between border ${
          isAtCapacity
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
            : isNearingCapacity
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {isNearingCapacity ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span className="font-medium">
            {isAtCapacity
              ? 'Capacity limit reached. Additional submissions should go to waitlist.'
              : isNearingCapacity
              ? `High demand: Only ${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remaining.`
              : `Capacity on track: ${remainingSeats} available seat${remainingSeats === 1 ? '' : 's'}.`}
          </span>
        </div>
        <span className="font-mono font-bold text-[11px] shrink-0">
          {remainingSeats} left
        </span>
      </div>
    </div>
  );
}
