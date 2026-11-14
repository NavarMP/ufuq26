'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Registration, SuffaDars } from '@/types';
import {
  NotificationChannel,
  NotificationEventType,
  NotificationLog,
} from '@/types/notification';
import { useNotifications } from '@/context/NotificationContext';
import {
  SYSTEM_NOTIFICATION_TEMPLATES,
  TemplateVariables,
  formatWhatsAppMessage,
  buildHtmlEmail,
  buildWhatsAppLink,
  buildDirectSmsUri,
} from '@/lib/notifications/templateEngine';
import {
  Bell,
  Mail,
  Send,
  Phone,
  Sparkles,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Users,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  FileText,
  Settings2,
  Laptop,
  CheckCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NotificationManagerProps {
  registrations: Registration[];
  darsList: SuffaDars[];
}

type CommsTab = 'broadcast' | 'logs' | 'templates' | 'settings';

export default function NotificationManager({
  registrations,
  darsList,
}: NotificationManagerProps) {
  const {
    logs,
    refreshLogs,
    sendNotification,
    isSubscribedToPush,
    requestPushPermission,
    testNotificationChime,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<CommsTab>('broadcast');

  // Broadcast Studio State
  const [targetCohort, setTargetCohort] = useState<
    'all' | 'confirmed' | 'pending' | 'inside_gate' | 'outside_gate' | 'specific_dars'
  >('confirmed');
  const [selectedDarsRegNo, setSelectedDarsRegNo] = useState<string>('');
  const [selectedChannels, setSelectedChannels] = useState<NotificationChannel[]>([
    'email',
    'in_app',
  ]);
  const [selectedTemplateEvent, setSelectedTemplateEvent] =
    useState<NotificationEventType>('status_confirmed');
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [broadcastLocale, setBroadcastLocale] = useState<'en' | 'ml' | 'ar'>('en');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);

  // Logs Search & Filter
  const [logSearch, setLogSearch] = useState('');
  const [logChannelFilter, setLogChannelFilter] = useState<'all' | NotificationChannel>('all');
  const [isRefreshingLogs, setIsRefreshingLogs] = useState(false);

  // Template Viewer State
  const [inspectedTemplateKey, setInspectedTemplateKey] =
    useState<NotificationEventType>('status_confirmed');
  const [templateLocale, setTemplateLocale] = useState<'en' | 'ml' | 'ar'>('en');

  // Synchronize template content when template event changes
  useEffect(() => {
    const tpl = SYSTEM_NOTIFICATION_TEMPLATES[selectedTemplateEvent];
    if (tpl) {
      setCustomSubject(tpl.subject[broadcastLocale] || tpl.subject.en);
      setCustomBody(tpl.contentMarkdown[broadcastLocale] || tpl.contentMarkdown.en);
    }
  }, [selectedTemplateEvent, broadcastLocale]);

  // Compute Targeted Cohort
  const targetedAttendees = useMemo(() => {
    return registrations.filter((r) => {
      if (r.isArchived) return false;
      if (targetCohort === 'all') return true;
      if (targetCohort === 'confirmed') return r.status === 'confirmed';
      if (targetCohort === 'pending') return r.status === 'pending';
      if (targetCohort === 'inside_gate') return r.gateStatus === 'inside';
      if (targetCohort === 'outside_gate') return r.gateStatus !== 'inside';
      if (targetCohort === 'specific_dars') {
        return r.darsRegNo === selectedDarsRegNo || r.darsId === selectedDarsRegNo;
      }
      return true;
    });
  }, [registrations, targetCohort, selectedDarsRegNo]);

  // Compute Metrics & KPI stats
  const metrics = useMemo(() => {
    const totalSent = logs.length;
    const deliveredCount = logs.filter((l) => l.status === 'delivered' || l.status === 'sent').length;
    const deliverabilityRate = totalSent > 0 ? Math.round((deliveredCount / totalSent) * 100) : 100;
    const withEmail = registrations.filter((r) => !!r.email).length;
    const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;

    return {
      totalSent,
      deliveredCount,
      deliverabilityRate,
      withEmail,
      confirmedCount,
      totalAttendees: registrations.length,
    };
  }, [logs, registrations]);

  // Toggle delivery channel
  const toggleChannel = (ch: NotificationChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  // Insert Dynamic Token tag
  const insertToken = (token: string) => {
    setCustomBody((prev) => prev + ` {{${token}}}`);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (logChannelFilter !== 'all' && log.channel !== logChannelFilter) return false;
      if (!logSearch.trim()) return true;
      const q = logSearch.toLowerCase();
      return (
        log.recipientName?.toLowerCase().includes(q) ||
        log.recipientPhone?.includes(q) ||
        log.recipientEmail?.toLowerCase().includes(q) ||
        log.title?.toLowerCase().includes(q)
      );
    });
  }, [logs, logSearch, logChannelFilter]);

  // Handle Refresh Logs
  const handleRefreshLogs = async () => {
    setIsRefreshingLogs(true);
    await refreshLogs();
    setIsRefreshingLogs(false);
    toast.success('Telemetry logs refreshed', { icon: '🔄' });
  };

  // Launch Broadcast Dispatch
  const handleLaunchBroadcast = async () => {
    if (targetedAttendees.length === 0) {
      toast.error('Target cohort has 0 recipients.');
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error('Select at least one delivery channel.');
      return;
    }

    const confirmMsg = `Are you sure you want to dispatch this broadcast to ${targetedAttendees.length} recipients via ${selectedChannels.join(', ')}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsBroadcasting(true);
    setBroadcastProgress(0);
    let successCount = 0;

    const total = targetedAttendees.length;
    const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass';

    for (let i = 0; i < total; i++) {
      const reg = targetedAttendees[i];
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
        customMessage: customBody,
      };

      try {
        const res = await sendNotification({
          recipientId: reg.id,
          recipientName: reg.fullName,
          recipientPhone: reg.phone,
          recipientEmail: reg.email,
          channels: selectedChannels,
          eventType: selectedTemplateEvent,
          vars,
          locale: broadcastLocale,
          senderAdminEmail: 'admin@alathurpadidars.in',
        });
        if (res.success) successCount++;
      } catch (e) {
        // Continue loop
      }

      setBroadcastProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsBroadcasting(false);
    toast.success(`Broadcast completed! Successfully delivered to ${successCount} of ${total} recipients.`, {
      icon: '🎉',
      duration: 6000,
    });
    await refreshLogs();
  };

  // Send Test to Admin
  const handleSendTestPreview = async () => {
    const testVars: TemplateVariables = {
      fullName: 'Administrator (Preview)',
      phone: '+91 90745 25205',
      email: 'admin@alathurpadidars.in',
      regCode: 'UF26-TEST-0001',
      darsName: 'Alathurpadi Dars Central',
      status: 'confirmed',
      passUrl: `${window.location.origin}/#pass`,
      customMessage: customBody,
    };

    try {
      const res = await sendNotification({
        recipientId: 'test_admin_001',
        recipientName: 'Administrator',
        recipientPhone: '9074525205',
        channels: ['in_app', 'web_push'],
        eventType: selectedTemplateEvent,
        vars: testVars,
        locale: broadcastLocale,
      });

      if (res.success) {
        toast.success('Test notification delivered to your browser & in-app feed!', { icon: '✨' });
      }
    } catch (e: any) {
      toast.error('Test notification failed.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Banner & Quick Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-brand-navy/60 border border-brand-gold/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/40 shadow-inner">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-clash font-bold text-white tracking-tight">
                  Comms &amp; Broadcasts Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  OMNICHANNEL ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Automated status notifications, bulk email broadcasts, Web Push, and instant WhatsApp dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={testNotificationChime}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold border border-white/10 transition-colors"
              title="Test Acoustic Golden Chime"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Chime</span>
            </button>

            {!isSubscribedToPush ? (
              <button
                onClick={requestPushPermission}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-gold text-xs font-bold border border-brand-gold/40 transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Push Alerts</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Push Active</span>
              </span>
            )}
          </div>
        </div>

        {/* 2. KPI Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Total Dispatched
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {metrics.totalSent}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Across all channels</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Deliverability Rate
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {metrics.deliverabilityRate}%
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">High-trust delivery</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Email Addresses
            </div>
            <div className="text-xl font-bold font-mono text-brand-gold mt-1">
              {metrics.withEmail} / {metrics.totalAttendees}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Direct inbox reach</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Confirmed Passes
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {metrics.confirmedCount}
            </div>
            <div className="text-[10px] text-neutral-400 mt-0.5">Issued golden passes</div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold">
        {[
          { id: 'broadcast', label: 'Broadcast Studio', icon: Send },
          { id: 'logs', label: 'Delivery & Audit Logs', icon: Clock, count: logs.length },
          { id: 'templates', label: 'Template Library', icon: FileText },
          { id: 'settings', label: 'Channel Diagnostics', icon: Settings2 },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as CommsTab)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === id
                ? 'bg-brand-gold text-brand-navy font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === id ? 'bg-brand-navy text-brand-gold' : 'bg-white/10 text-neutral-300'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. BROADCAST STUDIO */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Compose Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl bg-neutral-900/60 border border-white/10 text-xs">
            {/* Target Cohort Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-gold" />
                  <span>Target Recipient Cohort</span>
                </label>
                <span className="font-mono text-brand-gold font-bold">
                  {targetedAttendees.length} Attendees Targeted
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'confirmed', label: 'All Confirmed Scholars' },
                  { id: 'pending', label: 'Pending Review' },
                  { id: 'inside_gate', label: 'Inside Campus Gate' },
                  { id: 'outside_gate', label: 'Outside Campus Gate' },
                  { id: 'all', label: 'All Active Attendees' },
                  { id: 'specific_dars', label: 'By Specific Dars' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTargetCohort(id as any)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      targetCohort === id
                        ? 'bg-brand-gold/15 border-brand-gold text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {targetCohort === 'specific_dars' && (
                <div className="mt-3">
                  <select
                    value={selectedDarsRegNo}
                    onChange={(e) => setSelectedDarsRegNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-brand-gold/40 text-white font-medium focus:outline-none"
                  >
                    <option value="">Select SUFFA Dars Institution...</option>
                    {darsList.map((d) => (
                      <option key={d.regNo} value={d.regNo}>
                        {d.regNo} — {d.nameEn} ({d.district || 'Kerala'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Delivery Channels */}
            <div>
              <label className="block font-bold text-white mb-2 text-xs uppercase tracking-wider">
                Select Dispatch Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'email', label: 'Email', icon: Mail, note: 'Resend / HTML' },
                  { id: 'in_app', label: 'In-App Alert', icon: Sparkles, note: 'Summit Feed' },
                  { id: 'web_push', label: 'Web Push', icon: Send, note: 'Lockscreen' },
                  { id: 'whatsapp', label: 'WhatsApp', icon: Phone, note: 'wa.me Links' },
                ].map(({ id, label, icon: Icon, note }) => {
                  const isSelected = selectedChannels.includes(id as NotificationChannel);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleChannel(id as NotificationChannel)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-gold/15 border-brand-gold text-white'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
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

            {/* Template Preset & Locale */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-300 mb-1.5 text-xs">
                  Template Preset
                </label>
                <select
                  value={selectedTemplateEvent}
                  onChange={(e) => setSelectedTemplateEvent(e.target.value as NotificationEventType)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-gold"
                >
                  <option value="status_confirmed">🎉 Admission Confirmed &amp; Pass Ready</option>
                  <option value="camp_countdown">⏳ Camp Countdown Alert (T-7d / T-3d / T-24h)</option>
                  <option value="registration_submitted">📄 Application Received Notice</option>
                  <option value="status_cancelled">❌ Application Cancelled / Waitlisted</option>
                  <option value="gate_entry">🚪 Campus Gate Check-In</option>
                  <option value="session_reminder">🔔 Keynote Session Alert</option>
                  <option value="custom_broadcast">📢 Custom Announcement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-300 mb-1.5 text-xs">
                  Language
                </label>
                <select
                  value={broadcastLocale}
                  onChange={(e) => setBroadcastLocale(e.target.value as 'en' | 'ml' | 'ar')}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-gold"
                >
                  <option value="en">English (Default)</option>
                  <option value="ml">Malayalam (മലയാളം)</option>
                  <option value="ar">Arabic (العربية)</option>
                </select>
              </div>
            </div>

            {/* Subject Line */}
            <div>
              <label className="block font-semibold text-neutral-300 mb-1 text-xs">
                Email / Notification Subject
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white font-medium focus:outline-none focus:border-brand-gold text-xs"
              />
            </div>

            {/* Dynamic Tokens Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-neutral-300 text-xs">
                  Message Body (Markdown &amp; Dynamic Tags)
                </label>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {['fullName', 'regCode', 'darsName', 'status', 'passUrl'].map((tok) => (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => insertToken(tok)}
                      className="px-2 py-0.5 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-[10px] font-mono border border-brand-gold/20 transition-colors"
                      title={`Insert {{${tok}}}`}
                    >
                      +{tok}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={6}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full p-3 rounded-2xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold text-xs resize-y font-mono leading-relaxed"
              />
            </div>

            {/* Broadcast Progress Bar */}
            {isBroadcasting && (
              <div className="p-4 rounded-2xl bg-black/40 border border-brand-gold/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                    <span>Dispatching broadcast to cohort...</span>
                  </span>
                  <span className="font-mono text-brand-gold">{broadcastProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold to-emerald-400 transition-all duration-300"
                    style={{ width: `${broadcastProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSendTestPreview}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-neutral-200 hover:text-white hover:bg-white/5 font-semibold text-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-brand-gold" />
                <span>Send Test Preview</span>
              </button>

              <button
                type="button"
                disabled={isBroadcasting}
                onClick={handleLaunchBroadcast}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-hover text-brand-navy font-bold text-xs shadow-xl transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Broadcast...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch Broadcast ({targetedAttendees.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live Device Preview Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-brand-gold" />
                <span>Live Rendering Stage</span>
              </span>

              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile'
                      ? 'bg-brand-gold text-brand-navy font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop'
                      ? 'bg-brand-gold text-brand-navy font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Laptop className="w-3 h-3" />
                  <span>Email Client</span>
                </button>
              </div>
            </div>

            {/* Device Container */}
            {previewDevice === 'mobile' ? (
              <div className="mx-auto max-w-[340px] rounded-[36px] bg-neutral-950 border-4 border-neutral-800 shadow-2xl p-4 text-xs overflow-hidden">
                {/* Dynamic Island / Speaker */}
                <div className="w-24 h-4 bg-neutral-800 rounded-full mx-auto mb-4" />

                {/* Lockscreen Notification Bubble */}
                <div className="p-3.5 rounded-2xl bg-neutral-900/90 border border-brand-gold/30 shadow-lg text-white space-y-1 mb-4">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="font-semibold text-brand-gold flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      <span>UFUQ ’26</span>
                    </span>
                    <span>now</span>
                  </div>
                  <div className="font-bold text-xs text-white">
                    {customSubject || 'UFUQ ’26 Notification'}
                  </div>
                  <div className="text-[11px] text-neutral-300 line-clamp-2">
                    {customBody.slice(0, 100)}...
                  </div>
                </div>

                {/* In-App Pass Card Preview */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-brand-dark to-neutral-950 border border-brand-gold/40 text-center space-y-2">
                  <span className="text-[9px] font-bold text-brand-gold tracking-widest uppercase">
                    Alathurpadi Dars Campus
                  </span>
                  <div className="font-clash text-lg font-bold text-white">
                    UFUQ <span className="text-brand-gold">’26</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/60 font-mono text-brand-gold text-xs font-bold border border-brand-gold/20">
                    UF26-SCH-0042
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    STATUS: CONFIRMED
                  </div>
                  <div className="w-full py-2 bg-brand-gold text-brand-navy rounded-xl font-bold text-[11px]">
                    Open Digital Pass
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-neutral-950 border border-white/10 p-5 shadow-2xl space-y-4 text-xs">
                <div className="border-b border-white/10 pb-3 space-y-1">
                  <div className="text-[10px] text-neutral-400">
                    From: <strong className="text-neutral-200">UFUQ ’26 Organizers &lt;onboarding@resend.dev&gt;</strong>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Subject: <strong className="text-brand-gold">{customSubject}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900 border border-brand-gold/30 space-y-3">
                  <div className="text-right font-serif text-brand-gold text-sm">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                  <div className="font-bold text-sm text-white">
                    Assalamu Alaikum Muhammad Rashid,
                  </div>
                  <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {customBody}
                  </div>
                  <div className="p-3 rounded-xl bg-black/50 border border-brand-gold/30 text-center">
                    <span className="font-mono text-brand-gold text-sm font-bold tracking-wider">
                      UF26-SCH-0042
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. DELIVERY & AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4 p-6 rounded-3xl bg-neutral-900/60 border border-white/10 text-xs">
          {/* Controls: Search, Channel Filter & Refresh */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search recipient name, phone, or title..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <select
                value={logChannelFilter}
                onChange={(e) => setLogChannelFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white text-xs focus:outline-none focus:border-brand-gold"
              >
                <option value="all">All Channels</option>
                <option value="email">Email</option>
                <option value="web_push">Web Push</option>
                <option value="in_app">In-App</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <button
              onClick={handleRefreshLogs}
              disabled={isRefreshingLogs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold text-xs border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingLogs ? 'animate-spin text-brand-gold' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 font-semibold uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Subject / Body Preview</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400">
                      No logs matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'delivered' || log.status === 'sent'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {log.status === 'delivered' || log.status === 'sent' ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : (
                            <AlertCircle className="w-2.5 h-2.5" />
                          )}
                          <span className="capitalize">{log.status}</span>
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-white">{log.recipientName}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {log.recipientPhone} {log.recipientEmail ? `• ${log.recipientEmail}` : ''}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-lg bg-white/5 text-neutral-300 font-mono text-[10px] uppercase">
                          {log.channel}
                        </span>
                      </td>

                      <td className="p-3 text-neutral-300 font-medium">
                        {log.eventType.replace(/_/g, ' ')}
                      </td>

                      <td className="p-3 text-neutral-400 max-w-xs truncate">
                        <strong className="text-neutral-200">{log.title}:</strong> {log.bodyPreview}
                      </td>

                      <td className="p-3 text-right font-mono text-neutral-400 text-[10px]">
                        {new Date(log.sentAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. TEMPLATE LIBRARY */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Templates List (4 cols) */}
          <div className="lg:col-span-4 space-y-2 p-4 rounded-3xl bg-neutral-900/60 border border-white/10 text-xs">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3 px-2">
              System Templates
            </h3>
            {Object.entries(SYSTEM_NOTIFICATION_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                type="button"
                onClick={() => setInspectedTemplateKey(key as NotificationEventType)}
                className={`w-full p-3 rounded-2xl border text-left transition-all ${
                  inspectedTemplateKey === key
                    ? 'bg-brand-gold/15 border-brand-gold text-white font-bold'
                    : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{tpl.name}</div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                  Type: {tpl.eventType}
                </div>
              </button>
            ))}
          </div>

          {/* Template Inspector (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900/60 border border-white/10 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-bold text-base text-white">
                  {SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.name}
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Event: <code className="text-brand-gold">{inspectedTemplateKey}</code>
                </p>
              </div>

              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-white/10">
                {(['en', 'ml', 'ar'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setTemplateLocale(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                      templateLocale === l
                        ? 'bg-brand-gold text-brand-navy font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-400 mb-1 text-[11px]">
                Subject Header
              </label>
              <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 text-white font-medium">
                {SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.subject[templateLocale] ||
                  SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.subject.en}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-400 mb-1 text-[11px]">
                Markdown Content
              </label>
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 text-neutral-300 font-mono text-xs leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                {SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.contentMarkdown[templateLocale] ||
                  SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.contentMarkdown.en}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-neutral-400">Interpolated Tokens:</span>
              {SYSTEM_NOTIFICATION_TEMPLATES[inspectedTemplateKey]?.variables.map((v) => (
                <span
                  key={v}
                  className="px-2 py-0.5 rounded-lg bg-brand-gold/15 text-brand-gold font-mono text-[10px]"
                >
                  &#123;&#123;{v}&#125;&#125;
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. CHANNEL SETTINGS & DIAGNOSTICS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Card 1: Email Gateway (Resend / SMTP) */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Transactional Email (Resend)</h4>
                <p className="text-[11px] text-neutral-400">3,000 Free Emails / Month</p>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Emails are dispatched via Resend REST API or written directly to Firestore’s <code className="text-brand-gold">mail</code> collection for background queuing.
            </p>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Sender Domain:</span>
                <span className="font-mono text-white">onboarding@resend.dev</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Deliverability:</span>
                <span className="font-semibold text-emerald-400">DKIM / SPF Verified</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Daily Throttle:</span>
                <span className="font-mono text-brand-gold">100 / day (3,000 / mo)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Web Push & PWA Notifications */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Web Push &amp; In-App Chimes</h4>
                <p className="text-[11px] text-neutral-400">100% Free &amp; Unlimited</p>
              </div>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              Standard W3C Push API and Service Worker deliver lockscreen banners even when the app is closed. Paired with harmonic golden acoustic bell chimes.
            </p>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Browser Permission:</span>
                <span className="font-semibold text-emerald-400">
                  {isSubscribedToPush ? 'Active & Granted' : 'Pending Opt-in'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Audio Feedback:</span>
                <span className="font-semibold text-brand-gold">Harmonic Bell Chime (F Major)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
