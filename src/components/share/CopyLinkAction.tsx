'use client';

import React, { useState } from 'react';
import { Copy, Check, Link2 } from 'lucide-react';
import { useShare } from '@/hooks/useShare';
import { useApp } from '@/context/AppContext';
import GoldConfetti from '@/components/effects/GoldConfetti';

interface CopyLinkActionProps {
  url?: string;
  className?: string;
}

export default function CopyLinkAction({ url, className = '' }: CopyLinkActionProps) {
  const { payload, copyLink } = useShare();
  const { t } = useApp();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const targetUrl = url || payload.url;

  const handleCopy = async () => {
    const success = await copyLink(targetUrl, t('share.copied') || 'Link copied to clipboard!');
    if (success) {
      setCopied(true);
      setShowConfetti(true);
      setTimeout(() => setCopied(false), 2200);
      setTimeout(() => setShowConfetti(false), 1200);
    }
  };

  return (
    <div className={`relative flex items-center gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 focus-within:border-brand-gold transition-all ${className}`}>
      <GoldConfetti trigger={showConfetti} />

      <div className="pl-3 rtl:pl-1 rtl:pr-3 text-neutral-400 shrink-0">
        <Link2 className="w-4 h-4 text-brand-gold" />
      </div>

      <input
        type="text"
        readOnly
        value={targetUrl}
        aria-label="Share Link"
        onClick={(e) => (e.target as HTMLInputElement).select()}
        className="flex-1 min-w-0 bg-transparent text-xs text-neutral-700 dark:text-neutral-200 font-mono focus:outline-none selection:bg-brand-gold/30 truncate"
      />

      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? t('share.copied') : t('share.copyLink')}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 active:scale-95 ${
          copied
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
            : 'bg-brand-gold text-brand-navy hover:bg-brand-gold-hover shadow-md shadow-brand-gold/20'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t('share.copied') || 'Copied!'}</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>{t('share.copyLink') || 'Copy'}</span>
          </>
        )}
      </button>
    </div>
  );
}
