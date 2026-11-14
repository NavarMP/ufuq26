'use client';

import React, { useRef, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  Plus,
  RotateCcw,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import ExportTriggerButton from '@/components/export/ExportTriggerButton';
import { ExportFormat } from '@/lib/export';

export type SortField = 'submittedAt' | 'fullName' | 'id' | 'status' | 'darsName' | 'darsDistrict';
export type SortOrder = 'asc' | 'desc';

interface RegistrationFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilterDrawer: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  onOpenCreateModal: () => void;
  onSyncCloud: () => void;
  isSyncing: boolean;
  onExportCSV: () => void;
  onQuickExport?: (format: ExportFormat) => void;
  onOpenDuplicates?: () => void;
  totalFilteredCount: number;
}

export default function RegistrationFiltersBar({
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilterDrawer,
  sortField,
  sortOrder,
  onSortChange,
  onOpenCreateModal,
  onSyncCloud,
  isSyncing,
  onExportCSV,
  onQuickExport,
  onOpenDuplicates,
  totalFilteredCount,
}: RegistrationFiltersBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search, 'Escape' to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        onSearchChange('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchChange]);

  const sortOptions: { label: string; field: SortField; order: SortOrder }[] = [
    { label: 'Newest First (Entry Time)', field: 'submittedAt', order: 'desc' },
    { label: 'Oldest First (Entry Time)', field: 'submittedAt', order: 'asc' },
    { label: 'Student Name (A → Z)', field: 'fullName', order: 'asc' },
    { label: 'Student Name (Z → A)', field: 'fullName', order: 'desc' },
    { label: 'Reference ID', field: 'id', order: 'asc' },
    { label: 'Dars Institution', field: 'darsName', order: 'asc' },
  ];

  const currentSortKey = `${sortField}_${sortOrder}`;

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* Search & Filter Drawer Trigger */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Omni-search: Name (EN/ML), Phone, Ref ID, Dars, Mudarris..."
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/50 shadow-sm"
          />
          {search ? (
            <button
              onClick={() => {
                onSearchChange('');
                searchInputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              title="Clear search (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-neutral-400 bg-black/5 dark:bg-white/10 rounded border border-black/10 dark:border-white/10">
              /
            </kbd>
          )}
        </div>

        {/* Filter Drawer Toggle Button */}
        <button
          onClick={onOpenFilterDrawer}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
            activeFilterCount > 0
              ? 'bg-brand-gold text-brand-navy border-brand-gold shadow-sm font-bold'
              : 'bg-black/5 dark:bg-white/5 border-brand-gold/20 text-neutral-700 dark:text-neutral-300 hover:border-brand-gold/40'
          }`}
          title="Open advanced filter drawer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-brand-navy text-brand-gold text-[10px] font-bold flex items-center justify-center font-mono">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort Selector */}
        <div className="relative shrink-0 hidden sm:block">
          <select
            value={currentSortKey}
            onChange={(e) => {
              const selected = sortOptions.find(
                (opt) => `${opt.field}_${opt.order}` === e.target.value
              );
              if (selected) {
                onSortChange(selected.field, selected.order);
              }
            }}
            className="pl-7 pr-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-xs text-neutral-700 dark:text-neutral-300 font-medium focus:outline-none focus:border-brand-gold cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option
                key={`${opt.field}_${opt.order}`}
                value={`${opt.field}_${opt.order}`}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="w-3 h-3 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Action Buttons: Add Registration, Sync, Export */}
      <div className="flex items-center gap-2 self-end md:self-auto overflow-x-auto w-full md:w-auto justify-end">
        {/* Duplicates Detector */}
        {onOpenDuplicates && (
          <button
            onClick={onOpenDuplicates}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 text-xs font-semibold border border-amber-500/25 transition-all shrink-0"
            title="Scan & resolve duplicate registrations"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Duplicates</span>
          </button>
        )}

        {/* Sync Cloud */}
        <button
          onClick={onSyncCloud}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-gold/15 text-neutral-700 dark:text-neutral-300 text-xs font-semibold border border-brand-gold/20 transition-all shrink-0 disabled:opacity-50"
          title="Fetch latest registrations from Firestore"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-brand-gold' : ''}`} />
          <span className="hidden sm:inline">Sync Cloud</span>
        </button>

        {/* Export Suite Trigger with Quick Menu */}
        <ExportTriggerButton
          label="Export"
          count={totalFilteredCount}
          onOpenModal={onExportCSV}
          onQuickExport={onQuickExport}
        />

        {/* Add Registration Modal Trigger */}
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow-md hover:bg-brand-gold-hover transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Registration</span>
        </button>
      </div>
    </div>
  );
}
