'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useShareStore } from '@/store/shareStore';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { SharePayload } from '@/types/share';

export function useShare() {
  const { isOpen, payload, activeTab, openShare, closeShare, setActiveTab } = useShareStore();
  const { triggerSuccess, triggerLight } = useHapticFeedback();
  const { playSuccessChime, playTick } = useAudioFeedback();
  const [copied, setCopied] = useState(false);

  const isNativeShareSupported = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  /**
   * Triggers native OS share sheet if available, otherwise opens our Share Hub
   */
  const share = useCallback(
    async (customPayload?: Partial<SharePayload>) => {
      triggerLight();
      playTick();

      const targetPayload = customPayload ? { ...payload, ...customPayload } : payload;
      const shareUrl = targetPayload.url.startsWith('http')
        ? targetPayload.url
        : `${typeof window !== 'undefined' ? window.location.origin : 'https://alathurpadidars.in'}${targetPayload.url}`;

      if (isNativeShareSupported) {
        try {
          await navigator.share({
            title: targetPayload.title,
            text: targetPayload.text,
            url: shareUrl,
          });
          triggerSuccess();
          return;
        } catch (err: unknown) {
          // If user aborted / cancelled native share dialog, don't fallback to modal
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          // On other errors, fallback to opening Share Hub
        }
      }

      openShare({ ...targetPayload, url: shareUrl });
    },
    [isNativeShareSupported, openShare, payload, playTick, triggerLight, triggerSuccess]
  );

  /**
   * 1-Click copy to clipboard with multi-sensory feedback
   */
  const copyLink = useCallback(
    async (textToCopy?: string, label: string = 'Link copied to clipboard') => {
      const text = textToCopy || payload.url;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        triggerSuccess();
        playSuccessChime();
        toast.success(label, {
          id: 'share-copy',
          duration: 2500,
          style: {
            background: '#101d32',
            color: '#f5f0e8',
            border: '1px solid rgba(201, 164, 92, 0.4)',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 16px',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.5)',
          },
          iconTheme: {
            primary: '#c9a45c',
            secondary: '#101d32',
          },
        });
        setTimeout(() => setCopied(false), 2200);
        return true;
      } catch {
        toast.error('Failed to copy link');
        return false;
      }
    },
    [payload.url, playSuccessChime, triggerSuccess]
  );

  return {
    isOpen,
    payload,
    activeTab,
    copied,
    isNativeShareSupported,
    openShare,
    closeShare,
    setActiveTab,
    share,
    copyLink,
  };
}
