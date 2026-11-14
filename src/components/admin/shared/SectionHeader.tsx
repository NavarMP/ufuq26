'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  icon: Icon,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-gold/15">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center shrink-0 text-brand-gold">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-clash text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
