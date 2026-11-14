'use client';

import React, { useState } from 'react';
import {
  X,
  Edit3,
  Download,
  Trash2,
  CheckSquare,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface UniversalBulkDockProps {
  selectedCount: number;
  totalFilteredCount?: number;
  isAllFilteredSelected?: boolean;
  onSelectAllFiltered?: () => void;
  onClearSelection: () => void;
  onInvertSelection?: () => void;
  onOpenBatchEdit?: () => void;
  onOpenExport?: () => void;
  onDelete?: () => void;
  primaryActions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  deleteLabel?: string;
  itemLabel?: string;
  className?: string;
}

export default function UniversalBulkDock({
  selectedCount,
  totalFilteredCount,
  isAllFilteredSelected,
  onSelectAllFiltered,
  onClearSelection,
  onInvertSelection,
  onOpenBatchEdit,
  onOpenExport,
  onDelete,
  primaryActions,
  secondaryActions,
  deleteLabel = 'Delete',
  itemLabel = 'items',
  className = '',
}: UniversalBulkDockProps) {
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(false);

  if (selectedCount === 0) return null;

  const showSelectAllPrompt =
    totalFilteredCount !== undefined &&
    totalFilteredCount > selectedCount &&
    onSelectAllFiltered &&
    !isAllFilteredSelected;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-5xl w-[94%] sm:w-auto animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto ${className}`}
    >
      <div className="flex flex-col gap-1.5 items-center">
        {/* Banner prompt when partial selection of filtered list */}
        {showSelectAllPrompt && (
          <div className="bg-neutral-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-brand-gold/30 shadow-lg text-[11px] text-neutral-300 flex items-center gap-2 animate-fade-in">
            <span>
              {selectedCount} on this page selected.
            </span>
            <button
              onClick={onSelectAllFiltered}
              className="font-bold text-brand-gold hover:underline flex items-center gap-1"
            >
              <span>Select all {totalFilteredCount} matching {itemLabel}</span>
            </button>
          </div>
        )}

        {/* Master Floating Dock */}
        <div className="bg-neutral-950/95 dark:bg-black/95 text-white backdrop-blur-xl px-4 py-3 rounded-2xl border border-brand-gold/40 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Count Badge & Clear */}
          <div className="flex items-center gap-2.5 pr-3 border-r border-white/15">
            <div className="flex items-center gap-1.5 bg-brand-gold/15 px-2.5 py-1 rounded-xl border border-brand-gold/30">
              <span className="font-mono font-bold text-brand-gold text-sm">
                {selectedCount}
              </span>
              <span className="text-neutral-300 text-[11px] font-medium lowercase">
                {itemLabel}
              </span>
            </div>

            <button
              onClick={onClearSelection}
              className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors"
              title="Deselect all"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {onInvertSelection && (
              <button
                onClick={onInvertSelection}
                className="p-1.5 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors hidden sm:inline-flex"
                title="Invert selection"
              >
                <CheckSquare className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary Action Buttons Slot */}
          {primaryActions && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {primaryActions}
            </div>
          )}

          {/* Common Utility Actions */}
          <div className="flex items-center gap-1.5 flex-wrap pl-1 sm:border-l border-white/15">
            {/* Batch Field Edit Trigger */}
            {onOpenBatchEdit && (
              <button
                onClick={onOpenBatchEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-[11px] border border-white/15 transition-all shadow-sm"
                title="Batch Edit Fields"
              >
                <Edit3 className="w-3 h-3 text-brand-gold" />
                <span>Batch Edit</span>
              </button>
            )}

            {/* Universal Export Trigger */}
            {onOpenExport && (
              <button
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-[11px] border border-white/15 transition-all shadow-sm"
                title="Export Selected"
              >
                <Download className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {/* Secondary Actions Dropdown or Slot */}
            {secondaryActions && (
              <div className="relative">
                <button
                  onClick={() => setShowSecondaryMenu((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-[11px] border border-white/15 transition-all"
                  title="More actions"
                >
                  <Layers className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showSecondaryMenu ? 'rotate-180' : ''}`} />
                </button>

                {showSecondaryMenu && (
                  <div
                    className="absolute bottom-full mb-2 right-0 bg-neutral-900 border border-brand-gold/30 rounded-xl shadow-2xl p-2 min-w-[200px] flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setShowSecondaryMenu(false)}
                  >
                    {secondaryActions}
                  </div>
                )}
              </div>
            )}

            {/* Destructive Delete Action */}
            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 font-semibold text-[11px] border border-rose-500/30 transition-colors ml-1"
                title={deleteLabel}
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">{deleteLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
