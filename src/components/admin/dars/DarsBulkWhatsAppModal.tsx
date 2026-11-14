'use client';

import React, { useState } from 'react';
import { DarsAccount } from '@/types';
import { MessageSquare, Copy, Check, ExternalLink, X, Phone, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export interface DarsBulkWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccounts: DarsAccount[];
}

export default function DarsBulkWhatsAppModal({
  isOpen,
  onClose,
  selectedAccounts,
}: DarsBulkWhatsAppModalProps) {
  const [copiedPhones, setCopiedPhones] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const getCleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getDarsCredentialMessage = (acc: DarsAccount) => {
    return `അസ്സലാമു അലൈകും ${acc.mudarris} ഉസ്താദ്,

Camp UFUQ '26 - SUFFA ദർസ് കോർഡിനേറ്റർ പോർട്ടൽ ലോഗിൻ വിവരങ്ങൾ:

🏛️ ദർസ്: ${acc.darsNameEn} (${acc.darsNameMl || ''})
🔖 രജിസ്ട്രേഷൻ നമ്പർ: ${acc.regNo}
👤 യൂസർനെയിം: ${acc.phone}
🔑 പാസ്‌വേഡ്: ${acc.password}

🌐 ലോഗിൻ പോർട്ടൽ ലിങ്ക്:
https://ufuq26.in/dars

താങ്കളുടെ ദർസിലെ വിദ്യാർത്ഥികളുടെ വിവരങ്ങൾ സ്ഥിരീകരിക്കാനും പുതിയ രജിസ്ട്രേഷനുകൾ സമർപ്പിക്കാനും ഈ പോർട്ടൽ ഉപയോഗിക്കാവുന്നതാണ്.

ജസാക്കല്ലാഹു ഖൈറൻ,
ADSA Camp UFUQ '26 Secretariat`;
  };

  const handleCopyPhones = () => {
    const phones = selectedAccounts
      .map((a) => a.phone.replace(/\D/g, '').slice(-10))
      .filter((p) => p.length === 10)
      .join(', ');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(phones);
      setCopiedPhones(true);
      toast.success(`Copied ${selectedAccounts.length} Mudarris phone numbers!`);
      setTimeout(() => setCopiedPhones(false), 2000);
    }
  };

  const handleCopyAll = () => {
    const all = selectedAccounts
      .map(
        (a, i) =>
          `=== [${a.regNo}] ${a.darsNameEn} - ${a.mudarris} (${a.phone}) ===\n${getDarsCredentialMessage(a)}`
      )
      .join('\n\n');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(all);
      setCopiedAll(true);
      toast.success('Copied all credentials messages to clipboard!');
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const handleCopySingle = (text: string, i: number) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(i);
      toast.success('Credentials copied!');
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                SUFFA Dars Credentials Broadcaster
              </h3>
              <p className="text-xs text-neutral-400">
                Generated portal login notifications for{' '}
                <span className="font-mono font-bold text-brand-gold">
                  {selectedAccounts.length}
                </span>{' '}
                institutions
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

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-950/60 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={handleCopyPhones}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            {copiedPhones ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
            )}
            <span>Copy Phone Numbers CSV</span>
          </button>

          <button
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold/90 text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedAll ? (
              <Check className="w-3.5 h-3.5 text-neutral-950" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy All Credentials Broadcast</span>
          </button>
        </div>

        {/* Dars List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {selectedAccounts.map((acc, idx) => {
            const cleanPhone = getCleanPhone(acc.phone);
            const msg = getDarsCredentialMessage(acc);
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

            return (
              <div
                key={acc.id}
                className="bg-neutral-950/70 p-3.5 rounded-xl border border-white/10 space-y-2 hover:border-brand-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-gold">
                      [{acc.regNo}]
                    </span>
                    <span className="font-bold text-neutral-200">
                      {acc.darsNameEn}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      ({acc.mudarris})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySingle(msg, idx)}
                      className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 flex items-center gap-1 transition-colors"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Send WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="bg-neutral-900/80 p-2.5 rounded-lg border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-neutral-400">Phone: </span>
                    <span className="text-neutral-200 font-bold">{acc.phone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Password: </span>
                    <span className="text-brand-gold font-bold">{acc.password}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
