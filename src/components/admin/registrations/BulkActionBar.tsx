'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Archive,
  RotateCcw,
  Trash2,
  Download,
  Copy,
  Check,
  X,
  Phone,
  Printer,
} from 'lucide-react';

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatus: (status: 'pending' | 'confirmed' | 'cancelled') => void;
  onBulkArchive: () => void;
  onBulkUnarchive: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onCopyPhoneNumbers: () => void;
  onBulkPrintBadges?: () => void;
  isArchivedView: boolean;
}

export default function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkStatus,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onBulkExport,
  onCopyPhoneNumbers,
  onBulkPrintBadges,
  isArchivedView,
}: BulkActionBarProps) {
  const [copiedPhones, setCopiedPhones] = useState(false);

  if (selectedCount === 0) return null;

  const handleCopyPhones = () => {
    onCopyPhoneNumbers();
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-5 duration-200">
      <div className="bg-neutral-900/95 dark:bg-black/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl border border-brand-gold/40 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Count & Clear */}
        <div className="flex items-center gap-2 pr-3 border-r border-white/10">
          <span className="font-mono font-bold text-brand-gold">
            {selectedCount}
          </span>
          <span className="text-neutral-300 text-[11px]">selected</span>
          <button
            onClick={onClearSelection}
            className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Deselect all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Status Buttons */}
          <button
            onClick={() => onBulkStatus('confirmed')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold text-[11px] border border-emerald-500/30 transition-colors"
            title="Mark selected as Confirmed"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirm</span>
          </button>

          <button
            onClick={() => onBulkStatus('pending')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-semibold text-[11px] border border-amber-500/30 transition-colors"
            title="Mark selected as Pending"
          >
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </button>

          <button
            onClick={() => onBulkStatus('cancelled')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold text-[11px] border border-rose-500/30 transition-colors"
            title="Mark selected as Cancelled"
          >
            <XCircle className="w-3 h-3" />
            <span>Cancel</span>
          </button>

          {/* Copy WhatsApp Numbers */}
          <button
            onClick={handleCopyPhones}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-semibold text-[11px] transition-colors"
            title="Copy clean phone numbers for WhatsApp broadcast"
          >
            {copiedPhones ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Phone className="w-3 h-3 text-emerald-400" />
            )}
            <span>{copiedPhones ? 'Copied!' : 'Copy Numbers'}</span>
          </button>

          {/* Export Selected CSV */}
          <button
            onClick={onBulkExport}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-semibold text-[11px] transition-colors"
            title="Export selected registrations to CSV"
          >
            <Download className="w-3 h-3 text-brand-gold" />
            <span>Export</span>
          </button>

          {/* Batch Print Badges */}
          {onBulkPrintBadges && (
            <button
              onClick={onBulkPrintBadges}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-[11px] shadow transition-transform hover:scale-105 active:scale-95"
              title="Print Plastic Card ID Badges for selected attendees"
            >
              <Printer className="w-3 h-3" />
              <span>Print Badges</span>
            </button>
          )}

          {/* Archive / Restore Selected */}
          {isArchivedView ? (
            <button
              onClick={onBulkUnarchive}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] transition-colors"
              title="Restore selected to active pool"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore</span>
            </button>
          ) : (
            <button
              onClick={onBulkArchive}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-[11px] transition-colors"
              title="Archive selected registrations (safe)"
            >
              <Archive className="w-3 h-3" />
              <span>Archive</span>
            </button>
          )}

          {/* Delete Selected (Permanent) */}
          <button
            onClick={onBulkDelete}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-semibold text-[11px] border border-rose-500/30 transition-colors"
            title="Permanently delete selected records"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
