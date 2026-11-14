'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Building2, ShieldCheck, X, ArrowRight, Lock, Sparkles } from 'lucide-react';

interface UnifiedLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UnifiedLoginModal({ isOpen, onClose }: UnifiedLoginModalProps) {
  const { t, isRtl } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trap scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="unified-login-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl glass-panel bg-white/90 dark:bg-brand-navy/95 border border-brand-gold/30 shadow-2xl p-6 sm:p-8 overflow-hidden text-neutral-900 dark:text-neutral-100 animate-scale-in"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-gold/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-200/60 dark:border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="unified-login-title"
                className="font-clash font-bold text-lg text-brand-navy dark:text-brand-gold-light leading-tight"
              >
                {t('nav.unifiedLoginTitle') || 'Portal Access'}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('nav.unifiedLoginDesc') || 'Select your portal to proceed'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 relative z-10">
          {/* Dars Coordinator Portal Card */}
          <Link
            href="/dars"
            onClick={onClose}
            className="group flex flex-col justify-between p-5 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-brand-gold/50 bg-neutral-50/60 dark:bg-white/5 hover:bg-brand-gold/10 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-clash font-semibold text-sm text-brand-navy dark:text-white group-hover:text-brand-gold transition-colors">
                {t('nav.darsPortal') || 'Dars Portal'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {t('nav.darsDesc') || 'SUFFA Dars coordinators & verification'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-brand-gold">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Admin Organizer Portal Card */}
          <Link
            href="/admin"
            onClick={onClose}
            className="group flex flex-col justify-between p-5 rounded-2xl border border-neutral-200 dark:border-white/10 hover:border-brand-teal/50 bg-neutral-50/60 dark:bg-white/5 hover:bg-brand-teal/10 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-brand-teal/15 border border-brand-teal/30 flex items-center justify-center text-brand-teal group-hover:scale-105 transition-transform mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-clash font-semibold text-sm text-brand-navy dark:text-white group-hover:text-brand-teal transition-colors">
                {t('nav.adminPortal') || 'Admin Portal'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                {t('nav.adminDesc') || 'Camp organizers & administrative control'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-brand-teal">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 text-center">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>UFUQ ’26 Authorized Personnel Access Only</span>
        </div>
      </div>
    </div>
  );
}
