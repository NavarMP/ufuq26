'use client';

import React, { useState, useEffect } from 'react';
import { usePreferences, CountdownFormat } from '@/context/PreferencesContext';
import {
  Calendar,
  Bell,
  HardDrive,
  Download,
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';
import toast from 'react-hot-toast';

export default function CampOfflineTab() {
  const { preferences, updatePreference, resetToDefaults } = usePreferences();
  const [cacheSize, setCacheSize] = useState<string>('Calculating...');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    // Estimate storage usage
    if (typeof window !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((est) => {
        if (est.usage) {
          const mb = (est.usage / (1024 * 1024)).toFixed(1);
          setCacheSize(`${mb} MB cached`);
        } else {
          setCacheSize('~3.2 MB cached');
        }
      }).catch(() => setCacheSize('~3.2 MB cached'));
    } else {
      setCacheSize('~3.2 MB cached');
    }
  }, []);

  const handleCountdownChange = (format: CountdownFormat) => {
    soundEngine.playSnap();
    hapticEngine.trigger('selection');
    updatePreference('countdownFormat', format);
  };

  const handleNotificationRequest = async () => {
    soundEngine.playClick();
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('Browser notifications are not supported on this device.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updatePreference('sessionRemindersEnabled', true);
        soundEngine.playSuccess();
        hapticEngine.trigger('success');
        toast.success('Camp session reminders enabled!');
      } else {
        updatePreference('sessionRemindersEnabled', false);
        toast.error('Notification permission denied');
      }
    } catch {
      toast.error('Failed to request notification permission');
    }
  };

  const handleDownloadOfflinePack = async () => {
    setIsDownloading(true);
    soundEngine.playClick();
    hapticEngine.trigger('crisp');

    try {
      // Pre-cache critical routes and assets
      if ('caches' in window) {
        const cache = await caches.open('ufuq-offline-v1');
        await cache.addAll([
          '/',
          '/images/UFUQ-Logo.svg',
          '/manifest.json',
          '/locales/en.json',
          '/locales/ml.json',
          '/locales/ar.json',
        ]);
      }
      setTimeout(() => {
        setIsDownloading(false);
        soundEngine.playSuccess();
        hapticEngine.trigger('success');
        toast.success('Offline Camp Pack downloaded successfully!');
      }, 1200);
    } catch {
      setIsDownloading(false);
      toast.error('Could not pre-cache all assets.');
    }
  };

  const handlePurgeCache = async () => {
    soundEngine.playClick();
    hapticEngine.trigger('warning');

    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    toast.success('Offline cache purged.');
    setCacheSize('0.0 MB cached');
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
    toast.success('All preferences restored to factory defaults');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. COUNTDOWN CHRONOMETER FORMAT */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
          Camp Countdown Format
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'days' as const, label: 'Days Remaining', desc: 'e.g. 40 Days' },
            { id: 'full' as const, label: 'Full Chronometer', desc: 'DD : HH : MM : SS' },
            { id: 'compact' as const, label: 'Minimalist', desc: 'Single Badge' },
          ].map((c) => {
            const isSelected = preferences.countdownFormat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleCountdownChange(c.id)}
                type="button"
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-navy dark:text-white ring-1 ring-brand-gold/40 font-bold'
                    : 'border-neutral-200/60 dark:border-white/10 bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <span className="block text-xs">{c.label}</span>
                <span className="block text-[10px] opacity-70 mt-0.5">{c.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CAMP SESSION NOTIFICATIONS */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Camp Session Reminders
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Receive browser alert alerts before keynote lectures & workshops
              </p>
            </div>
          </div>
          <button
            onClick={handleNotificationRequest}
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              preferences.sessionRemindersEnabled
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                : 'bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-sm'
            }`}
          >
            {preferences.sessionRemindersEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>

      {/* 3. OFFLINE STORAGE & CACHE VAULT */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Offline Storage & Cache Vault
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Storage: {cacheSize}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-black/5 dark:border-white/10">
          <button
            onClick={handleDownloadOfflinePack}
            disabled={isDownloading}
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-gold hover:bg-brand-gold-hover text-brand-navy transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Downloading Pack...' : 'Download Offline Camp Pack'}</span>
          </button>
          <button
            onClick={handlePurgeCache}
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 border border-neutral-200/50 dark:border-white/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Cache</span>
          </button>
        </div>
      </div>

      {/* 4. FACTORY RESET */}
      <div className="pt-2 border-t border-black/5 dark:border-white/10">
        {!isResetConfirmOpen ? (
          <button
            onClick={() => {
              soundEngine.playClick();
              setIsResetConfirmOpen(true);
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:bg-red-500/10 border border-neutral-200/50 dark:border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Preferences to Factory Defaults</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Are you sure? This resets all personalized settings.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                type="button"
                className="px-2.5 py-1 text-xs rounded-lg bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                type="button"
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 text-white shadow-sm"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
