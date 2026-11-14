'use client';

import React from 'react';
import { Mail, MessageSquare, Share2, Send, Linkedin, Facebook } from 'lucide-react';
import { WhatsAppIcon, XTwitterIcon } from '@/components/SocialIcons';
import { getSocialShareUrls } from '@/lib/shareUrls';
import { useShare } from '@/hooks/useShare';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useApp } from '@/context/AppContext';

interface SocialChannelGridProps {
  className?: string;
  onChannelClick?: () => void;
}

export default function SocialChannelGrid({ className = '', onChannelClick }: SocialChannelGridProps) {
  const { payload, isNativeShareSupported } = useShare();
  const { triggerLight } = useHapticFeedback();
  const { playTick } = useAudioFeedback();
  const { t } = useApp();

  const urls = getSocialShareUrls(payload);

  const handleNativeShare = async () => {
    triggerLight();
    playTick();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url,
        });
      } catch {
        // User cancelled
      }
    }
  };

  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      url: urls.whatsapp,
      icon: <WhatsAppIcon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-emerald-500/10 hover:border-emerald-500/40',
      badge: 'Direct',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      url: urls.telegram,
      icon: <Send className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-sky-500/10 hover:border-sky-500/40',
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      url: urls.twitter,
      icon: <XTwitterIcon className="w-4 h-4 text-neutral-800 dark:text-neutral-200 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-neutral-500/10 hover:border-neutral-500/40',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: urls.linkedin,
      icon: <Linkedin className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-blue-500/10 hover:border-blue-500/40',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: urls.facebook,
      icon: <Facebook className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-blue-600/10 hover:border-blue-600/40',
    },
    {
      id: 'email',
      name: 'Email',
      url: urls.email,
      icon: <Mail className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-amber-500/10 hover:border-amber-500/40',
    },
    {
      id: 'sms',
      name: 'SMS',
      url: urls.sms,
      icon: <MessageSquare className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />,
      bg: 'hover:bg-teal-500/10 hover:border-teal-500/40',
    },
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Native Device Share Banner (Shown prominently if supported on mobile) */}
      {isNativeShareSupported && (
        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-brand-gold/10 to-transparent border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-100 font-semibold text-xs transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-left rtl:text-right">
              <span className="block font-bold leading-tight">{t('share.nativeShare') || 'Share via System'}</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
                AirDrop, Messages, Instagram, etc.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-brand-gold px-2 py-0.5 rounded-full bg-brand-gold/15">
            Instant
          </span>
        </button>
      )}

      {/* Grid of Direct Share Channels */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
        {channels.map((ch) => (
          <a
            key={ch.id}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              triggerLight();
              playTick();
              if (onChannelClick) onChannelClick();
            }}
            className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 transition-all duration-200 active:scale-95 ${ch.bg}`}
            title={`Share on ${ch.name}`}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 dark:bg-black/40 border border-brand-gold/20 shadow-sm">
              {ch.icon}
            </div>
            <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate max-w-full">
              {ch.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
