'use client';

import React, { useState } from 'react';
import { Registration } from '@/types';
import PlasticCardBadge from './PlasticCardBadge';
import {
  X,
  Printer,
  FileText,
  RotateCw,
  Check,
  Building2,
  Users,
} from 'lucide-react';

interface BatchCardPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  darsName?: string;
  darsRegNo?: string;
}

export default function BatchCardPrintModal({
  isOpen,
  onClose,
  registrations,
  darsName,
  darsRegNo,
}: BatchCardPrintModalProps) {
  const [activeFace, setActiveFace] = useState<'front' | 'back'>('front');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    registrations.map((r) => r.id)
  );

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(registrations.map((r) => r.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredToPrint = registrations.filter((r) => selectedIds.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] flex flex-col print:border-none print:p-0 print:max-w-none print:max-h-none print:bg-transparent">
        {/* Header & Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-gold/25 print:hidden">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-brand-gold">
              Batch CR80 Card Printer
            </span>
            <h3 className="font-clash text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              {darsName ? `${darsName} Delegation Badges` : 'Print Attendee Badges'}
            </h3>
            {darsRegNo && (
              <p className="text-xs text-neutral-500 font-mono">
                Institution Code: {darsRegNo} • {filteredToPrint.length} Selected
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFace(activeFace === 'front' ? 'back' : 'front')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-brand-gold"
            >
              <RotateCw className="w-3.5 h-3.5 text-brand-gold" />
              <span>Face: {activeFace === 'front' ? 'Front' : 'Back'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={filteredToPrint.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print {filteredToPrint.length} Badges</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selection Bar (Hidden in Print) */}
        <div className="flex items-center justify-between text-xs text-neutral-500 print:hidden border-b border-brand-gold/15 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="text-brand-gold hover:underline font-semibold"
            >
              Select All ({registrations.length})
            </button>
            <span>•</span>
            <button
              onClick={deselectAll}
              className="hover:underline text-neutral-400"
            >
              Deselect All
            </button>
          </div>
          <span className="font-mono text-neutral-400">
            A4 Grid layout: 4 badges per page
          </span>
        </div>

        {/* Badges Grid View */}
        <div
          id="batch-print-area"
          className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black/20 border border-brand-gold/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center print:grid-cols-2 print:gap-4 print:p-0 print:border-none print:overflow-visible"
        >
          {filteredToPrint.map((reg) => (
            <div
              key={reg.id}
              className="relative p-2 rounded-2xl border border-white/5 hover:border-brand-gold/40 transition-colors flex flex-col items-center"
            >
              <div className="absolute top-4 left-4 z-20 print:hidden">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(reg.id)}
                  onChange={() => toggleSelect(reg.id)}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
              </div>

              <PlasticCardBadge
                registration={reg}
                orientation="portrait"
                showControls={false}
              />
            </div>
          ))}

          {filteredToPrint.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-400 space-y-2">
              <Users className="w-10 h-10 text-neutral-500 mx-auto" />
              <p>No scholars selected for printing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
