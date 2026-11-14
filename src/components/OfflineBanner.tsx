'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { WifiOff, Wifi, Download, X } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline, t } = useApp();
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallPill, setShowInstallPill] = useState(false);

  // Monitor connectivity state change
  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowOnlineToast(true);
      const timer = setTimeout(() => {
        setShowOnlineToast(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  // PWA beforeinstallprompt capture
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallPill(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallPill(false);
    }
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 inset-x-0 z-[100] bg-amber-600 text-white text-xs font-medium py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md animate-slide-down"
        >
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>{t('common.offline')}: {t('common.offlineMessage')}</span>
        </div>
      )}

      {/* Back Online Toast */}
      {showOnlineToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white text-xs font-semibold py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2 animate-slide-up"
        >
          <Wifi className="w-4 h-4" />
          <span>{t('common.backOnline')}</span>
        </div>
      )}

      {/* PWA Install Suggestion Pill */}
      {showInstallPill && (
        <div className="fixed bottom-24 md:bottom-8 left-4 z-40 max-w-xs p-3 rounded-2xl glass-panel border border-brand-gold/40 shadow-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-neutral-800 dark:text-neutral-200">
            <Download className="w-4 h-4 text-brand-gold shrink-0" />
            <span>Install UFUQ ’26 App</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-navy font-bold text-[11px] hover:bg-brand-gold-hover transition-colors"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallPill(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              aria-label="Dismiss install prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
