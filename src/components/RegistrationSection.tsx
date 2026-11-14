'use client';

import React, { useState } from 'react';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
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
} from 'lucide-react';

export default function RegistrationSection() {
  const { eventInfo, registrationFields, submitRegistration, isSaving } = useEvent();
  const { language, t, isRtl } = useApp();

  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: '',
    email: '',
    phone: '',
    darsYear: '',
    higherStudyPlan: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    id?: string;
    error?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // Field change
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

  // Validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('register.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('register.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('register.invalidEmail');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('register.required');
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = t('register.invalidPhone');
    }

    if (!formData.darsYear.trim()) {
      newErrors.darsYear = t('register.required');
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = t('register.mustAgree');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await submitRegistration({
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      darsYear: formData.darsYear.trim(),
      higherStudyPlan: formData.higherStudyPlan?.trim() || '',
      emergencyContact: formData.emergencyContact?.trim() || '',
      emergencyPhone: formData.emergencyPhone?.trim() || '',
      agreedToTerms: formData.agreedToTerms,
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
      email: '',
      phone: '',
      darsYear: '',
      higherStudyPlan: '',
      emergencyContact: '',
      emergencyPhone: '',
      agreedToTerms: false,
    });
    setErrors({});
    setSubmissionResult(null);
  };

  return (
    <section
      id="register"
      aria-label="Camp Registration Form"
      className="py-20 md:py-32 px-4 max-w-4xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          {t('register.title')}
        </span>
        <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy dark:text-white mt-2">
          {t('register.subtitle')}
        </h2>
        <div className="w-16 h-1 bg-brand-gold mx-auto mt-4 rounded-full" />
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-3">
          Curated for SUFFA Dars graduating scholars transitioning to universities (2026–2027).
        </p>
      </div>

      {/* Card Wrapper */}
      <div className="rounded-3xl glass-panel p-6 sm:p-10 md:p-12 border border-brand-gold/30 shadow-2xl relative overflow-hidden">
        {/* Closed banner if closed */}
        {!eventInfo.registrationOpen && !submissionResult && (
          <div className="text-center py-12 space-y-4">
            <Lock className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="font-clash text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              {t('register.closed')}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              Registration for UFUQ ’26 is currently closed or has reached capacity. For inquiries, please reach out to ADSA organizers via the contact section below.
            </p>
          </div>
        )}

        {/* Successful Confirmation Screen */}
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
                {t('register.success')}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                {t('register.successMessage')}
              </p>
            </div>

            {/* Acknowledgment Slip Card */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 shadow-inner text-left rtl:text-right space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
                <span className="text-xs text-neutral-500">Registration Reference:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-sm text-brand-gold">
                    {submissionResult.id}
                  </span>
                  <button
                    onClick={() => handleCopyId(submissionResult.id!)}
                    className="p-1 rounded text-neutral-400 hover:text-brand-gold"
                    title="Copy reference ID"
                    aria-label="Copy reference ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-300">
                <div>
                  <strong>Applicant:</strong> {formData.fullName}
                </div>
                <div>
                  <strong>Email:</strong> {formData.email}
                </div>
                <div>
                  <strong>Phone:</strong> {formData.phone}
                </div>
                <div>
                  <strong>Academic Stage:</strong> {formData.darsYear}
                </div>
                <div>
                  <strong>Camp Dates:</strong> December 24–30, 2026
                </div>
              </div>
            </div>

            {/* Actions: Print / New Submission */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <Printer className="w-4 h-4 text-brand-gold" />
                <span>Print Confirmation</span>
              </button>
              <button
                onClick={handleResetForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold text-brand-navy hover:bg-brand-gold-hover text-xs font-bold"
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
            {/* Top error alert if duplicate or submission failed */}
            {submissionResult && !submissionResult.success && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>
                  {submissionResult.error === 'duplicate'
                    ? t('register.duplicate')
                    : t('register.error')}
                </span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5 text-left rtl:text-right sm:col-span-2">
                <label
                  htmlFor="reg-fullName"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.fullName')} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Muhammad Al-Ameen"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border ${
                    errors.fullName ? 'border-rose-500' : 'border-brand-gold/25 focus:border-brand-gold'
                  } text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label
                  htmlFor="reg-email"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.email')} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="scholar@example.com"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border ${
                    errors.email ? 'border-rose-500' : 'border-brand-gold/25 focus:border-brand-gold'
                  } text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors`}
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-500">{errors.email}</p>
                )}
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.phone')} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border ${
                    errors.phone ? 'border-rose-500' : 'border-brand-gold/25 focus:border-brand-gold'
                  } text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-rose-500">{errors.phone}</p>
                )}
              </div>

              {/* Academic Stage at Dars */}
              <div className="space-y-1.5 text-left rtl:text-right sm:col-span-2">
                <label
                  htmlFor="reg-darsYear"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.darsYear')} (SUFFA Dars) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-darsYear"
                  type="text"
                  value={formData.darsYear}
                  onChange={(e) => handleChange('darsYear', e.target.value)}
                  placeholder="e.g. Muthavval Final Year / Sanad Stage"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border ${
                    errors.darsYear ? 'border-rose-500' : 'border-brand-gold/25 focus:border-brand-gold'
                  } text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors`}
                />
                {errors.darsYear && (
                  <p className="text-[11px] text-rose-500">{errors.darsYear}</p>
                )}
              </div>

              {/* Higher Study Interests */}
              <div className="space-y-1.5 text-left rtl:text-right sm:col-span-2">
                <label
                  htmlFor="reg-studyPlan"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.higherStudyPlan')} (Optional)
                </label>
                <textarea
                  id="reg-studyPlan"
                  rows={2}
                  value={formData.higherStudyPlan}
                  onChange={(e) => handleChange('higherStudyPlan', e.target.value)}
                  placeholder="e.g. Central Universities (JNU, HCU, JMI, AMU), MA Arabic, Comparative Literature, Law, Sociology, Civil Services..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label
                  htmlFor="reg-emergencyContact"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.emergencyContact')} (Optional)
                </label>
                <input
                  id="reg-emergencyContact"
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  placeholder="Parent / Guardian Name"
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Emergency Phone */}
              <div className="space-y-1.5 text-left rtl:text-right">
                <label
                  htmlFor="reg-emergencyPhone"
                  className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  {t('register.emergencyPhone')} (Optional)
                </label>
                <input
                  id="reg-emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  placeholder="+91 ..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="pt-2 text-left rtl:text-right">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-brand-gold/40"
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  {t('register.agreeTerms')}. I confirm that I am a graduating student from SUFFA Dars transitioning to higher studies this year.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.agreedToTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-gold" />
                <span>Your information is protected & shared only with ADSA.</span>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-xl shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSaving ? t('register.submitting') : t('register.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
