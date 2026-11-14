'use client';

import React, { useEffect, useRef } from 'react';
import { X, Share2, QrCode, Sparkles, Code2, Send } from 'lucide-react';
import { useShare } from '@/hooks/useShare';
import { useApp } from '@/context/AppContext';
import CopyLinkAction from '@/components/share/CopyLinkAction';
import SocialChannelGrid from '@/components/share/SocialChannelGrid';
import QRCodeView from '@/components/share/QRCodeView';
import StoryCardGenerator from '@/components/share/StoryCardGenerator';
import EmbedCodeGenerator from '@/components/share/EmbedCodeGenerator';

export default function ShareModal() {
  const { isOpen, payload, activeTab, closeShare, setActiveTab } = useShare();
  const { t } = useApp();
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeShare();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeShare]);

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    {
      id: 'channels' as const,
      label: t('share.tabs.direct') || 'Share',
      icon: <Send className="w-3.5 h-3.5" />,
    },
    {
      id: 'story' as const,
      label: t('share.tabs.story') || 'Story Card',
      icon: <Sparkles className="w-3.5 h-3.5 text-brand-gold" />,
    },
    {
      id: 'qr' as const,
      label: t('share.tabs.qr') || 'QR Code',
      icon: <QrCode className="w-3.5 h-3.5" />,
    },
    {
      id: 'embed' as const,
      label: t('share.tabs.embed') || 'Embed',
      icon: <Code2 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeShare();
      }}
    >
      {/* Modal / Bottom Sheet Box */}
      <div
        ref={modalRef}
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] flex flex-col bg-brand-cream/95 dark:bg-brand-navy/95 border border-brand-gold/30 rounded-t-3xl sm:rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-slide-up"
      >
        {/* Mobile Swipe Handle */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1 rounded-full bg-neutral-400/40" />
        </div>

        {/* Modal Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-brand-gold/20">
          <div className="space-y-1 text-left rtl:text-right pr-4 rtl:pr-0 rtl:pl-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <Share2 className="w-3.5 h-3.5" />
              </div>
              <h3 id="share-modal-title" className="font-clash text-lg font-bold text-brand-navy dark:text-white">
                {t('share.title') || 'Share UFUQ ’26'}
              </h3>
              {payload.badgeText && (
                <span className="px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase">
                  {payload.badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
              {payload.title}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.share({
                      title: payload.title,
                      text: payload.text || 'Rooted in Ilm. Ready for the World. December 24–30, 2026.',
                      url: payload.url,
                    });
                  } catch {
                    // user cancelled
                  }
                }}
                aria-label="Open device share sheet"
                className="p-1.5 rounded-full text-brand-gold hover:bg-brand-gold/15 transition-colors"
                title="Open native device share sheet"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={closeShare}
              aria-label="Close dialog"
              className="p-1.5 rounded-full text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 pb-2 border-b border-brand-gold/15 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-gold text-brand-navy shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {activeTab === 'channels' && (
            <div className="space-y-4">
              <CopyLinkAction />
              <div className="pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2 text-left rtl:text-right">
                  {t('share.tabs.direct') || 'Direct Channels'}
                </span>
                <SocialChannelGrid />
              </div>
            </div>
          )}

          {activeTab === 'story' && <StoryCardGenerator />}

          {activeTab === 'qr' && (
            <div className="space-y-3">
              <QRCodeView />
              <CopyLinkAction />
            </div>
          )}

          {activeTab === 'embed' && <EmbedCodeGenerator />}
        </div>

        {/* Footer info pill */}
        <div className="px-5 py-2.5 bg-black/5 dark:bg-black/20 border-t border-brand-gold/15 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Dec 24–30, 2026 · Alathurpadi</span>
          <span className="font-arabic text-brand-gold">أفُق — نحو الأفق الجديد</span>
        </div>
      </div>
    </div>
  );
}
