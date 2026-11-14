'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'gold' | 'teal' | 'navy' | 'emerald' | 'amber';
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  accentColor = 'gold',
  onClick,
}: StatCardProps) {
  const colorMap = {
    gold: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
    teal: 'text-brand-teal dark:text-emerald-400 bg-brand-teal/10 border-brand-teal/20',
    navy: 'text-brand-navy dark:text-white bg-brand-navy/10 dark:bg-white/10 border-brand-gold/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg relative overflow-hidden transition-all ${
        onClick ? 'cursor-pointer hover:border-brand-gold' : ''
      }`}
    >
      {/* Decorative ambient background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-gold/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center border shrink-0 ${colorMap[accentColor]}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="font-clash font-extrabold text-3xl text-neutral-900 dark:text-white mt-2 tracking-tight">
        {value}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px]">
        {subtext && (
          <span className="text-neutral-500 dark:text-neutral-400 font-mono">
            {subtext}
          </span>
        )}
        {trend && (
          <span
            className={`font-semibold px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
