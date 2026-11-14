'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SuffaDars } from '@/types';
import {
  Search,
  Check,
  ChevronDown,
  X,
  Building2,
  CheckCircle2,
  UserCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface DarsComboboxProps {
  darsList: SuffaDars[];
  selectedDarsId: string;
  onSelect: (dars: SuffaDars | null) => void;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function DarsCombobox({
  darsList,
  selectedDarsId,
  onSelect,
  error,
  label = 'SUFFA Dars Institution',
  required = true,
  disabled = false,
  placeholder = 'Search by Dars name, Malayalam, Mudarris, or Reg No (e.g. SDC01)...',
}: DarsComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Find currently selected Dars
  const selectedDars = useMemo(
    () => darsList.find((d) => d.id === selectedDarsId || d.regNo === selectedDarsId) || null,
    [darsList, selectedDarsId]
  );

  // Filtered Dars list based on multi-field query
  const filteredDars = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return darsList;

    return darsList.filter((dars) => {
      const matchEn = dars.nameEn.toLowerCase().includes(q);
      const matchMl = (dars.nameMl || '').toLowerCase().includes(q);
      const matchMudarris = (dars.mudarris || '').toLowerCase().includes(q);
      const matchReg = (dars.regNo || '').toLowerCase().includes(q);
      const matchDistrict = (dars.district || '').toLowerCase().includes(q);
      return matchEn || matchMl || matchMudarris || matchReg || matchDistrict;
    });
  }, [darsList, searchQuery]);

  // Keep highlighted index in bounds
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % (filteredDars.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? (filteredDars.length ? filteredDars.length - 1 : 0) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredDars.length > 0 && filteredDars[highlightedIndex]) {
        handleSelect(filteredDars[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleSelect = (dars: SuffaDars) => {
    onSelect(dars);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSelect(null);
    setSearchQuery('');
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={containerRef} className="space-y-1.5 text-left rtl:text-right relative">
      {/* Field Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="dars-combobox-input"
          className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[10px] text-neutral-400 font-mono">
          {darsList.length} SUFFA Centers Registered
        </span>
      </div>

      {/* Selected Card View */}
      {selectedDars ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-gold/15 via-brand-gold/10 to-transparent border border-brand-gold/40 shadow-sm transition-all hover:border-brand-gold">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-navy font-mono font-bold text-[11px] shadow-sm">
                  {selectedDars.regNo}
                </span>
                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {selectedDars.nameEn}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium font-arabic">
                  ({selectedDars.nameMl})
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 pt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span className="font-medium text-neutral-500 dark:text-neutral-400 text-[11px]">
                  Mudarris:
                </span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-xs">
                  {selectedDars.mudarris}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-black/60 border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-brand-gold transition-colors shrink-0 shadow-sm"
              title="Change selected Dars"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Change</span>
            </button>
          </div>
        </div>
      ) : (
        /* Search Input Box */
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-brand-gold absolute left-3.5 pointer-events-none" />
            <input
              ref={inputRef}
              id="dars-combobox-input"
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls="dars-combobox-list"
              disabled={disabled}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={`w-full pl-10 pr-10 py-3 rounded-2xl bg-white/70 dark:bg-black/50 border ${
                error
                  ? 'border-rose-500'
                  : 'border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
              } text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all shadow-inner`}
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-3.5 p-1 text-neutral-400 hover:text-brand-gold"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-gold' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {/* Floating Dropdown List */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 rounded-2xl glass-panel border border-brand-gold/35 shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in">
              <div className="p-2.5 bg-brand-gold/10 border-b border-brand-gold/15 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                  <span>SUFFA Dars Directory</span>
                </span>
                <span className="font-mono text-neutral-400">
                  {filteredDars.length} matching
                </span>
              </div>

              {filteredDars.length === 0 ? (
                <div className="p-6 text-center space-y-2">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    No registered SUFFA Dars found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <p className="text-[11px] text-brand-gold font-medium">
                    Try searching by town, Mudarris name, or Reg Code (e.g. SDC01)
                  </p>
                </div>
              ) : (
                <ul
                  ref={listRef}
                  id="dars-combobox-list"
                  role="listbox"
                  className="max-h-64 overflow-y-auto divide-y divide-brand-gold/10 py-1 no-scrollbar"
                >
                  {filteredDars.map((dars, index) => {
                    const isHighlighted = index === highlightedIndex;
                    const isSelected =
                      selectedDarsId === dars.id || selectedDarsId === dars.regNo;

                    return (
                      <li
                        key={dars.id || dars.regNo}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(dars)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`px-3.5 py-2.5 cursor-pointer transition-colors text-left rtl:text-right ${
                          isHighlighted
                            ? 'bg-brand-gold/20 dark:bg-brand-gold/15'
                            : 'hover:bg-brand-gold/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2 py-0.5 rounded-md bg-brand-gold/25 border border-brand-gold/30 text-brand-navy dark:text-brand-gold font-mono font-bold text-[10px]">
                                {dars.regNo}
                              </span>
                              <span className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                                {dars.nameEn}
                              </span>
                              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                {dars.nameMl}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              <span className="font-medium text-neutral-400">Mudarris:</span>
                              <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate">
                                {dars.mudarris}
                              </span>
                            </div>
                          </div>

                          {isSelected && (
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
