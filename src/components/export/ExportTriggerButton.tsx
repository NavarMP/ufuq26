'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileCode,
  Printer,
  Sparkles,
} from 'lucide-react';
import { ExportFormat } from '@/lib/export';

interface ExportTriggerButtonProps {
  label?: string;
  count?: number;
  onOpenModal: () => void;
  onQuickExport?: (format: ExportFormat) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass';
}

export default function ExportTriggerButton({
  label = 'Export',
  count,
  onOpenModal,
  onQuickExport,
  className = '',
  variant = 'secondary',
}: ExportTriggerButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variantStyles = {
    primary: 'bg-brand-gold text-brand-navy hover:bg-brand-gold-hover font-bold shadow-md',
    secondary: 'bg-black/5 dark:bg-white/5 hover:bg-brand-gold/15 text-neutral-700 dark:text-neutral-300 border border-brand-gold/20 font-semibold',
    glass: 'glass-panel border border-brand-gold/30 hover:border-brand-gold text-neutral-800 dark:text-neutral-200',
  };

  return (
    <div className={`relative inline-flex items-center rounded-xl shadow-xs ${className}`} ref={containerRef}>
      {/* Main Button (Triggers Universal Dialog) */}
      <button
        type="button"
        onClick={onOpenModal}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-l-xl text-xs transition-all ${variantStyles[variant]}`}
        title="Open Universal Export & Download Suite"
      >
        <Download className="w-3.5 h-3.5 text-brand-gold shrink-0" />
        <span>{label}</span>
        {count !== undefined && (
          <span className="font-mono text-[11px] opacity-80">({count})</span>
        )}
      </button>

      {/* Dropdown Toggle */}
      {onQuickExport && (
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`p-2 rounded-r-xl border-l border-brand-gold/20 text-xs transition-all ${variantStyles[variant]}`}
          title="Quick Export Options"
          aria-expanded={dropdownOpen}
        >
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>
      )}

      {/* Quick Dropdown Menu */}
      {dropdownOpen && onQuickExport && (
        <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white dark:bg-[#101d32] border border-brand-gold/35 shadow-2xl p-1.5 z-50 animate-scale-in text-neutral-800 dark:text-neutral-200">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-gold border-b border-brand-gold/15 mb-1">
            Quick One-Click Export
          </div>

          <button
            type="button"
            onClick={() => {
              onQuickExport('csv');
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 hover:text-brand-gold transition-colors text-left"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Quick CSV (.csv)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onQuickExport('xlsx');
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 hover:text-brand-gold transition-colors text-left"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            <span>Excel Workbook (.xls)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onQuickExport('json');
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs hover:bg-brand-gold/15 hover:text-brand-gold transition-colors text-left"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-500" />
            <span>JSON Backup (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onOpenModal();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold text-brand-gold hover:bg-brand-gold/20 transition-colors text-left mt-1 border-t border-brand-gold/15"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Customize Columns &amp; PDF...</span>
          </button>
        </div>
      )}
    </div>
  );
}
