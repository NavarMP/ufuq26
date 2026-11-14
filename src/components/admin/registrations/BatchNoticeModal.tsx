'use client';

import React, { useState } from 'react';
import { Registration } from '@/types';
import { NotificationChannel, NotificationEventType } from '@/types/notification';
import { useNotifications } from '@/context/NotificationContext';
import {
  SYSTEM_NOTIFICATION_TEMPLATES,
  TemplateVariables,
  formatWhatsAppMessage,
} from '@/lib/notifications/templateEngine';
import {
  X,
  Send,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Users,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface BatchNoticeModalProps {
  selectedRegistrations: Registration[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BatchNoticeModal({
  selectedRegistrations,
  isOpen,
  onClose,
  onSuccess,
}: BatchNoticeModalProps) {
  const { sendNotification } = useNotifications();

  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['email', 'in_app']);
  const [eventType, setEventType] = useState<NotificationEventType>('status_confirmed');
  const [customMessage, setCustomMessage] = useState('');
  const [locale, setLocale] = useState<'en' | 'ml' | 'ar'>('en');
  const [isDispatching, setIsDispatching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedBatchText, setCopiedBatchText] = useState(false);

  if (!isOpen) return null;

  const total = selectedRegistrations.length;
  const withEmailCount = selectedRegistrations.filter((r) => !!r.email).length;

  const toggleChannel = (ch: NotificationChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const handleBatchDispatch = async () => {
    if (selectedChannels.length === 0) {
      toast.error('Please select at least one delivery channel.');
      return;
    }

    setIsDispatching(true);
    setProgress(0);
    let successCount = 0;

    const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass';

    for (let i = 0; i < total; i++) {
      const reg = selectedRegistrations[i];
      const vars: TemplateVariables = {
        fullName: reg.fullName,
        phone: reg.phone,
        email: reg.email,
        regCode: reg.regCode || reg.id,
        id: reg.id,
        darsName: reg.darsName,
        darsRegNo: reg.darsRegNo,
        status: reg.status,
        passUrl,
        customMessage: customMessage || undefined,
      };

      try {
        const res = await sendNotification({
          recipientId: reg.id,
          recipientName: reg.fullName,
          recipientPhone: reg.phone,
          recipientEmail: reg.email,
          channels: selectedChannels,
          eventType,
          vars,
          locale,
          senderAdminEmail: 'admin@alathurpadidars.in',
        });
        if (res.success) successCount++;
      } catch (err) {
        console.warn(`Failed dispatch to ${reg.id}:`, err);
      }

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsDispatching(false);
    toast.success(`Batch dispatch completed! Sent to ${successCount} of ${total} attendees.`, {
      icon: '🚀',
      duration: 5000,
    });
    onSuccess();
    onClose();
  };

  // Copy formatted broadcast text for WhatsApp web broadcast lists
  const handleCopyFormattedBroadcast = () => {
    const sampleVars: TemplateVariables = {
      fullName: 'Respected Scholar',
      regCode: 'UF26-PASS',
      customMessage: customMessage || 'Important update from ADSA organizers',
    };
    const waText = formatWhatsAppMessage(eventType, sampleVars, locale);
    navigator.clipboard.writeText(waText);
    setCopiedBatchText(true);
    toast.success('Formatted template copied for WhatsApp Web Broadcast!');
    setTimeout(() => setCopiedBatchText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-brand-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Batch Omnichannel Notice</span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-navy font-bold">
                  {total} Selected
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                Broadcast official communications across email, push, and mobile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDispatching}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-200">
          {/* Email Availability Diagnostic Note */}
          <div className="p-3.5 rounded-2xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-gold shrink-0" />
              <span>
                <strong>{withEmailCount}</strong> of <strong>{total}</strong> selected attendees have email addresses recorded.
              </span>
            </div>
            {withEmailCount < total && (
              <span className="text-[11px] text-amber-400 font-semibold">
                Attendees without email will receive in-app &amp; push alerts
              </span>
            )}
          </div>

          {/* Delivery Channels */}
          <div>
            <label className="block text-neutral-400 font-semibold mb-2 text-xs uppercase tracking-wider">
              1. Delivery Channels
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'email', label: 'Email', icon: Mail, note: `${withEmailCount} recipients` },
                { id: 'in_app', label: 'In-App Alert', icon: Sparkles, note: 'Portal Feed' },
                { id: 'web_push', label: 'Web Push', icon: Send, note: 'Lockscreen PWA' },
                { id: 'whatsapp', label: 'WhatsApp', icon: Phone, note: 'Web / App Link' },
              ].map(({ id, label, icon: Icon, note }) => {
                const isSelected = selectedChannels.includes(id as NotificationChannel);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleChannel(id as NotificationChannel)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-brand-gold/15 border-brand-gold text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-gold' : 'text-neutral-400'}`} />
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold" />}
                    </div>
                    <div className="font-bold text-xs text-white">{label}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{note}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Preset & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-neutral-400 font-semibold mb-1.5 text-xs">
                2. Notification Template Preset
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as NotificationEventType)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-gold"
              >
                <option value="status_confirmed">🎉 Admission Confirmed &amp; Digital Pass Ready</option>
                <option value="camp_countdown">⏳ Camp Countdown Alert (T-7d / T-3d / T-24h)</option>
                <option value="registration_submitted">📄 Registration Under Review Notice</option>
                <option value="status_cancelled">❌ Application Cancelled / Waitlisted</option>
                <option value="custom_broadcast">📢 Official Organizers Announcement</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 font-semibold mb-1.5 text-xs">
                Language
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'ml' | 'ar')}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-gold"
              >
                <option value="en">English (Default)</option>
                <option value="ml">Malayalam (മലയാളം)</option>
                <option value="ar">Arabic (العربية)</option>
              </select>
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-neutral-400 font-semibold mb-1.5 text-xs">
              3. Custom Message (Optional)
            </label>
            <textarea
              rows={2}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Inject custom guidance or urgent reporting guidelines for this batch..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold text-xs resize-none"
            />
          </div>

          {/* Progress Bar when dispatching */}
          {isDispatching && (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-brand-gold/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                  <span>Dispatching in batches...</span>
                </span>
                <span className="font-mono text-brand-gold">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-gold to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-neutral-900 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyFormattedBroadcast}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-semibold text-xs"
            title="Copy pre-formatted text for WhatsApp Web Bulk Broadcast"
          >
            {copiedBatchText ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-brand-gold" />
            )}
            <span>{copiedBatchText ? 'Copied Template!' : 'Copy for WhatsApp Web'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isDispatching}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-semibold text-xs disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDispatching}
              onClick={handleBatchDispatch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {isDispatching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending to {total} Attendees...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Launch Batch Send ({total})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
