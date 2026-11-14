'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={!isLoading ? onCancel : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md p-6 rounded-3xl glass-panel bg-white/95 dark:bg-[#0f1624]/95 border border-brand-gold/30 shadow-2xl space-y-5 z-10"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  variant === 'danger'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : variant === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                    : 'bg-brand-gold/10 border-brand-gold/30 text-brand-gold'
                }`}
              >
                {variant === 'danger' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : variant === 'warning' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Info className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1 pr-6 flex-1 text-left">
                <h3
                  id="confirm-dialog-title"
                  className="font-clash text-lg font-bold text-neutral-900 dark:text-white"
                >
                  {title}
                </h3>
                <p
                  id="confirm-dialog-description"
                  className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
                >
                  {description}
                </p>
              </div>

              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 ${
                  variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
                    : variant === 'warning'
                    ? 'bg-amber-500 hover:bg-amber-600 text-brand-navy shadow-amber-900/20'
                    : 'bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-brand-gold/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{confirmLabel}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
