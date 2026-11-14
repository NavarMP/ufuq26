'use client';

import React, { useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { Copy, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import toast from 'react-hot-toast';

export default function EmbedCodeGenerator() {
  const { t } = useApp();
  const { triggerSuccess } = useHapticFeedback();
  const { playSuccessChime } = useAudioFeedback();
  const [copied, setCopied] = useState(false);

  const embedSnippet = `<a href="https://alathurpadidars.in" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:12px;padding:10px 18px;background:#101d32;color:#f5f0e8;border:1px solid #c9a45c;border-radius:16px;text-decoration:none;font-family:sans-serif;font-size:13px;box-shadow:0 4px 14px rgba(0,0,0,0.25);">
  <img src="https://alathurpadidars.in/images/UFUQ-Logo-app.svg" alt="UFUQ '26" width="28" height="28" style="object-fit:contain;border-radius:50%;" />
  <div>
    <strong style="display:block;color:#f5ad1f;font-size:14px;letter-spacing:0.5px;">UFUQ ’26 — أُفُق</strong>
    <span style="font-size:11px;opacity:0.85;">Dec 24–30, 2026 · Alathurpadi Dars Campus</span>
  </div>
</a>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      triggerSuccess();
      playSuccessChime();
      toast.success(t('share.embed.copied') || 'Embed code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy embed snippet');
    }
  };

  return (
    <div className="space-y-4 p-4 text-left rtl:text-right">
      <div>
        <h4 className="font-clash text-sm font-bold text-brand-navy dark:text-white">
          {t('share.embed.heading') || 'Website Embed Badge'}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('share.embed.subheading') || 'Paste this HTML snippet into any SUFFA Dars or institutional website.'}
        </p>
      </div>

      {/* Live Badge Preview */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 flex flex-col items-center justify-center gap-2">
        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Live Preview</span>
        <a
          href="https://alathurpadidars.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-brand-navy text-neutral-100 border border-brand-gold shadow-lg hover:scale-105 transition-transform"
        >
          <div className="w-7 h-7 relative shrink-0">
            <BrandLogo variant="inverse" label="UFUQ '26" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-clash font-bold text-xs text-brand-gold leading-tight">UFUQ ’26 — أُفُق</div>
            <div className="text-[10px] text-neutral-300">Dec 24–30, 2026 · Alathurpadi Dars Campus</div>
          </div>
        </a>
      </div>

      {/* Code Snippet Box */}
      <div className="relative rounded-2xl bg-brand-dark border border-brand-gold/30 p-3.5 font-mono text-[11px] text-neutral-300 overflow-x-auto">
        <pre className="whitespace-pre-wrap break-all">{embedSnippet}</pre>
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 rtl:right-auto rtl:left-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-gold text-brand-navy text-xs font-bold hover:bg-brand-gold-hover transition-colors shadow"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-950" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : t('share.embed.copy') || 'Copy Code'}</span>
        </button>
      </div>
    </div>
  );
}
