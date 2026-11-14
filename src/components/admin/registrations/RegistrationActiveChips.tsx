'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  status: string[]; // ['confirmed', 'pending', 'cancelled']
  darsId: string;
  district: string;
  category: string;
  contactType: 'all' | 'has_email' | 'phone_only';
  dateRange: 'all' | 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'custom';
  customStartDate: string;
  customEndDate: string;
}

interface RegistrationActiveChipsProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState, value?: any) => void;
  onClearAll: () => void;
  filteredCount: number;
  totalCount: number;
  darsNameMap: Record<string, string>;
}

export default function RegistrationActiveChips({
  filters,
  onRemoveFilter,
  onClearAll,
  filteredCount,
  totalCount,
  darsNameMap,
}: RegistrationActiveChipsProps) {
  const chips: { key: keyof FilterState; label: string; value?: any }[] = [];

  if (filters.search.trim()) {
    chips.push({
      key: 'search',
      label: `Search: "${filters.search}"`,
    });
  }

  if (filters.darsId) {
    const darsLabel = darsNameMap[filters.darsId] || filters.darsId;
    chips.push({
      key: 'darsId',
      label: `Dars: ${darsLabel}`,
    });
  }

  if (filters.district) {
    chips.push({
      key: 'district',
      label: `District: ${filters.district}`,
    });
  }

  if (filters.category) {
    chips.push({
      key: 'category',
      label: `Category: ${filters.category.toUpperCase()}`,
    });
  }

  if (filters.contactType !== 'all') {
    chips.push({
      key: 'contactType',
      label: filters.contactType === 'has_email' ? 'Has Email' : 'Phone Only',
    });
  }

  if (filters.dateRange !== 'all') {
    let dateLabel = '';
    if (filters.dateRange === 'today') dateLabel = 'Date: Today';
    else if (filters.dateRange === 'yesterday') dateLabel = 'Date: Yesterday';
    else if (filters.dateRange === 'last_7_days') dateLabel = 'Date: Last 7 Days';
    else if (filters.dateRange === 'last_30_days') dateLabel = 'Date: Last 30 Days';
    else if (filters.dateRange === 'custom') {
      dateLabel = `Date: ${filters.customStartDate || '...'} to ${filters.customEndDate || '...'}`;
    }
    chips.push({
      key: 'dateRange',
      label: dateLabel,
    });
  }

  if (chips.length === 0) {
    return (
      <div className="flex items-center justify-between text-xs text-neutral-500 py-1">
        <span>
          Showing <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{filteredCount}</span> of{' '}
          <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{totalCount}</span> entries
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-1 text-xs">
      <span className="text-neutral-500 text-[11px]">
        Showing <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{filteredCount}</span> of{' '}
        <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{totalCount}</span>:
      </span>

      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-gold/15 text-brand-gold-dark dark:text-brand-gold border border-brand-gold/25 text-[11px] font-medium"
        >
          <span>{chip.label}</span>
          <button
            onClick={() => onRemoveFilter(chip.key, chip.value)}
            className="hover:bg-brand-gold/20 rounded p-0.5 transition-colors"
            title="Remove filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-rose-500 transition-colors ml-1 font-semibold"
        title="Reset all filters"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Reset all</span>
      </button>
    </div>
  );
}
