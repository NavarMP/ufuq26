'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import DarsCombobox from '@/components/DarsCombobox';
import { SuffaDars, Registration } from '@/types';
import { useShare } from '@/hooks/useShare';
import DigitalCampPass from '@/components/badge/DigitalCampPass';
import PlasticCardBadge from '@/components/badge/PlasticCardBadge';
import { ensureRegistrationCode } from '@/lib/regCodeGenerator';
import {
  FileCheck2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  User,
  Building2,
  CheckCircle,
  Search,
  UserPlus,
  Clock,
  XCircle,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
  Loader2,
  X,
  ArrowRight,
  Share2,
} from 'lucide-react';

export default function RegistrationSection() {
  const { eventInfo, darsList, submitRegistration, findRegistration, isSaving } = useEvent();
  const { language, t, isRtl } = useApp();
  const { openShare } = useShare();

  // Mode: 'register' (New Application) | 'check' (Check Status / Search)
  const [activeMode, setActiveMode] = useState<'register' | 'check'>('register');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    darsId: '',
    darsName: '',
    darsRegNo: '',
    darsMudarris: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    id?: string;
    error?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    performed: boolean;
    found: boolean;
    registration?: Registration;
    message?: string;
  } | null>(null);

  // Digital Pass & ID Card Modal State
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalTab, setPassModalTab] = useState<'3d_pass' | 'plastic_card'>('3d_pass');

  // Field change handler
  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Handle Dars selection from Combobox
  const handleDarsSelect = (dars: SuffaDars | null) => {
    if (dars) {
      setFormData((prev) => ({
        ...prev,
        darsId: dars.id,
        darsName: `${dars.nameEn} (${dars.nameMl})`,
        darsRegNo: dars.regNo,
        darsMudarris: dars.mudarris,
      }));
      if (errors.dars) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.dars;
          return copy;
        });
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        darsId: '',
        darsName: '',
        darsRegNo: '',
        darsMudarris: '',
      }));
    }
  };

  // Registration Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // 1. Full Name (Required)
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('register.required') || 'Full Name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name';
    }

    // 2. Phone Number (Required)
    const rawDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = t('register.required') || 'Phone number is required';
    } else if (rawDigits.length < 10) {
      newErrors.phone = t('register.invalidPhone') || 'Please enter a valid 10-digit phone number';
    }

    // 3. Email (Optional, but if filled, must be valid)
    if (formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = t('register.invalidEmail') || 'Please enter a valid email address';
      }
    }

    // 4. Dars (Required selection from official list)
    if (!formData.darsId) {
      newErrors.dars = 'Please select your SUFFA Dars institution';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await submitRegistration({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase() || undefined,
      darsId: formData.darsId,
      darsName: formData.darsName,
      darsRegNo: formData.darsRegNo,
      darsMudarris: formData.darsMudarris,
    });

    setSubmissionResult(res);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      darsId: '',
      darsName: '',
      darsRegNo: '',
      darsMudarris: '',
    });
    setErrors({});
    setSubmissionResult(null);
  };

  // Status Search Handler
  const handleSearchRegistration = async (overrideQuery?: string) => {
    const q = (overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    if (!q) return;

    setIsSearching(true);
    try {
      const res = await findRegistration(q);
      setSearchResult({
        performed: true,
        found: res.found,
        registration: res.registration,
        message: res.message,
      });
    } catch (err: any) {
      setSearchResult({
        performed: true,
        found: false,
        message: err.message || 'Unable to check registration at this moment.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section
      id="register"
      aria-label="Camp Registration & Status Check"
      className="py-20 md:py-32 px-4 max-w-4xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {activeMode === 'register' ? (t('register.title') || 'Registration') : 'Admission Verification'}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {activeMode === 'register'
            ? (t('register.subtitle') || "Secure your place at UFUQ '26")
            : 'Check Registration Status'}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3">
          {activeMode === 'register'
            ? 'For graduating scholars transitioning from SUFFA Dars to universities & civil services.'
            : 'Search with your Phone Number, Reference ID, or Email to view your verified admission slip.'}
        </p>

        {/* Mode Switcher Segmented Control */}
        <div className="inline-flex items-center p-1.5 mt-6 rounded-full glass-panel border border-brand-gold/30 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveMode('register')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeMode === 'register'
                ? 'bg-brand-gold text-brand-navy shadow-md scale-100'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Registration</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('check');
              // If user has entered phone or email in form, prefill search
              if (!searchQuery && (formData.phone || formData.email)) {
                setSearchQuery(formData.phone || formData.email);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all ${
              activeMode === 'check'
                ? 'bg-brand-gold text-brand-navy shadow-md scale-100'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-brand-gold'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Already Registered? Check Status</span>
          </button>
        </div>
      </div>

      {/* Main Card Wrapper */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/30 shadow-2xl relative overflow-hidden">
        {/* ========================================================
            TAB 1: NEW REGISTRATION FORM
           ======================================================== */}
        {activeMode === 'register' && (
          <div>
            {/* Closed banner if closed */}
            {!eventInfo.registrationOpen && !submissionResult && (
              <div className="text-center py-12 space-y-4">
                <Lock className="w-12 h-12 text-neutral-400 mx-auto" />
                <h3 className="font-clash text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  {t('register.closed') || 'Registration is currently closed.'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
                  Registration for UFUQ ’26 is currently closed or has reached capacity. If you have already registered, you can still check your status above.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveMode('check')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-gold text-brand-navy text-xs font-bold shadow hover:bg-brand-gold-hover transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Check Your Existing Registration</span>
                </button>
              </div>
            )}

            {/* Successful Submission Screen */}
            {submissionResult && submissionResult.success && (
              <div className="py-6 text-center space-y-6 animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Application Received
                  </span>
                  <h3 className="font-clash text-2xl sm:text-3xl font-bold text-brand-navy dark:text-white">
                    {t('register.success') || 'Registration submitted successfully!'}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                    Your application has been registered with ADSA. Keep your reference ID safe for admission verification at the camp.
                  </p>
                </div>

                {/* Acknowledgment Slip Card */}
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 shadow-inner text-left rtl:text-right space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
                    <span className="text-xs text-neutral-500 font-medium">Registration Reference:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm text-brand-gold">
                        {submissionResult.id}
                      </span>
                      <button
                        onClick={() => handleCopyId(submissionResult.id!)}
                        className="p-1 rounded text-neutral-400 hover:text-brand-gold transition-colors"
                        title="Copy reference ID"
                        aria-label="Copy reference ID"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs space-y-2 text-neutral-600 dark:text-neutral-300">
                    <div className="flex justify-between py-0.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-neutral-500">Applicant:</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-black/5 dark:border-white/5">
                      <span className="text-neutral-500">Phone / WhatsApp:</span>
                      <span className="font-mono font-medium">{formData.phone}</span>
                    </div>
                    {formData.email && (
                      <div className="flex justify-between py-0.5 border-b border-black/5 dark:border-white/5">
                        <span className="text-neutral-500">Email:</span>
                        <span>{formData.email}</span>
                      </div>
                    )}
                    <div className="py-1">
                      <span className="text-neutral-500 block text-[11px]">SUFFA Dars:</span>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono text-[10px]">
                          {formData.darsRegNo}
                        </span>
                        <span>{formData.darsName}</span>
                      </div>
                      {formData.darsMudarris && (
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Mudarris: {formData.darsMudarris}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between pt-1 border-t border-brand-gold/15">
                      <span className="text-neutral-500">Camp Dates:</span>
                      <span className="font-semibold text-brand-gold">December 24–30, 2026</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Share Digital Pass / Print / New Submission */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      openShare(
                        {
                          title: `UFUQ ’26 Attendee Pass — ${formData.fullName}`,
                          text: `I've registered for UFUQ ’26 — A Transition & Leadership Camp! Reference ID: ${submissionResult.id}`,
                          url: `https://alathurpadidars.in#register?ref=${submissionResult.id}`,
                          type: 'pass',
                          badgeText: 'Attendee Pass',
                          attendee: {
                            fullName: formData.fullName,
                            refId: submissionResult.id || '',
                            darsName: formData.darsName,
                            darsRegNo: formData.darsRegNo,
                            darsMudarris: formData.darsMudarris,
                            phone: formData.phone,
                          },
                        },
                        'story'
                      );
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-navy hover:scale-105 active:scale-95 text-xs font-bold shadow-lg shadow-brand-gold/25 transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4 text-brand-navy" />
                    <span>{t('share.sharePass') || 'Share Digital Pass'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPassModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gold text-brand-navy hover:bg-brand-gold-hover text-xs font-bold shadow-lg shadow-brand-gold/25 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    <Sparkles className="w-4 h-4 text-brand-navy" />
                    <span>View 3D Pass &amp; ID Card</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <Printer className="w-4 h-4 text-brand-gold" />
                    <span>Print Confirmation</span>
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-800 dark:text-neutral-200 border border-brand-gold/25 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Submit Another</span>
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {eventInfo.registrationOpen && (!submissionResult || !submissionResult.success) && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Top error alert with smart quick-lookup CTA if duplicate */}
                {submissionResult && !submissionResult.success && (
                  <div
                    role="alert"
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm animate-shake"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>
                          {submissionResult.error === 'duplicate'
                            ? 'A registration with this phone number or email already exists.'
                            : submissionResult.error === 'closed'
                            ? 'Registration is currently closed.'
                            : t('register.error') || 'Registration failed. Please try again.'}
                        </span>
                      </div>

                      {/* Smart Quick-View CTA on Duplicate */}
                      {submissionResult.error === 'duplicate' && (
                        <button
                          type="button"
                          onClick={() => {
                            const qVal = formData.phone || formData.email;
                            setActiveMode('check');
                            setSearchQuery(qVal);
                            handleSearchRegistration(qVal);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0 self-start sm:self-auto"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>View Your Registration Slip</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-5">
                  {/* 1. Full Name */}
                  <div className="space-y-1.5 text-left rtl:text-right">
                    <label
                      htmlFor="reg-fullName"
                      className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                    >
                      {t('register.fullName') || 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-brand-gold absolute left-3.5 pointer-events-none" />
                      <input
                        id="reg-fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        placeholder="e.g. Muhammad Al-Ameen"
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-black/50 border ${
                          errors.fullName
                            ? 'border-rose-500 focus:border-rose-500'
                            : 'border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                        } text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all shadow-inner`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* 2. Phone / WhatsApp & 3. Email (Side-by-side) */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5 text-left rtl:text-right">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="reg-phone"
                          className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                        >
                          {t('register.phone') || 'Phone / WhatsApp'} <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] text-neutral-400">WhatsApp preferred</span>
                      </div>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1 pointer-events-none">
                          <Phone className="w-3.5 h-3.5 text-brand-gold" />
                          <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400 border-r border-brand-gold/20 pr-1.5">
                            +91
                          </span>
                        </div>
                        <input
                          id="reg-phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          placeholder="98765 43210"
                          className={`w-full pl-16 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-black/50 border ${
                            errors.phone
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                          } text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all shadow-inner font-mono`}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-0.5">
                        {errors.phone ? (
                          <p className="text-[11px] text-rose-500">{errors.phone}</p>
                        ) : (
                          <span />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMode('check');
                            if (formData.phone) {
                              setSearchQuery(formData.phone);
                              handleSearchRegistration(formData.phone);
                            }
                          }}
                          className="text-[11px] text-brand-gold hover:underline font-medium inline-flex items-center gap-1 ml-auto"
                        >
                          <span>Already registered? Check slip</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-1.5 text-left rtl:text-right">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="reg-email"
                          className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                        >
                          {t('register.email') || 'Email Address'}{' '}
                          <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <span className="text-[10px] text-emerald-500 font-medium">Optional</span>
                      </div>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-brand-gold absolute left-3.5 pointer-events-none" />
                        <input
                          id="reg-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="scholar@example.com (optional)"
                          className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 dark:bg-black/50 border ${
                            errors.email
                              ? 'border-rose-500 focus:border-rose-500'
                              : 'border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20'
                          } text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all shadow-inner`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* 4. SUFFA Dars (Advanced Combobox Selection cum Search) */}
                  <DarsCombobox
                    darsList={darsList}
                    selectedDarsId={formData.darsId}
                    onSelect={handleDarsSelect}
                    error={errors.dars}
                    required={true}
                    label="SUFFA Dars Institution"
                    placeholder="Search by Dars name, Malayalam, Mudarris, or Reg No (e.g. SDC01)..."
                  />
                </div>

                {/* Bottom Actions & Trust Info */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-brand-gold/15">
                  <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Direct registration with ADSA & SUFFA Dars Coordination.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t('register.submitting') || 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{t('register.submit') || 'Submit Registration'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: CHECK / SEARCH REGISTRATION STATUS
           ======================================================== */}
        {activeMode === 'check' && (
          <div className="space-y-6">
            {/* Search Input Box */}
            <div className="max-w-2xl mx-auto space-y-3">
              <div className="text-center sm:text-left space-y-1">
                <h3 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-gold" />
                  <span>Find Your Admission Slip</span>
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter your registered phone number, WhatsApp number, Reference ID, or email address.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchRegistration();
                }}
                className="relative flex items-center"
              >
                <Search className="w-5 h-5 text-brand-gold absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter 10-digit Phone, WhatsApp, or REG-XXXX..."
                  className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-all shadow-inner font-mono"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResult(null);
                    }}
                    className="absolute right-28 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-2 px-5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Format Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-400">
                <span className="font-semibold text-neutral-500">Supported identifiers:</span>
                <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                  📱 Mobile / WhatsApp
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                  🎫 Reference ID (REG-...)
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                  ✉️ Email Address
                </span>
              </div>
            </div>

            {/* RESULTS VIEW */}

            {/* Result Found: Digital Pass / Slip */}
            {searchResult && searchResult.found && searchResult.registration && (
              <div className="max-w-xl mx-auto space-y-5 animate-scale-in">
                {/* Official Card Pass */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/90 via-white/80 to-brand-gold/5 dark:from-black/70 dark:via-black/60 dark:to-brand-gold/10 border-2 border-brand-gold/50 shadow-2xl relative overflow-hidden space-y-5">
                  {/* Watermark / Seal */}
                  <div className="absolute top-3 right-3 opacity-10 pointer-events-none font-arabic text-6xl text-brand-gold select-none">
                    أُفُق
                  </div>

                  {/* Top Bar: Reference ID & Status Badge */}
                  <div className="flex items-center justify-between pb-4 border-b border-brand-gold/25 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">
                        Registration Reference ID
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono font-bold text-base sm:text-lg text-brand-gold">
                          {searchResult.registration.id}
                        </span>
                        <button
                          onClick={() => handleCopyId(searchResult.registration!.id)}
                          className="p-1 rounded text-neutral-400 hover:text-brand-gold transition-colors"
                          title="Copy reference ID"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize border ${
                      searchResult.registration.status === 'confirmed'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                        : searchResult.registration.status === 'cancelled'
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                        : 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                    }">
                      {searchResult.registration.status === 'confirmed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Confirmed Scholar</span>
                        </>
                      ) : searchResult.registration.status === 'cancelled' ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Cancelled</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Application Under Review</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Scholar Details Grid */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-neutral-500">Applicant:</span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {searchResult.registration.fullName}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                      <span className="text-neutral-500">Phone / WhatsApp:</span>
                      <a
                        href={`https://wa.me/91${searchResult.registration.phone.replace(/\D/g, '').slice(-10)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{searchResult.registration.phone}</span>
                      </a>
                    </div>

                    {searchResult.registration.email && (
                      <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                        <span className="text-neutral-500">Email:</span>
                        <span className="text-neutral-700 dark:text-neutral-300">
                          {searchResult.registration.email}
                        </span>
                      </div>
                    )}

                    <div className="py-2 space-y-1">
                      <span className="text-neutral-500 block text-xs">SUFFA Dars Institution:</span>
                      <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {searchResult.registration.darsRegNo && (
                              <span className="px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono font-bold text-[10px]">
                                {searchResult.registration.darsRegNo}
                              </span>
                            )}
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {searchResult.registration.darsName}
                            </span>
                          </div>
                          {searchResult.registration.darsMudarris && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              Mudarris: {searchResult.registration.darsMudarris}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs border-t border-brand-gold/15">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Camp Residency:</span>
                        <span className="font-semibold text-brand-gold flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Dec 24–30, 2026</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-neutral-500 block text-[10px]">Campus Venue:</span>
                        <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span className="truncate">Alathurpadi Dars Campus</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for Found Slip */}
                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-gold/20">
                    <button
                      type="button"
                      onClick={() => setIsPassModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy hover:bg-brand-gold-hover text-xs font-bold shadow-md transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View 3D Pass &amp; ID Card</span>
                    </button>

                    <button
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Print Slip</span>
                    </button>

                    <a
                      href={`https://wa.me/${eventInfo.contact?.whatsapp?.replace(/\D/g, '') || '919074525205'}?text=${encodeURIComponent(
                        `Assalamu Alaikum ADSA Team, I am registered for UFUQ '26. Reference ID: ${searchResult.registration.id}, Name: ${searchResult.registration.fullName}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>

                    <button
                      onClick={() => {
                        setSearchResult(null);
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs text-neutral-400 hover:text-brand-gold transition-colors ml-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Search Another</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Result Not Found */}
            {searchResult && searchResult.performed && !searchResult.found && (
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 animate-scale-in">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-clash text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  No Registration Found
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  We could not find an active registration matching &ldquo;
                  <span className="font-mono font-semibold text-brand-gold">{searchQuery}</span>
                  &rdquo;. Please check for typos or try your 10-digit phone number.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('register');
                      // Prefill phone or email
                      const digits = searchQuery.replace(/\D/g, '');
                      if (digits.length >= 8) {
                        setFormData((prev) => ({ ...prev, phone: searchQuery }));
                      } else if (searchQuery.includes('@')) {
                        setFormData((prev) => ({ ...prev, email: searchQuery }));
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-transform hover:scale-105 inline-flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register for UFUQ &apos;26 Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full glass-panel text-neutral-600 dark:text-neutral-300 text-xs font-semibold hover:border-brand-gold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: 3D DIGITAL CAMP PASS & PLASTIC ID CARD BADGE
         ======================================================== */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            {/* Modal Header & Tab Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/25">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-brand-gold/20 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPassModalTab('3d_pass')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    passModalTab === '3d_pass'
                      ? 'bg-brand-gold text-brand-navy font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  3D Digital Pass
                </button>
                <button
                  type="button"
                  onClick={() => setPassModalTab('plastic_card')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    passModalTab === 'plastic_card'
                      ? 'bg-brand-gold text-brand-navy font-bold shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Plastic ID Card
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Pass Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {(() => {
              const activeReg: Registration =
                searchResult?.registration || {
                  id: submissionResult?.id || 'REG-PENDING',
                  fullName: formData.fullName || 'Scholar',
                  phone: formData.phone || '',
                  email: formData.email,
                  darsId: formData.darsId,
                  darsName: formData.darsName,
                  darsRegNo: formData.darsRegNo,
                  darsMudarris: formData.darsMudarris,
                  submittedAt: new Date().toISOString(),
                  status: 'confirmed',
                  category: 'scholar',
                  gateStatus: 'outside',
                };

              return passModalTab === '3d_pass' ? (
                <DigitalCampPass
                  registration={activeReg}
                  onOpenPrintModal={() => setPassModalTab('plastic_card')}
                />
              ) : (
                <PlasticCardBadge
                  registration={activeReg}
                  orientation="portrait"
                  showControls={true}
                />
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
