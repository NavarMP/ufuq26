'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, KeyRound, Sparkles } from 'lucide-react';
import { DarsAccount, SuffaDars } from '@/types';
import { generateDarsPassword, normalizePhone, formatDisplayPhone } from '@/lib/authHelpers';

interface DarsAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAccount: DarsAccount | null;
  darsList: SuffaDars[];
  onSave: (account: DarsAccount) => Promise<void>;
}

export default function DarsAccountModal({
  isOpen,
  onClose,
  editingAccount,
  darsList,
  onSave,
}: DarsAccountModalProps) {
  const [form, setForm] = useState({
    regNo: '',
    darsNameEn: '',
    darsNameMl: '',
    mudarris: '',
    phone: '',
    password: '',
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAccount) {
      setForm({
        regNo: editingAccount.regNo,
        darsNameEn: editingAccount.darsNameEn,
        darsNameMl: editingAccount.darsNameMl || '',
        mudarris: editingAccount.mudarris,
        phone: editingAccount.phone,
        password: editingAccount.password,
        isActive: editingAccount.isActive,
      });
    } else {
      setForm({
        regNo: '',
        darsNameEn: '',
        darsNameMl: '',
        mudarris: '',
        phone: '',
        password: '',
        isActive: true,
      });
    }
  }, [editingAccount, isOpen]);

  // When regNo is chosen from existing directory centers, auto-fill
  const handleRegNoChange = (selectedRegNo: string) => {
    const found = darsList.find((d) => d.regNo === selectedRegNo);
    if (found) {
      const cleanPh = normalizePhone(found.phone);
      const autoPw = generateDarsPassword(found.regNo, found.slNo || 1);
      setForm((prev) => ({
        ...prev,
        regNo: found.regNo,
        darsNameEn: found.nameEn,
        darsNameMl: found.nameMl || '',
        mudarris: found.mudarris,
        phone: cleanPh,
        password: autoPw,
      }));
    } else {
      setForm((prev) => ({ ...prev, regNo: selectedRegNo }));
    }
  };

  const handleGeneratePassword = () => {
    if (!form.regNo) {
      alert('Please enter or select a Reg No first.');
      return;
    }
    const cleanReg = form.regNo.trim().toUpperCase();
    const pw = generateDarsPassword(cleanReg, 1);
    setForm((prev) => ({ ...prev, password: pw }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.regNo || !form.phone || !form.password) {
      alert('Reg No, Phone, and Password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanPhone = normalizePhone(form.phone);
      const displayPhone = formatDisplayPhone(cleanPhone);
      const accountPayload: DarsAccount = {
        id: form.regNo.trim().toUpperCase(),
        regNo: form.regNo.trim().toUpperCase(),
        darsId: form.regNo.trim().toUpperCase(),
        darsNameEn: form.darsNameEn.trim(),
        darsNameMl: form.darsNameMl.trim(),
        mudarris: form.mudarris.trim(),
        phone: cleanPhone,
        displayPhone,
        password: form.password.trim(),
        isActive: form.isActive,
        createdAt: editingAccount?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(accountPayload);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save Dars account.');
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
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 dark:bg-[#0c1220]/95 border border-brand-gold/30 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                    {editingAccount ? 'Edit Dars Login' : 'Create Dars Login Portal'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Provides student portal access for institutional coordinators
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
              {/* Directory preset chooser */}
              {!editingAccount && (
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Quick Pick from SUFFA Centers Directory
                  </label>
                  <select
                    value={form.regNo}
                    onChange={(e) => handleRegNoChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  >
                    <option value="">-- Choose existing Dars center --</option>
                    {darsList.map((d) => (
                      <option key={d.regNo} value={d.regNo}>
                        {d.regNo} — {d.nameEn} ({d.mudarris})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Registration No (SDCxx) *
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
                    Mudarris Contact Phone *
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

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Dars Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={form.darsNameEn}
                  onChange={(e) => setForm({ ...form, darsNameEn: e.target.value })}
                  placeholder="SUFFA Dars Center"
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Dars Name (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.darsNameMl}
                    onChange={(e) => setForm({ ...form, darsNameMl: e.target.value })}
                    placeholder="ദർസ് പേര്"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Mudarris Name
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
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Portal Password *
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-gold hover:underline font-mono"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter portal password"
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="account-active"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                />
                <label
                  htmlFor="account-active"
                  className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Portal Login Active (Enable Coordinator Access)
                </label>
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
                  {isSubmitting ? 'Saving...' : editingAccount ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
