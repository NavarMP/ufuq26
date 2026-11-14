'use client';

import React from 'react';
import { Loader2, AlertCircle, XCircle } from 'lucide-react';
import { BatchProgressInfo } from '@/lib/batch/firestoreBatchService';

export interface BatchProgressHUDProps {
  isOpen: boolean;
  title?: string;
  progress: BatchProgressInfo | null;
  onCancel?: () => void;
}

export default function BatchProgressHUD({
  isOpen,
  title = 'Processing Batch Operations...',
  progress,
  onCancel,
}: BatchProgressHUDProps) {
  if (!isOpen || !progress) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">{title}</h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Atomic Firestore Sync (Chunk {progress.currentChunk} of {progress.totalChunks})
              </p>
            </div>
          </div>

          <span className="text-sm font-bold font-mono text-brand-gold">
            {progress.percentage}%
          </span>
        </div>

        {/* Progress Track */}
        <div className="space-y-1.5">
          <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div
              className="bg-gradient-to-r from-brand-gold via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
            <span>
              {progress.completed} of {progress.total} items
            </span>
            <span>
              {progress.isFinished ? 'Finalizing...' : 'Syncing in real-time'}
            </span>
          </div>
        </div>

        {/* Errors if any */}
        {progress.hasErrors && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{progress.errorSummary || 'Some operations encountered errors'}</span>
          </div>
        )}

        {/* Cancel Button */}
        {onCancel && !progress.isFinished && (
          <div className="flex justify-end pt-2 border-t border-white/10">
            <button
              onClick={onCancel}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Abort Operation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
