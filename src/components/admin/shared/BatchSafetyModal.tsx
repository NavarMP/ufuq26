'use client';

import React, { useState } from 'react';
import { AlertTriangle, Trash2, CheckCircle2, X } from 'lucide-react';

export interface BatchSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  itemCount: number;
  itemLabel?: string;
  sampleItems?: string[];
  isDestructive?: boolean;
  requiresTypeConfirm?: boolean;
}

export default function BatchSafetyModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemCount,
  itemLabel = 'records',
  sampleItems = [],
  isDestructive = true,
  requiresTypeConfirm = false,
}: BatchSafetyModalProps) {
  const [confirmInput, setConfirmInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const mustTypeConfirm = requiresTypeConfirm && itemCount > 5;
  const canConfirm = !mustTypeConfirm || confirmInput.trim().toUpperCase() === 'DELETE' || confirmInput.trim().toUpperCase() === 'CONFIRM';

  const handleConfirm = async () => {
    if (!canConfirm || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setConfirmInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDestructive
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
              }`}
            >
              {isDestructive ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">{title}</h3>
              <p className="text-xs text-neutral-400">
                Affecting{' '}
                <span className="font-mono font-bold text-brand-gold">
                  {itemCount}
                </span>{' '}
                {itemLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-300 leading-relaxed">
          {description}
        </p>

        {/* Sample Affected Items */}
        {sampleItems.length > 0 && (
          <div className="bg-neutral-950/60 rounded-xl p-3 border border-white/10 text-xs space-y-1.5">
            <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 tracking-wider">
              Sample Affected Entries:
            </span>
            <ul className="list-disc list-inside text-neutral-300 space-y-0.5 text-[11px] truncate">
              {sampleItems.slice(0, 4).map((name, i) => (
                <li key={i} className="truncate">{name}</li>
              ))}
              {itemCount > 4 && (
                <li className="text-neutral-500 italic">
                  + {itemCount - 4} more {itemLabel}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Type confirmation safeguard if large deletion */}
        {mustTypeConfirm && (
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] text-neutral-400 font-mono">
              Type <strong className="text-rose-400">CONFIRM</strong> to authorize this bulk action:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="CONFIRM"
              className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-rose-500/40 text-xs text-rose-300 font-mono tracking-widest placeholder-neutral-600 focus:outline-none focus:border-rose-400"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || isSubmitting}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                : 'bg-brand-gold hover:bg-brand-gold/90 text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {isDestructive ? (
              <Trash2 className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>
              {isSubmitting ? 'Executing...' : `Confirm (${itemCount})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
