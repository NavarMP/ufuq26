'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { useShare } from '@/hooks/useShare';
import { SharePayload } from '@/types/share';

interface ShareTriggerButtonProps {
  payload?: Partial<SharePayload>;
  variant?: 'pill' | 'icon' | 'gold' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  defaultTab?: 'channels' | 'qr' | 'story' | 'embed';
}

export default function ShareTriggerButton({
  payload,
  variant = 'pill',
  size = 'md',
  label = 'Share',
  className = '',
  defaultTab = 'channels',
}: ShareTriggerButtonProps) {
  const { openShare } = useShare();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openShare(payload || {}, defaultTab);
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs px-3.5 py-2 gap-1.5',
    lg: 'text-sm px-5 py-2.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-4 h-4',
  }[size];

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className={`p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-brand-gold dark:hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90 ${className}`}
      >
        <Share2 className={iconSizes} />
      </button>
    );
  }

  if (variant === 'gold') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center font-bold rounded-full bg-brand-gold text-brand-navy hover:bg-brand-gold-hover shadow-lg shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all ${sizeClasses} ${className}`}
      >
        <Share2 className={iconSizes} />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center font-semibold rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95 ${sizeClasses} ${className}`}
    >
      <Share2 className={`${iconSizes} text-brand-gold`} />
      <span>{label}</span>
    </button>
  );
}
