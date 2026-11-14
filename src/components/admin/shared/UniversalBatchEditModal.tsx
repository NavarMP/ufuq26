'use client';

import React, { useState } from 'react';
import { Edit3, CheckSquare, Square, X, AlertCircle } from 'lucide-react';

export interface BatchFieldDefinition {
  key: string;
  label: string;
  type: 'select' | 'text' | 'boolean' | 'number';
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  helperText?: string;
}

export interface UniversalBatchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (updates: Record<string, any>) => Promise<void>;
  fields: BatchFieldDefinition[];
  selectedCount: number;
  itemLabel?: string;
}

export default function UniversalBatchEditModal({
  isOpen,
  onClose,
  onApply,
  fields,
  selectedCount,
  itemLabel = 'items',
}: UniversalBatchEditModalProps) {
  // Enabled fields map: fieldKey -> boolean
  const [enabledFields, setEnabledFields] = useState<Record<string, boolean>>({});
  // Form values map: fieldKey -> value
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleField = (key: string, defaultValue?: any) => {
    setEnabledFields((prev) => {
      const next = !prev[key];
      if (next && fieldValues[key] === undefined && defaultValue !== undefined) {
        setFieldValues((v) => ({ ...v, [key]: defaultValue }));
      }
      return { ...prev, [key]: next };
    });
  };

  const handleValueChange = (key: string, val: any) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleApply = async () => {
    setError(null);
    const activeKeys = Object.keys(enabledFields).filter((k) => enabledFields[k]);
    if (activeKeys.length === 0) {
      setError('Please select at least one field to update.');
      return;
    }

    const payload: Record<string, any> = {};
    for (const key of activeKeys) {
      if (fieldValues[key] !== undefined) {
        payload[key] = fieldValues[key];
      }
    }

    setIsSubmitting(true);
    try {
      await onApply(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to apply batch changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedFieldsCount = Object.values(enabledFields).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 text-brand-gold border border-brand-gold/30 flex items-center justify-center">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                Batch Edit Fields
              </h3>
              <p className="text-xs text-neutral-400">
                Bulk modifying{' '}
                <span className="font-mono font-bold text-brand-gold">
                  {selectedCount}
                </span>{' '}
                {itemLabel}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-neutral-300">
          Check the box next to each field you want to batch update. Only checked fields will be overwritten.
        </p>

        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Fields List */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {fields.map((field) => {
            const isEnabled = !!enabledFields[field.key];
            const defaultValue =
              field.type === 'boolean'
                ? true
                : field.options && field.options.length > 0
                ? field.options[0].value
                : '';

            return (
              <div
                key={field.key}
                className={`p-3.5 rounded-xl border transition-all ${
                  isEnabled
                    ? 'bg-neutral-800/80 border-brand-gold/50 shadow-sm'
                    : 'bg-neutral-950/40 border-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => toggleField(field.key, defaultValue)}
                    className="flex items-center gap-2 text-xs font-semibold text-neutral-200 select-none"
                  >
                    {isEnabled ? (
                      <CheckSquare className="w-4 h-4 text-brand-gold" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-500" />
                    )}
                    <span>{field.label}</span>
                  </button>

                  {field.helperText && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {field.helperText}
                    </span>
                  )}
                </div>

                {isEnabled && (
                  <div className="pt-2 pl-6">
                    {field.type === 'select' ? (
                      <select
                        value={fieldValues[field.key] ?? defaultValue}
                        onChange={(e) => handleValueChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-brand-gold/30 text-xs text-neutral-100 focus:outline-none focus:border-brand-gold"
                      >
                        {field.options?.map((opt) => (
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'boolean' ? (
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                          <input
                            type="radio"
                            name={`bool_${field.key}`}
                            checked={fieldValues[field.key] === true}
                            onChange={() => handleValueChange(field.key, true)}
                            className="accent-brand-gold"
                          />
                          <span>True / Enabled</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                          <input
                            type="radio"
                            name={`bool_${field.key}`}
                            checked={fieldValues[field.key] === false}
                            onChange={() => handleValueChange(field.key, false)}
                            className="accent-brand-gold"
                          />
                          <span>False / Disabled</span>
                        </label>
                      </div>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={fieldValues[field.key] ?? ''}
                        onChange={(e) =>
                          handleValueChange(
                            field.key,
                            field.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        placeholder={field.placeholder || `Enter new ${field.label.toLowerCase()}...`}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-brand-gold/30 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-xs text-neutral-400 font-mono">
            {selectedFieldsCount} field{selectedFieldsCount !== 1 ? 's' : ''} queued
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={isSubmitting || selectedFieldsCount === 0}
              className="px-4 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>
                {isSubmitting ? 'Updating...' : `Apply to ${selectedCount} ${itemLabel}`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
