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
  Send,
  Edit3,
  MessageSquare,
  DoorOpen,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import UniversalBulkDock from '../shared/UniversalBulkDock';

interface BulkActionBarProps {
  selectedCount: number;
  totalFilteredCount?: number;
  isAllFilteredSelected?: boolean;
  onSelectAllFiltered?: () => void;
  onClearSelection: () => void;
  onInvertSelection?: () => void;
  onOpenBatchEdit?: () => void;
  onOpenWhatsApp?: () => void;
  onBulkStatus: (status: 'pending' | 'confirmed' | 'cancelled') => void;
  onBulkGateStatus?: (gateStatus: 'inside' | 'outside') => void;
  onBulkArchive: () => void;
  onBulkUnarchive: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onCopyPhoneNumbers: () => void;
  onBulkPrintBadges?: () => void;
  onBulkSendNotice?: () => void;
  isArchivedView: boolean;
}

export default function BulkActionBar({
  selectedCount,
  totalFilteredCount,
  isAllFilteredSelected,
  onSelectAllFiltered,
  onClearSelection,
  onInvertSelection,
  onOpenBatchEdit,
  onOpenWhatsApp,
  onBulkStatus,
  onBulkGateStatus,
  onBulkArchive,
  onBulkUnarchive,
  onBulkDelete,
  onBulkExport,
  onCopyPhoneNumbers,
  onBulkPrintBadges,
  onBulkSendNotice,
  isArchivedView,
}: BulkActionBarProps) {
  const [copiedPhones, setCopiedPhones] = useState(false);

  if (selectedCount === 0) return null;

  const handleCopyPhones = () => {
    onCopyPhoneNumbers();
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2000);
  };

  const primaryActions = (
    <>
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

      {/* WhatsApp Dispatch Hub Trigger */}
      {onOpenWhatsApp && (
        <button
          onClick={onOpenWhatsApp}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30 transition-colors"
          title="WhatsApp Dispatch & Broadcast Hub"
        >
          <MessageSquare className="w-3 h-3" />
          <span>WhatsApp Hub</span>
        </button>
      )}

      {/* Print Badges */}
      {onBulkPrintBadges && (
        <button
          onClick={onBulkPrintBadges}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-[11px] shadow transition-transform active:scale-95"
          title="Print Plastic Card ID Badges"
        >
          <Printer className="w-3 h-3" />
          <span>Print Badges</span>
        </button>
      )}
    </>
  );

  const secondaryActions = (
    <div className="flex flex-col gap-1 text-xs">
      {/* Copy WhatsApp Numbers */}
      <button
        onClick={handleCopyPhones}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-200 text-left transition-colors"
      >
        {copiedPhones ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{copiedPhones ? 'Copied Phone CSV!' : 'Copy Phone Numbers CSV'}</span>
      </button>

      {/* Gate Status Toggles */}
      {onBulkGateStatus && (
        <>
          <button
            onClick={() => onBulkGateStatus('inside')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-emerald-400 text-left transition-colors"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Mark Inside Campus</span>
          </button>
          <button
            onClick={() => onBulkGateStatus('outside')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-neutral-300 text-left transition-colors"
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Mark Outside Campus</span>
          </button>
        </>
      )}

      {/* Omnichannel Broadcast Notice */}
      {onBulkSendNotice && (
        <button
          onClick={onBulkSendNotice}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-brand-gold text-left transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Broadcast Omnichannel Notice</span>
        </button>
      )}

      {/* Archive / Restore */}
      {isArchivedView ? (
        <button
          onClick={onBulkUnarchive}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-emerald-400 text-left transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore to Active</span>
        </button>
      ) : (
        <button
          onClick={onBulkArchive}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-amber-400 text-left transition-colors"
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Archive Selected</span>
        </button>
      )}
    </div>
  );

  return (
    <UniversalBulkDock
      selectedCount={selectedCount}
      totalFilteredCount={totalFilteredCount}
      isAllFilteredSelected={isAllFilteredSelected}
      onSelectAllFiltered={onSelectAllFiltered}
      onClearSelection={onClearSelection}
      onInvertSelection={onInvertSelection}
      onOpenBatchEdit={onOpenBatchEdit}
      onOpenExport={onBulkExport}
      onDelete={onBulkDelete}
      primaryActions={primaryActions}
      secondaryActions={secondaryActions}
      deleteLabel="Purge"
      itemLabel="delegates"
    />
  );
}
