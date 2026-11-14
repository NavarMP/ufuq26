'use client';

import React, { useState, useEffect } from 'react';
import { Registration, SuffaDars } from '@/types';
import DarsCombobox from '@/components/DarsCombobox';
import { cleanPhoneNumber } from './registrationUtils';
import {
  X,
  User,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Save,
  Plus,
} from 'lucide-react';

interface RegistrationFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  registration: Registration | null;
  onClose: () => void;
  onSave: (
    data: Omit<Registration, 'id' | 'submittedAt'> & { id?: string }
  ) => Promise<void>;
  darsList: SuffaDars[];
  existingRegistrations: Registration[];
}

export default function RegistrationFormModal({
  isOpen,
  mode,
  registration,
  onClose,
  onSave,
  darsList,
  existingRegistrations,
}: RegistrationFormModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [darsId, setDarsId] = useState('');
  const [darsName, setDarsName] = useState('');
  const [darsRegNo, setDarsRegNo] = useState('');
  const [darsMudarris, setDarsMudarris] = useState('');
  const [darsDistrict, setDarsDistrict] = useState('');
  const [status, setStatus] = useState<Registration['status']>('confirmed');
  const [adminNotes, setAdminNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (mode === 'edit' && registration) {
      setFullName(registration.fullName || '');
      setPhone(registration.phone || '');
      setEmail(registration.email || '');
      setDarsId(registration.darsId || registration.darsRegNo || '');
      setDarsName(registration.darsName || '');
      setDarsRegNo(registration.darsRegNo || '');
      setDarsMudarris(registration.darsMudarris || '');
      setDarsDistrict(registration.darsDistrict || '');
      setStatus(registration.status || 'confirmed');
      setAdminNotes(registration.adminNotes || '');
    } else {
      setFullName('');
      setPhone('');
      setEmail('');
      setDarsId('');
      setDarsName('');
      setDarsRegNo('');
      setDarsMudarris('');
      setDarsDistrict('');
      setStatus('confirmed'); // default to confirmed for admin walk-in
      setAdminNotes('');
    }
    setErrors({});
    setDuplicateWarning(null);
  }, [mode, registration, isOpen]);

  // Check duplicate phone on change (mode: create only)
  useEffect(() => {
    if (mode !== 'create') return;
    const clean = cleanPhoneNumber(phone).slice(-10);
    if (clean.length >= 8) {
      const existing = existingRegistrations.find(
        (r) => cleanPhoneNumber(r.phone).slice(-10) === clean
      );
      if (existing) {
        setDuplicateWarning(
          `Phone matches existing attendee: ${existing.fullName} (${existing.id})`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  }, [phone, mode, existingRegistrations]);

  if (!isOpen) return null;

  const handleDarsSelect = (selected: SuffaDars | null) => {
    if (selected) {
      setDarsId(selected.id);
      setDarsName(selected.nameEn);
      setDarsRegNo(selected.regNo);
      setDarsMudarris(selected.mudarris || '');
      if (selected.district) {
        setDarsDistrict(selected.district);
      }
      setErrors((prev) => ({ ...prev, dars: '' }));
    } else {
      setDarsId('');
      setDarsName('');
      setDarsRegNo('');
      setDarsMudarris('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Student name is required.';
    }

    const clean = cleanPhoneNumber(phone);
    if (!clean || clean.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!darsName.trim() && !darsRegNo.trim()) {
      newErrors.dars = 'Please select a SUFFA Dars institution.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        darsId: darsId || darsRegNo,
        darsName: darsName.trim(),
        darsRegNo: darsRegNo.trim(),
        darsMudarris: darsMudarris.trim() || undefined,
        darsDistrict: darsDistrict.trim() || undefined,
        status,
        category: 'regular',
        adminNotes: adminNotes.trim() || undefined,
        source: mode === 'create' ? 'admin_manual' : registration?.source,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save registration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl border border-brand-gold/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-brand-gold/15 flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-gold text-brand-navy">
              {mode === 'create' ? <Plus className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                {mode === 'create' ? 'Add New Registration' : 'Edit Registration'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {mode === 'create'
                  ? 'Manual on-spot walk-in or delegate entry'
                  : `Modify record for ${registration?.id}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-gold" />
              <span>Student Full Name *</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              placeholder="e.g. Muhammed Bilal Faizy"
              className={`w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold ${
                errors.fullName ? 'border-rose-500' : 'border-brand-gold/25'
              }`}
            />
            {errors.fullName && <p className="text-[10px] text-rose-500">{errors.fullName}</p>}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                <span>Phone Number *</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold font-mono ${
                  errors.phone ? 'border-rose-500' : 'border-brand-gold/25'
                }`}
              />
              {errors.phone && <p className="text-[10px] text-rose-500">{errors.phone}</p>}
              {duplicateWarning && (
                <p className="text-[10px] text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  <span>{duplicateWarning}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-gold" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                placeholder="student@example.com"
                className={`w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold ${
                  errors.email ? 'border-rose-500' : 'border-brand-gold/25'
                }`}
              />
              {errors.email && <p className="text-[10px] text-rose-500">{errors.email}</p>}
            </div>
          </div>

          {/* SUFFA Dars Combobox */}
          <div className="space-y-1">
            <DarsCombobox
              darsList={darsList}
              selectedDarsId={darsRegNo || darsId}
              onSelect={handleDarsSelect}
              error={errors.dars}
              label="SUFFA Dars Institution *"
              placeholder="Search by Dars name, Malayalam, Mudarris, or Reg No (e.g. SDC01)..."
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Registration Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'confirmed', label: 'Confirmed', color: 'border-emerald-500 text-emerald-600 bg-emerald-500/10' },
                { value: 'pending', label: 'Pending', color: 'border-amber-500 text-amber-600 bg-amber-500/10' },
                { value: 'cancelled', label: 'Cancelled', color: 'border-rose-500 text-rose-600 bg-rose-500/10' },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                    status === s.value
                      ? `${s.color} ring-1 ring-offset-1`
                      : 'border-brand-gold/20 text-neutral-600 dark:text-neutral-400 bg-black/5 dark:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              Private Organizer Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Walk-in attendee, paid in cash, accommodation assigned Room 102..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow-md hover:bg-brand-gold-hover transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : mode === 'create' ? 'Create Registration' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
