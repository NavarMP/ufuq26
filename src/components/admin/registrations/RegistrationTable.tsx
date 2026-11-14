'use client';

import React, { useState } from 'react';
import { Registration } from '@/types';
import { SortField, SortOrder } from './RegistrationFiltersBar';
import {
  formatExactDateTime,
  formatRelativeTime,
  getWhatsAppUrl,
} from './registrationUtils';
import {
  Clock,
  Phone,
  Mail,
  Copy,
  Check,
  Eye,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  ArrowUp,
  ArrowDown,
  Building2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface RegistrationTableProps {
  registrations: Registration[];
  selectedIds: string[];
  onToggleSelect: (id: string, index?: number, event?: React.MouseEvent | React.ChangeEvent) => void;
  onSelectAll: (all: boolean) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortToggle: (field: SortField) => void;
  onViewDetails: (reg: Registration) => void;
  onEditRegistration: (reg: Registration) => void;
  onStatusChange: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  onArchiveRegistration: (id: string) => void;
  onUnarchiveRegistration: (id: string) => void;
  onPermanentDelete: (id: string, name: string) => void;
  isArchivedView: boolean;
}

export default function RegistrationTable({
  registrations,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  sortField,
  sortOrder,
  onSortToggle,
  onViewDetails,
  onEditRegistration,
  onStatusChange,
  onArchiveRegistration,
  onUnarchiveRegistration,
  onPermanentDelete,
  isArchivedView,
}: RegistrationTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isAllSelected =
    registrations.length > 0 && selectedIds.length === registrations.length;
  const isPartiallySelected =
    selectedIds.length > 0 && selectedIds.length < registrations.length;

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-brand-gold ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-gold ml-1 inline" />
    );
  };

  if (registrations.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-400 text-xs rounded-2xl glass-panel border border-brand-gold/15">
        <Clock className="w-8 h-8 text-neutral-400/50 mx-auto mb-2" />
        <p className="font-semibold text-neutral-600 dark:text-neutral-300">No registrations found</p>
        <p className="text-[11px] text-neutral-400 mt-1">Try adjusting your search terms or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass-panel border border-brand-gold/20 overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
            <tr>
              {/* Checkbox column */}
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-brand-gold/30 text-brand-gold focus:ring-brand-gold/40 cursor-pointer"
                  title="Select all"
                />
              </th>

              {/* Ref ID */}
              <th
                onClick={() => onSortToggle('id')}
                className="py-3 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none"
              >
                <span>Ref ID</span>
                {renderSortIndicator('id')}
              </th>

              {/* Student Name */}
              <th
                onClick={() => onSortToggle('fullName')}
                className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none"
              >
                <span>Student Name</span>
                {renderSortIndicator('fullName')}
              </th>

              {/* Submitted Entry Time */}
              <th
                onClick={() => onSortToggle('submittedAt')}
                className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none"
              >
                <span>Submitted Time</span>
                {renderSortIndicator('submittedAt')}
              </th>

              {/* Contact (Phone & Email) */}
              <th className="py-3 px-4">Contact</th>

              {/* SUFFA Dars */}
              <th
                onClick={() => onSortToggle('darsName')}
                className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none"
              >
                <span>SUFFA Dars Institution</span>
                {renderSortIndicator('darsName')}
              </th>

              {/* Status */}
              <th
                onClick={() => onSortToggle('status')}
                className="py-3 px-4 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none"
              >
                <span>Status</span>
                {renderSortIndicator('status')}
              </th>

              {/* Actions */}
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-gold/10">
            {registrations.map((reg, idx) => {
              const isSelected = selectedIds.includes(reg.id);
              const waUrl = getWhatsAppUrl(reg.phone, reg.fullName, reg.id, reg.status);

              return (
                <tr
                  key={reg.id}
                  onClick={() => onViewDetails(reg)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-gold/10 dark:bg-brand-gold/15'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {/* Checkbox */}
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(reg.id, idx, e);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded border-brand-gold/30 text-brand-gold focus:ring-brand-gold/40 cursor-pointer"
                    />
                  </td>

                  {/* Ref ID with quick copy */}
                  <td className="py-3 px-3 font-mono font-bold text-brand-gold whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>{reg.regCode || reg.id}</span>
                      <button
                        onClick={(e) => handleCopyId(e, reg.regCode || reg.id)}
                        className="p-1 hover:bg-brand-gold/20 rounded text-neutral-400 hover:text-brand-gold transition-colors"
                        title="Copy Registration Code"
                      >
                        {copiedId === (reg.regCode || reg.id) ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Student Name */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 flex-wrap">
                      <span>{reg.fullName}</span>
                      {reg.gateStatus === 'inside' && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                          IN CAMPUS
                        </span>
                      )}
                      {reg.source === 'admin_manual' && (
                        <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                          WALK-IN
                        </span>
                      )}
                      {reg.isArchived && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neutral-500/20 text-neutral-400 border border-neutral-500/30">
                          ARCHIVED
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Submitted Entry Time (Dual-Line with Exact Time + Relative Badge) */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-neutral-800 dark:text-neutral-200 font-medium font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-brand-gold shrink-0" />
                        <span>{formatExactDateTime(reg.submittedAt)}</span>
                      </div>
                      <div
                        className="text-[10px] text-neutral-400 font-mono mt-0.5"
                        title={`ISO Timestamp: ${reg.submittedAt}`}
                      >
                        {formatRelativeTime(reg.submittedAt)}
                      </div>
                    </div>
                  </td>

                  {/* Contact (Phone & Email) */}
                  <td className="py-3 px-4 space-y-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5 font-mono">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{reg.phone}</span>
                      </a>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {reg.email ? (
                        <a
                          href={`mailto:${reg.email}`}
                          className="hover:underline hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                          {reg.email}
                        </a>
                      ) : (
                        <span className="italic text-neutral-400">No email</span>
                      )}
                    </div>
                  </td>

                  {/* SUFFA Dars & District */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {reg.darsRegNo && (
                        <span className="px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono font-bold text-[10px]">
                          {reg.darsRegNo}
                        </span>
                      )}
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {reg.darsName || reg.darsYear || '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5 truncate">
                      {reg.darsMudarris && <span>Mudarris: {reg.darsMudarris}</span>}
                    </div>
                  </td>

                  {/* Status Select Dropdown */}
                  <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        onStatusChange(reg.id, e.target.value as any)
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                        reg.status === 'confirmed'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                          : reg.status === 'cancelled'
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* View details */}
                      <button
                        onClick={() => onViewDetails(reg)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        title="View Full Profile & Actions"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => onEditRegistration(reg)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                        title="Edit Registration"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Archive / Restore */}
                      {isArchivedView || reg.isArchived ? (
                        <button
                          onClick={() => onUnarchiveRegistration(reg.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                          title="Restore to active pool"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onArchiveRegistration(reg.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                          title="Archive registration (safe soft delete)"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Permanent Delete */}
                      <button
                        onClick={() => onPermanentDelete(reg.id, reg.fullName)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Permanently delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
