'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2 } from 'lucide-react';
import { SuffaDars } from '@/types';

interface DarsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDars: SuffaDars | null;
  onSave: (dars: Omit<SuffaDars, 'id'> & { id?: string }) => Promise<void>;
}

export default function DarsEditModal({
  isOpen,
  onClose,
  editingDars,
  onSave,
}: DarsEditModalProps) {
  const [form, setForm] = useState({
    regNo: '',
    nameEn: '',
    nameMl: '',
    mudarris: '',
    phone: '',
    district: '',
    slNo: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingDars) {
      setForm({
        regNo: editingDars.regNo,
        nameEn: editingDars.nameEn,
        nameMl: editingDars.nameMl || '',
        mudarris: editingDars.mudarris,
        phone: editingDars.phone,
        district: editingDars.district || '',
        slNo: editingDars.slNo || 0,
      });
    } else {
      setForm({
        regNo: '',
        nameEn: '',
        nameMl: '',
        mudarris: '',
        phone: '',
        district: '',
        slNo: 0,
      });
    }
  }, [editingDars, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.regNo || !form.nameEn || !form.mudarris || !form.phone) {
      alert('Reg No, Name, Mudarris, and Phone are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        id: editingDars?.id,
        regNo: form.regNo.trim().toUpperCase(),
        nameEn: form.nameEn.trim(),
        nameMl: form.nameMl.trim(),
        mudarris: form.mudarris.trim(),
        phone: form.phone.trim(),
        district: form.district.trim(),
        slNo: form.slNo || undefined,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save Dars center.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 dark:bg-[#0c1220]/95 border border-brand-gold/30 shadow-2xl z-10 space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                    {editingDars ? 'Edit SUFFA Dars Center' : 'Add SUFFA Dars Center'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Official participating institution in the SUFFA Dars network
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Reg No (SDCxx) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.regNo}
                    onChange={(e) => setForm({ ...form, regNo: e.target.value })}
                    placeholder="SDC01"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 uppercase font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    District
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    placeholder="Malappuram"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Dars Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="SUFFA Dars Center"
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Dars Name (Malayalam)
                </label>
                <input
                  type="text"
                  value={form.nameMl}
                  onChange={(e) => setForm({ ...form, nameMl: e.target.value })}
                  placeholder="ദർസ് പേര്"
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Mudarris Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.mudarris}
                    onChange={(e) => setForm({ ...form, mudarris: e.target.value })}
                    placeholder="Usthad Name"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingDars ? 'Save Changes' : 'Add Center'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
