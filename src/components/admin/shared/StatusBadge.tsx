'use client';

import React from 'react';

export type StatusVariant =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'published'
  | 'draft';

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
  showDot?: boolean;
}

export default function StatusBadge({
  status,
  className = '',
  showDot = true,
}: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();

  let styles = 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-300 border-neutral-500/20';
  let dotStyles = 'bg-neutral-400';
  const label = status;

  switch (normalized) {
    case 'confirmed':
    case 'active':
    case 'published':
      styles = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      dotStyles = 'bg-emerald-500 shadow-sm shadow-emerald-500/50';
      break;
    case 'pending':
    case 'draft':
      styles = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      dotStyles = 'bg-amber-500 shadow-sm shadow-amber-500/50';
      break;
    case 'cancelled':
    case 'inactive':
      styles = 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      dotStyles = 'bg-rose-500 shadow-sm shadow-rose-500/50';
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border capitalize backdrop-blur-sm ${styles} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles}`} />
      )}
      <span>{label}</span>
    </span>
  );
}
