'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Calendar,
  Printer,
  Shield,
  Eye,
  Check,
  Sparkles,
  Layers,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {
  UniversalExportConfig,
  ExportFormat,
  ExportScope,
  ExportExecuteOptions,
  ExportPreset,
} from '@/lib/export';
import { maskPhoneNumber, maskEmail } from '@/lib/export/utils/piiSanitizer';

interface UniversalExportModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  config: UniversalExportConfig<T> | null;
  onExecute: (options: ExportExecuteOptions) => Promise<void>;
  isExporting?: boolean;
}

export default function UniversalExportModal<T = any>({
  isOpen,
  onClose,
  config,
  onExecute,
  isExporting = false,
}: UniversalExportModalProps<T>) {
  if (!isOpen || !config) return null;

  const {
    title,
    data,
    selectedIds = [],
    columns,
    presets = [],
    defaultFormat = 'csv',
  } = config;

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat);
  const [selectedScope, setSelectedScope] = useState<ExportScope>(
    selectedIds.length > 0 ? 'selected' : 'filtered'
  );
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(
    columns.filter((c) => c.defaultVisible !== false).map((c) => c.id)
  );
  const [maskPii, setMaskPii] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Compute scope count
  const scopeCount = useMemo(() => {
    if (selectedScope === 'selected') {
      return selectedIds.length;
    }
    return data.length;
  }, [selectedScope, selectedIds.length, data.length]);

  // Apply Preset
  const handleApplyPreset = (preset: ExportPreset<T>) => {
    setActivePresetId(preset.id);
    setSelectedFormat(preset.format);
    setVisibleColumnIds(preset.visibleColumnIds);
    if (preset.maskPii !== undefined) {
      setMaskPii(preset.maskPii);
    }
  };

  // Toggle Column
  const handleToggleColumn = (colId: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
    setActivePresetId(null);
  };

  // Select / Deselect All Columns
  const handleSelectAllColumns = (selectAll: boolean) => {
    if (selectAll) {
      setVisibleColumnIds(columns.map((c) => c.id));
    } else {
      setVisibleColumnIds([]);
    }
    setActivePresetId(null);
  };

  // Trigger Export
  const handleSubmit = async () => {
    if (visibleColumnIds.length === 0) {
      alert('Please select at least one column to export.');
      return;
    }

    await onExecute({
      format: selectedFormat,
      scope: selectedScope,
      visibleColumnIds,
      maskPii,
    });
  };

  // Format list
  const formatOptions: { id: ExportFormat; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'csv',
      label: 'CSV Spreadsheet',
      desc: 'Universal format with UTF-8 BOM for Excel & Google Sheets',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'xlsx',
      label: 'Excel Workbook (.xls)',
      desc: 'Styled multi-tab workbook with auto column widths',
      icon: <FileSpreadsheet className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'json',
      label: 'JSON Document',
      desc: 'Standardized schema with metadata & timestamp',
      icon: <FileCode className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'print',
      label: 'Print Layout',
      desc: 'Clean hardware/PDF printout with high contrast',
      icon: <Printer className="w-4 h-4 text-purple-500" />,
    },
  ];

  // Active columns for preview
  const activeCols = columns.filter((c) => visibleColumnIds.includes(c.id));
  const previewRows = data.slice(0, 3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-brand-cream/95 dark:bg-[#0b132b]/95 border border-brand-gold/30 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-scale-in text-neutral-800 dark:text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-gold/20 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-gold shadow-sm">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 id="export-dialog-title" className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                {title || 'Universal Data Export'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Configure format, data scope, column projection, and privacy sanitization
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close export dialog"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6">
          {/* 1. Workflow Presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block">
                Workflow Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                  const isActive = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                          : 'bg-black/5 dark:bg-white/5 border border-brand-gold/25 hover:border-brand-gold text-neutral-700 dark:text-neutral-300'
                      }`}
                      title={preset.description}
                    >
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      <span>{preset.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Choose File Format */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block">
              1. Choose File Format
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {formatOptions.map((fmt) => {
                const isSelected = selectedFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormat(fmt.id);
                      setActivePresetId(null);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/10 dark:bg-brand-gold/15 shadow-sm ring-1 ring-brand-gold/30'
                        : 'border-neutral-200 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-brand-gold/40'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white dark:bg-black/30 shrink-0 shadow-xs">
                      {fmt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          {fmt.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-gold" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                        {fmt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Scope & Record Count */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold block">
              2. Data Scope &amp; Target Count
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedScope('filtered')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedScope === 'filtered'
                    ? 'border-brand-gold bg-brand-gold/10 font-bold'
                    : 'border-neutral-200 dark:border-white/10 bg-black/5 dark:bg-white/5'
                }`}
              >
                <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                  Active Filtered Results
                </span>
                <span className="text-xs font-mono text-brand-gold font-bold">
                  {data.length} Records
                </span>
              </button>

              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={() => setSelectedScope('selected')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedScope === 'selected'
                    ? 'border-brand-gold bg-brand-gold/10 font-bold'
                    : 'border-neutral-200 dark:border-white/10 bg-black/5 dark:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <span className="block text-xs font-bold text-neutral-900 dark:text-white">
                  Selected Rows Only
                </span>
                <span className="text-xs font-mono text-brand-gold font-bold">
                  {selectedIds.length} Selected
                </span>
              </button>
            </div>
          </div>

          {/* 4. Column Selection & PII Protection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                3. Column Selection ({visibleColumnIds.length} of {columns.length})
              </span>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(true)}
                  className="text-brand-gold hover:underline font-semibold"
                >
                  Select All
                </button>
                <span className="text-neutral-400">·</span>
                <button
                  type="button"
                  onClick={() => handleSelectAllColumns(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 max-h-40 overflow-y-auto">
              {columns.map((col) => {
                const isChecked = visibleColumnIds.includes(col.id);
                return (
                  <label
                    key={col.id}
                    className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none hover:text-brand-gold transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleColumn(col.id)}
                      className="rounded border-brand-gold/40 text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="truncate" title={col.header}>
                      {col.header}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Privacy & PII Masking Switch */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/20">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    Sanitize &amp; Mask Sensitive PII
                  </span>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Masks phone numbers (+91 9847***123) and emails for safe volunteer or public sharing
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={maskPii}
                onChange={(e) => setMaskPii(e.target.checked)}
                className="w-4 h-4 rounded border-brand-gold/40 text-brand-gold focus:ring-brand-gold cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Live Output Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-gold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Data Preview ({previewRows.length} sample rows)</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPreview ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showPreview && (
              <div className="overflow-x-auto rounded-2xl border border-brand-gold/25 bg-black/10 dark:bg-white/5 max-h-36">
                <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-300">
                  <thead className="bg-black/20 dark:bg-black/40 text-[10px] uppercase font-bold text-brand-gold">
                    <tr>
                      {activeCols.map((c) => (
                        <th key={c.id} className="p-2 border-b border-brand-gold/20 whitespace-nowrap">
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        {activeCols.map((col) => {
                          let val = col.accessor(row, idx);
                          if (maskPii && col.isPii) {
                            if (typeof val === 'string' && val.includes('@')) {
                              val = maskEmail(val);
                            } else {
                              val = maskPhoneNumber(String(val));
                            }
                          }
                          return (
                            <td key={col.id} className="p-2 whitespace-nowrap text-[11px]">
                              {val !== null && val !== undefined ? String(val) : '—'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-brand-gold/20 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isExporting || visibleColumnIds.length === 0}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-lg shadow-brand-gold/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Preparing File...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  Download {selectedFormat.toUpperCase()} ({scopeCount} Records)
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
