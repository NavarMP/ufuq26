'use client';

import React, { useState } from 'react';
import { Registration } from '@/types';
import { NotificationChannel, NotificationEventType } from '@/types/notification';
import { useNotifications } from '@/context/NotificationContext';
import {
  SYSTEM_NOTIFICATION_TEMPLATES,
  TemplateVariables,
  formatWhatsAppMessage,
  buildWhatsAppLink,
  buildDirectSmsUri,
} from '@/lib/notifications/templateEngine';
import {
  X,
  Send,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Eye,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SendNoticeModalProps {
  registration: Registration;
  isOpen: boolean;
  onClose: () => void;
}

export default function SendNoticeModal({
  registration,
  isOpen,
  onClose,
}: SendNoticeModalProps) {
  const { sendNotification } = useNotifications();

  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>(['email', 'in_app']);
  const [eventType, setEventType] = useState<NotificationEventType>(
    registration.status === 'confirmed' ? 'status_confirmed' : 'registration_submitted'
  );
  const [customNote, setCustomNote] = useState('');
  const [locale, setLocale] = useState<'en' | 'ml' | 'ar'>('en');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const vars: TemplateVariables = {
    fullName: registration.fullName,
    phone: registration.phone,
    email: registration.email,
    regCode: registration.regCode || registration.id,
    id: registration.id,
    darsName: registration.darsName,
    darsRegNo: registration.darsRegNo,
    darsMudarris: registration.darsMudarris,
    status: registration.status,
    passUrl: typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass',
    customMessage: customNote || undefined,
  };

  const toggleChannel = (ch: NotificationChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  const currentTemplate = SYSTEM_NOTIFICATION_TEMPLATES[eventType];
  const previewSubject = currentTemplate?.subject[locale] || currentTemplate?.subject.en;
  const previewBody = currentTemplate?.contentMarkdown[locale] || currentTemplate?.contentMarkdown.en;

  const handleSend = async () => {
    if (selectedChannels.length === 0) {
      toast.error('Please select at least one channel to dispatch notice.');
      return;
    }

    if (selectedChannels.includes('email') && !registration.email) {
      toast.error('This student does not have an email address recorded. Uncheck email or add an email.');
      return;
    }

    setIsSending(true);
    try {
      const res = await sendNotification({
        recipientId: registration.id,
        recipientName: registration.fullName,
        recipientPhone: registration.phone,
        recipientEmail: registration.email,
        channels: selectedChannels,
        eventType,
        vars,
        locale,
        senderAdminEmail: 'admin@alathurpadidars.in',
      });

      if (res.success) {
        toast.success(`Notice dispatched to ${registration.fullName}!`, { icon: '📨' });
        onClose();
      } else {
        toast.error('Could not complete all dispatch channels.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Dispatch failed.');
    } finally {
      setIsSending(false);
    }
  };

  // 1-Click WhatsApp Quick Action
  const handleLaunchWhatsApp = () => {
    const waText = formatWhatsAppMessage(eventType, vars, locale);
    const link = buildWhatsAppLink(registration.phone, waText);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // 1-Click Native Carrier SMS Quick Action
  const handleLaunchDirectSms = () => {
    const smsText = `UFUQ '26: Assalamu Alaikum ${registration.fullName}. Your registration code is ${registration.regCode || registration.id}. Check status & digital pass at: https://alathurpadidars.in/#pass`;
    const uri = buildDirectSmsUri(registration.phone, smsText);
    window.location.href = uri;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-brand-gold/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Send Notice &amp; Alert</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                  {registration.regCode || registration.id}
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                To: <strong className="text-neutral-200">{registration.fullName}</strong> • {registration.darsName || 'Direct Scholar'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-200">
          {/* Quick-action 1-click Free buttons */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-neutral-400">
              Instant Free Mobile Dispatch:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-transform active:scale-95"
                title="Open WhatsApp with pre-filled formatted template"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={handleLaunchDirectSms}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition-transform active:scale-95"
                title="Open Native SMS app with 100% free carrier dispatch"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Native Free SMS</span>
              </button>
            </div>
          </div>

          {/* Channel Multi-Selection */}
          <div>
            <label className="block text-neutral-400 font-semibold mb-2 text-xs uppercase tracking-wider">
              1. Select Delivery Channels
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'email', label: 'Email', icon: Mail, disabled: !registration.email, note: registration.email || 'No email' },
                { id: 'in_app', label: 'In-App Alert', icon: Sparkles, disabled: false, note: 'Portal Feed' },
                { id: 'web_push', label: 'Web Push', icon: Send, disabled: false, note: 'Lockscreen' },
                { id: 'sms', label: 'Carrier SMS', icon: Smartphone, disabled: false, note: '100% Free' },
              ].map(({ id, label, icon: Icon, disabled, note }) => {
                const isSelected = selectedChannels.includes(id as NotificationChannel);
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleChannel(id as NotificationChannel)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      disabled
                        ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]'
                        : isSelected
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
                <option value="status_confirmed">🎉 Admission Confirmed &amp; Digital Pass Issued</option>
                <option value="registration_submitted">📄 Registration Application Received</option>
                <option value="status_pending">⏳ Status Under Review</option>
                <option value="status_cancelled">❌ Application Cancelled / Waitlisted</option>
                <option value="gate_entry">🚪 Campus Gate Check-In Verified</option>
                <option value="custom_broadcast">📢 Custom Administrator Notice</option>
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

          {/* Custom Note Injection */}
          <div>
            <label className="block text-neutral-400 font-semibold mb-1.5 text-xs">
              3. Custom Note / Instruction (Optional)
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Please bring your original identity card and reporting slip before 8:30 AM..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold text-xs resize-none"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-neutral-900/80 border border-brand-gold/20 space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-[11px] font-semibold border-b border-white/5 pb-2">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-brand-gold" />
                <span>Rendered Preview</span>
              </span>
              <span className="font-mono text-[10px] text-brand-gold">
                Subject: {previewSubject?.slice(0, 35)}...
              </span>
            </div>
            <p className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed font-sans max-h-28 overflow-y-auto">
              {previewBody?.slice(0, 260)}...
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-neutral-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-semibold text-xs"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSending}
            onClick={handleSend}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Notice Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
