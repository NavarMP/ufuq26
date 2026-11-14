'use client';

import React, { useState } from 'react';
import { Registration } from '@/types';
import { MessageSquare, Copy, Check, ExternalLink, X, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export interface RegistrationWhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegistrations: Registration[];
}

export default function RegistrationWhatsAppModal({
  isOpen,
  onClose,
  selectedRegistrations,
}: RegistrationWhatsAppModalProps) {
  const [copiedPhones, setCopiedPhones] = useState(false);
  const [copiedAllMessages, setCopiedAllMessages] = useState(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const getCleanPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getMessageText = (reg: Registration) => {
    return `അസ്സലാമു അലൈകും ${reg.fullName},
Camp UFUQ '26 ലേക്ക് താങ്കളുടെ രജിസ്ട്രേഷൻ സ്ഥിരീകരിച്ചു.

🔖 Reg Code: ${reg.regCode || 'UF26-' + reg.id.slice(-6).toUpperCase()}
🏛️ Dars: ${reg.darsName || 'Alathurpadi Dars'}
📅 തീയതി: ഡിസംബർ 24 - 28, 2026
📍 വേദി: അലത്തൂർപടി ദർസ് ക്യാമ്പസ്

ഡിജിറ്റൽ പാസ്സ് വെബ്സൈറ്റിൽ ലഭ്യമാണ്: https://ufuq26.in

ADSA Camp Secretariat`;
  };

  const handleCopyPhones = () => {
    const phones = selectedRegistrations
      .map((r) => r.phone.replace(/\D/g, '').slice(-10))
      .filter((p) => p.length === 10)
      .join(', ');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(phones);
      setCopiedPhones(true);
      toast.success(`Copied ${selectedRegistrations.length} phone numbers!`);
      setTimeout(() => setCopiedPhones(false), 2000);
    }
  };

  const handleCopyAllMessages = () => {
    const all = selectedRegistrations
      .map(
        (r, idx) =>
          `--- [#${idx + 1}] ${r.fullName} (${r.phone}) ---\n${getMessageText(r)}`
      )
      .join('\n\n');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(all);
      setCopiedAllMessages(true);
      toast.success('Copied all formatted messages to clipboard!');
      setTimeout(() => setCopiedAllMessages(false), 2000);
    }
  };

  const handleCopySingle = (text: string, idx: number) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSingleIndex(idx);
      toast.success('Message copied!');
      setTimeout(() => setCopiedSingleIndex(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-neutral-900 border border-brand-gold/40 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-100">
                WhatsApp Dispatch & Broadcast Hub
              </h3>
              <p className="text-xs text-neutral-400">
                Generated confirmation messages for{' '}
                <span className="font-mono font-bold text-brand-gold">
                  {selectedRegistrations.length}
                </span>{' '}
                delegates
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

        {/* Global Action Toolbar */}
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
            onClick={handleCopyAllMessages}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
          >
            {copiedAllMessages ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy All Broadcast Messages</span>
          </button>
        </div>

        {/* Delegate Messages List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
          {selectedRegistrations.map((reg, idx) => {
            const cleanPhone = getCleanPhone(reg.phone);
            const msg = getMessageText(reg);
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

            return (
              <div
                key={reg.id}
                className="bg-neutral-950/70 p-3.5 rounded-xl border border-white/10 space-y-2 hover:border-brand-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-200">
                      {idx + 1}. {reg.fullName}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      ({reg.phone})
                    </span>
                    {reg.darsName && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-neutral-400">
                        {reg.darsName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySingle(msg, idx)}
                      className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 flex items-center gap-1 transition-colors"
                      title="Copy this message"
                    >
                      {copiedSingleIndex === idx ? (
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

                <pre className="text-[11px] text-neutral-300 font-sans whitespace-pre-wrap bg-neutral-900/80 p-2.5 rounded-lg border border-white/5">
                  {msg}
                </pre>
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
