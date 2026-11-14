'use client';

import React from 'react';
import { SuffaDars } from '@/types';
import { FilterState } from './RegistrationActiveChips';
import { KERALA_DISTRICTS, CATEGORY_OPTIONS } from './registrationUtils';
import { X, Filter, RotateCcw, Check, Calendar, Building2, MapPin, Tag, Mail, ShieldAlert } from 'lucide-react';

interface RegistrationFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  darsList: SuffaDars[];
  darsCounts: Record<string, number>;
}

export default function RegistrationFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  darsList,
  darsCounts,
}: RegistrationFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-brand-gold/20">
          {/* Header */}
          <div className="px-6 py-5 border-b border-brand-gold/15 flex items-center justify-between bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Filter Registrations
                </h3>
                <p className="text-[11px] text-neutral-400">Refine dataset across multiple dimensions</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Date Range Presets & Custom Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                <span>Submission Date Range</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: 'last_7_days', label: 'Last 7 Days' },
                  { id: 'last_30_days', label: 'Last 30 Days' },
                  { id: 'custom', label: 'Custom' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onFilterChange('dateRange', item.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                      filters.dateRange === item.id
                        ? 'bg-brand-gold text-brand-navy font-bold border-brand-gold shadow'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-300 hover:border-brand-gold/30'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {filters.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">From Date</span>
                    <input
                      type="date"
                      value={filters.customStartDate}
                      onChange={(e) => onFilterChange('customStartDate', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-1">To Date</span>
                    <input
                      type="date"
                      value={filters.customEndDate}
                      onChange={(e) => onFilterChange('customEndDate', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. SUFFA Dars Center */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                  <span>SUFFA Dars Institution</span>
                </span>
                {filters.darsId && (
                  <button
                    onClick={() => onFilterChange('darsId', '')}
                    className="text-[10px] text-brand-gold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </label>
              <select
                value={filters.darsId}
                onChange={(e) => onFilterChange('darsId', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="">All SUFFA Dars Centers ({darsList.length})</option>
                {darsList.map((dars) => {
                  const count = darsCounts[dars.regNo] || darsCounts[dars.id] || 0;
                  return (
                    <option key={dars.id} value={dars.regNo}>
                      [{dars.regNo}] {dars.nameEn} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 3. Kerala District */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                  <span>District (Kerala)</span>
                </span>
                {filters.district && (
                  <button
                    onClick={() => onFilterChange('district', '')}
                    className="text-[10px] text-brand-gold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </label>
              <select
                value={filters.district}
                onChange={(e) => onFilterChange('district', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
              >
                <option value="">All Districts</option>
                {KERALA_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Attendee Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-gold" />
                <span>Attendee Category</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onFilterChange('category', '')}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between ${
                    !filters.category
                      ? 'bg-brand-gold/20 text-brand-gold border-brand-gold font-bold'
                      : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  <span>All Categories</span>
                  {!filters.category && <Check className="w-3 h-3" />}
                </button>
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => onFilterChange('category', cat.value)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between ${
                      filters.category === cat.value
                        ? 'bg-brand-gold/20 text-brand-gold border-brand-gold font-bold'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {filters.category === cat.value && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Contact Completeness */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-gold" />
                <span>Contact Completeness</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'All Contacts' },
                  { id: 'has_email', label: 'Has Email' },
                  { id: 'phone_only', label: 'Phone Only' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onFilterChange('contactType', item.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                      filters.contactType === item.id
                        ? 'bg-brand-gold text-brand-navy font-bold border-brand-gold shadow'
                        : 'bg-black/5 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-brand-gold/15 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3">
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
