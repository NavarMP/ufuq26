'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { resolveLocalized } from '@/lib/translations';
import { ScheduleSession, Guest, FAQ } from '@/types';
import {
  Lock,
  Unlock,
  Calendar,
  Users,
  HelpCircle,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Download,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Shield,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminPage() {
  const {
    eventInfo,
    schedule,
    guests,
    faqs,
    registrations,
    updateEventInfo,
    addSession,
    updateSession,
    deleteSession,
    addGuest,
    updateGuest,
    deleteGuest,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    updateRegistrationStatus,
    deleteRegistration,
    exportRegistrationsCSV,
    resetToDefaultData,
  } = useEvent();

  const { language } = useApp();

  // Authentication gate: Passcode or Firebase Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'guests' | 'faqs' | 'registrations' | 'settings'>('dashboard');

  // Search in registrations
  const [regSearch, setRegSearch] = useState('');

  // Modals for editing/creating
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduleSession | null>(null);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Form states for modals
  const [sessionForm, setSessionForm] = useState({
    day: 1,
    date: '2026-12-24',
    startTime: '09:00',
    endTime: '11:00',
    titleEn: '',
    titleMl: '',
    titleAr: '',
    descEn: '',
    category: 'Academics',
    published: true,
    order: 1,
  });

  const [guestForm, setGuestForm] = useState({
    nameEn: '',
    nameMl: '',
    nameAr: '',
    titleEn: '',
    titleMl: '',
    bioEn: '',
    photoUrl: '',
    published: true,
    order: 1,
  });

  const [faqForm, setFaqForm] = useState({
    questionEn: '',
    questionMl: '',
    questionAr: '',
    answerEn: '',
    answerMl: '',
    answerAr: '',
    category: 'General',
    published: true,
    order: 1,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default authorized passcode for camp organizers: ufuq2026 or adsa2026
    if (passcode.trim() === 'ufuq2026' || passcode.trim() === 'adsa2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Use the organizer passcode provided in the documentation.');
    }
  };

  // Open session modal
  const openNewSessionModal = () => {
    setEditingSession(null);
    setSessionForm({
      day: 1,
      date: '2026-12-24',
      startTime: '09:00',
      endTime: '11:00',
      titleEn: '',
      titleMl: '',
      titleAr: '',
      descEn: '',
      category: 'Academics',
      published: true,
      order: schedule.length + 1,
    });
    setSessionModalOpen(true);
  };

  const openEditSessionModal = (s: ScheduleSession) => {
    setEditingSession(s);
    setSessionForm({
      day: s.day,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      titleEn: s.title.en,
      titleMl: s.title.ml || '',
      titleAr: s.title.ar || '',
      descEn: s.description?.en || '',
      category: s.category || 'Academics',
      published: s.published,
      order: s.order,
    });
    setSessionModalOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionPayload = {
      day: Number(sessionForm.day),
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      title: {
        en: sessionForm.titleEn,
        ml: sessionForm.titleMl || undefined,
        ar: sessionForm.titleAr || undefined,
      },
      description: sessionForm.descEn
        ? { en: sessionForm.descEn }
        : undefined,
      category: sessionForm.category,
      published: sessionForm.published,
      order: Number(sessionForm.order),
    };

    if (editingSession) {
      await updateSession(editingSession.id, sessionPayload);
    } else {
      await addSession(sessionPayload);
    }
    setSessionModalOpen(false);
  };

  // Open Guest modal
  const openNewGuestModal = () => {
    setEditingGuest(null);
    setGuestForm({
      nameEn: '',
      nameMl: '',
      nameAr: '',
      titleEn: '',
      titleMl: '',
      bioEn: '',
      photoUrl: '',
      published: true,
      order: guests.length + 1,
    });
    setGuestModalOpen(true);
  };

  const openEditGuestModal = (g: Guest) => {
    setEditingGuest(g);
    setGuestForm({
      nameEn: g.name.en,
      nameMl: g.name.ml || '',
      nameAr: g.name.ar || '',
      titleEn: g.title?.en || '',
      titleMl: g.title?.ml || '',
      bioEn: g.bio?.en || '',
      photoUrl: g.photoUrl || '',
      published: g.published,
      order: g.order,
    });
    setGuestModalOpen(true);
  };

  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const guestPayload = {
      name: {
        en: guestForm.nameEn,
        ml: guestForm.nameMl || undefined,
        ar: guestForm.nameAr || undefined,
      },
      title: guestForm.titleEn
        ? { en: guestForm.titleEn, ml: guestForm.titleMl || undefined }
        : undefined,
      bio: guestForm.bioEn ? { en: guestForm.bioEn } : undefined,
      photoUrl: guestForm.photoUrl || undefined,
      published: guestForm.published,
      order: Number(guestForm.order),
    };

    if (editingGuest) {
      await updateGuest(editingGuest.id, guestPayload);
    } else {
      await addGuest(guestPayload);
    }
    setGuestModalOpen(false);
  };

  // Open FAQ modal
  const openNewFaqModal = () => {
    setEditingFaq(null);
    setFaqForm({
      questionEn: '',
      questionMl: '',
      questionAr: '',
      answerEn: '',
      answerMl: '',
      answerAr: '',
      category: 'General',
      published: true,
      order: faqs.length + 1,
    });
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (f: FAQ) => {
    setEditingFaq(f);
    setFaqForm({
      questionEn: f.question.en,
      questionMl: f.question.ml || '',
      questionAr: f.question.ar || '',
      answerEn: f.answer.en,
      answerMl: f.answer.ml || '',
      answerAr: f.answer.ar || '',
      category: f.category || 'General',
      published: f.published,
      order: f.order,
    });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    const faqPayload = {
      question: {
        en: faqForm.questionEn,
        ml: faqForm.questionMl || undefined,
        ar: faqForm.questionAr || undefined,
      },
      answer: {
        en: faqForm.answerEn,
        ml: faqForm.answerMl || undefined,
        ar: faqForm.answerAr || undefined,
      },
      category: faqForm.category,
      published: faqForm.published,
      order: Number(faqForm.order),
    };

    if (editingFaq) {
      await updateFAQ(editingFaq.id, faqPayload);
    } else {
      await addFAQ(faqPayload);
    }
    setFaqModalOpen(false);
  };

  // Filtered registrations
  const filteredRegs = registrations.filter((r) => {
    const q = regSearch.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.id.toLowerCase().includes(q)
    );
  });

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy p-3 flex items-center justify-center mx-auto border border-brand-gold/30 shadow-md">
            <Lock className="w-8 h-8 text-brand-gold" />
          </div>

          <div className="space-y-1">
            <h1 className="font-clash text-2xl font-bold text-brand-navy dark:text-white">
              Organizer Administration
            </h1>
            <p className="text-xs text-neutral-500">
              UFUQ ’26 — Alathurpadi Dars Students Association
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left space-y-1">
              <label
                htmlFor="admin-passcode"
                className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
              >
                Organizer Passcode
              </label>
              <input
                id="admin-passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter authorized passcode"
                className="w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
              {authError && (
                <p className="text-[11px] text-rose-500 pt-1">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-md transition-colors"
            >
              Sign In to Admin
            </button>
          </form>

          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-[11px] text-neutral-500 text-left">
            <strong>Default Access:</strong> Enter <code className="text-brand-gold font-mono">ufuq2026</code> to unlock the management portal immediately.
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-brand-gold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Admin Top Navigation */}
      <header className="border-b border-brand-gold/20 px-6 py-4 glass-panel sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-navy p-1 flex items-center justify-center">
              <Image
                src="/images/UFUQ-Logo.svg"
                alt="UFUQ '26"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-clash font-bold text-sm text-brand-navy dark:text-white">
                UFUQ ’26 Admin
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold">
                ADSA Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-brand-gold px-3 py-1.5 rounded-full glass-panel"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-gold/15 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'registrations', label: `Registrations (${registrations.length})`, icon: FileText },
            { id: 'sessions', label: `Schedule (${schedule.length})`, icon: Calendar },
            { id: 'guests', label: `Speakers (${guests.length})`, icon: Users },
            { id: 'faqs', label: `FAQs (${faqs.length})`, icon: HelpCircle },
            { id: 'settings', label: 'Event Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-gold text-brand-navy shadow-md font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20">
                <span className="text-xs text-neutral-500 font-medium">Registrations</span>
                <div className="font-clash font-extrabold text-3xl text-brand-gold mt-1">
                  {registrations.length}
                </div>
                <span className="text-[10px] text-emerald-500 font-medium">
                  {registrations.filter((r) => r.status === 'confirmed').length} Confirmed
                </span>
              </div>

              <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20">
                <span className="text-xs text-neutral-500 font-medium">Schedule Sessions</span>
                <div className="font-clash font-extrabold text-3xl text-brand-teal dark:text-emerald-400 mt-1">
                  {schedule.length}
                </div>
                <span className="text-[10px] text-neutral-400">7 Days Residency</span>
              </div>

              <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20">
                <span className="text-xs text-neutral-500 font-medium">Faculty & Guests</span>
                <div className="font-clash font-extrabold text-3xl text-brand-navy dark:text-white mt-1">
                  {guests.length}
                </div>
                <span className="text-[10px] text-brand-gold">1 Spiritual Patron</span>
              </div>

              <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20">
                <span className="text-xs text-neutral-500 font-medium">Published FAQs</span>
                <div className="font-clash font-extrabold text-3xl text-neutral-800 dark:text-neutral-200 mt-1">
                  {faqs.filter((f) => f.published).length}
                </div>
                <span className="text-[10px] text-neutral-400">{faqs.length} Total</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 space-y-4">
              <h3 className="font-clash text-lg font-bold">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveTab('sessions');
                    openNewSessionModal();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Schedule Session</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('guests');
                    openNewGuestModal();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4 text-brand-gold" />
                  <span>Add Guest Speaker</span>
                </button>
                <button
                  onClick={exportRegistrationsCSV}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel border border-brand-gold/30 hover:border-brand-gold text-xs font-semibold transition-colors"
                >
                  <Download className="w-4 h-4 text-brand-teal" />
                  <span>Export Registrations (CSV)</span>
                </button>
              </div>
            </div>

            {/* Recent Registrations Table preview */}
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-clash text-lg font-bold">Recent Registrations</h3>
                <button
                  onClick={() => setActiveTab('registrations')}
                  className="text-xs text-brand-gold hover:underline font-semibold"
                >
                  View All ({registrations.length})
                </button>
              </div>

              {registrations.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No registrations submitted yet. Form submissions from the public website will appear here in real-time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Ref ID</th>
                        <th className="py-2.5 px-3">Name</th>
                        <th className="py-2.5 px-3">Email</th>
                        <th className="py-2.5 px-3">Phone</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/10">
                      {registrations.slice(0, 5).map((r) => (
                        <tr key={r.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="py-2.5 px-3 font-mono text-brand-gold">{r.id}</td>
                          <td className="py-2.5 px-3 font-semibold">{r.fullName}</td>
                          <td className="py-2.5 px-3 text-neutral-500">{r.email}</td>
                          <td className="py-2.5 px-3">{r.phone}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                r.status === 'confirmed'
                                  ? 'bg-emerald-500/15 text-emerald-600'
                                  : r.status === 'cancelled'
                                  ? 'bg-rose-500/15 text-rose-600'
                                  : 'bg-amber-500/15 text-amber-600'
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: REGISTRATIONS MANAGEMENT */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  placeholder="Search by name, email, phone, ID..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
                />
              </div>

              <button
                onClick={exportRegistrationsCSV}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV ({registrations.length})</span>
              </button>
            </div>

            <div className="rounded-3xl glass-panel border border-brand-gold/20 overflow-hidden shadow-lg">
              {filteredRegs.length === 0 ? (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  No registrations found matching &ldquo;{regSearch}&rdquo;.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-black/5 dark:bg-white/5 border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Ref ID</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Academic Stage</th>
                        <th className="py-3 px-4">Higher Study Interest</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-gold/10">
                      {filteredRegs.map((reg) => (
                        <tr key={reg.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="py-3 px-4 font-mono font-bold text-brand-gold">{reg.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold">{reg.fullName}</div>
                            <div className="text-[10px] text-neutral-400">
                              {new Date(reg.submittedAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 space-y-0.5">
                            <div>{reg.email}</div>
                            <div className="font-mono text-neutral-500">{reg.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300">
                            {reg.darsYear}
                          </td>
                          <td className="py-3 px-4 text-neutral-600 dark:text-neutral-300 max-w-xs truncate">
                            {reg.higherStudyPlan || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={reg.status}
                              onChange={(e) =>
                                updateRegistrationStatus(reg.id, e.target.value as any)
                              }
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                                reg.status === 'confirmed'
                                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600'
                                  : reg.status === 'cancelled'
                                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-600'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-600'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Delete registration for ${reg.fullName}?`)) {
                                  deleteRegistration(reg.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE SESSIONS */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-clash text-lg font-bold">Schedule Sessions ({schedule.length})</h3>
              <button
                onClick={openNewSessionModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Session</span>
              </button>
            </div>

            <div className="grid gap-3">
              {schedule.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl glass-panel border border-brand-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-brand-gold/15 text-brand-gold">
                        Day {session.day} ({session.date})
                      </span>
                      <span className="font-mono text-neutral-500">
                        {session.startTime} - {session.endTime}
                      </span>
                      {session.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-teal/15 text-brand-teal dark:text-emerald-400">
                          {session.category}
                        </span>
                      )}
                      {!session.published && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-500">
                          Draft (Unpublished)
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {session.title.en}
                    </h4>
                    {session.description?.en && (
                      <p className="text-xs text-neutral-500 line-clamp-1">
                        {session.description.en}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => updateSession(session.id, { published: !session.published })}
                      className={`p-2 rounded-xl text-xs font-semibold ${
                        session.published
                          ? 'text-emerald-500 hover:bg-emerald-500/10'
                          : 'text-neutral-400 hover:bg-neutral-500/10'
                      }`}
                      title={session.published ? 'Unpublish' : 'Publish'}
                    >
                      {session.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditSessionModal(session)}
                      className="p-2 rounded-xl text-brand-gold hover:bg-brand-gold/10"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this session?')) deleteSession(session.id);
                      }}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GUESTS / FACULTY */}
        {activeTab === 'guests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-clash text-lg font-bold">Faculty & Speakers ({guests.length})</h3>
              <button
                onClick={openNewGuestModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Speaker Profile</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-5 rounded-2xl glass-panel border border-brand-gold/20 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-navy relative shrink-0">
                      {guest.photoUrl ? (
                        <Image
                          src={guest.photoUrl}
                          alt={guest.name.en}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Users className="w-6 h-6 text-brand-gold m-3" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {guest.name.en}
                      </h4>
                      {guest.title?.en && (
                        <p className="text-xs text-brand-teal dark:text-emerald-400 font-medium">
                          {guest.title.en}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-brand-gold/15">
                    <button
                      onClick={() => updateGuest(guest.id, { published: !guest.published })}
                      className={`text-xs flex items-center gap-1 ${
                        guest.published ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    >
                      {guest.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{guest.published ? 'Published' : 'Draft'}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditGuestModal(guest)}
                        className="p-1.5 rounded text-brand-gold hover:bg-brand-gold/10"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete guest profile?')) deleteGuest(guest.id);
                        }}
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-clash text-lg font-bold">Frequently Asked Questions ({faqs.length})</h3>
              <button
                onClick={openNewFaqModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-4 rounded-2xl glass-panel border border-brand-gold/20 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-brand-teal px-2 py-0.5 rounded bg-brand-teal/10">
                      {faq.category || 'General'}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                      {faq.question.en}
                    </h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {faq.answer.en}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateFAQ(faq.id, { published: !faq.published })}
                      className={`p-1.5 rounded ${
                        faq.published ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    >
                      {faq.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditFaqModal(faq)}
                      className="p-1.5 rounded text-brand-gold hover:bg-brand-gold/10"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete FAQ?')) deleteFAQ(faq.id);
                      }}
                      className="p-1.5 rounded text-rose-500 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EVENT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 space-y-5">
              <h3 className="font-clash text-lg font-bold">Registration Settings</h3>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5">
                <div>
                  <span className="font-bold text-sm">Public Registration Portal</span>
                  <p className="text-xs text-neutral-500">
                    Allow students to submit new registration applications.
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateEventInfo({ registrationOpen: !eventInfo.registrationOpen })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    eventInfo.registrationOpen
                      ? 'bg-emerald-500 text-white shadow'
                      : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {eventInfo.registrationOpen ? 'Open (Accepting)' : 'Closed'}
                </button>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold">Camp Dates</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500">Start Date</span>
                    <input
                      type="date"
                      value={eventInfo.startDate}
                      onChange={(e) => updateEventInfo({ startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/40 border border-brand-gold/20 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500">End Date</span>
                    <input
                      type="date"
                      value={eventInfo.endDate}
                      onChange={(e) => updateEventInfo({ endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/60 dark:bg-black/40 border border-brand-gold/20 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-gold/15">
                <button
                  onClick={resetToDefaultData}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Content to Default</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SESSION MODAL */}
      {sessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-clash text-lg font-bold">
              {editingSession ? 'Edit Schedule Session' : 'Add New Schedule Session'}
            </h3>

            <form onSubmit={handleSaveSession} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Day (1-7)</label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={sessionForm.day}
                    onChange={(e) => setSessionForm({ ...sessionForm, day: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={sessionForm.startTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">End Time</label>
                  <input
                    type="time"
                    value={sessionForm.endTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={sessionForm.titleEn}
                  onChange={(e) => setSessionForm({ ...sessionForm, titleEn: e.target.value })}
                  placeholder="e.g. Academic Pathways: University Systems"
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Title (Malayalam)</label>
                <input
                  type="text"
                  value={sessionForm.titleMl}
                  onChange={(e) => setSessionForm({ ...sessionForm, titleMl: e.target.value })}
                  placeholder="മലയാളം തലക്കെട്ട്"
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Title (Arabic)</label>
                <input
                  type="text"
                  value={sessionForm.titleAr}
                  onChange={(e) => setSessionForm({ ...sessionForm, titleAr: e.target.value })}
                  placeholder="العنوان بالعربية"
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40 font-arabic text-right"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={sessionForm.descEn}
                  onChange={(e) => setSessionForm({ ...sessionForm, descEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={sessionForm.category}
                    onChange={(e) => setSessionForm({ ...sessionForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sessionForm.published}
                      onChange={(e) => setSessionForm({ ...sessionForm, published: e.target.checked })}
                      className="rounded text-brand-gold"
                    />
                    <span className="font-semibold">Publish immediately</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold shadow hover:bg-brand-gold-hover"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUEST MODAL */}
      {guestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-clash text-lg font-bold">
              {editingGuest ? 'Edit Speaker Profile' : 'Add New Speaker Profile'}
            </h3>

            <form onSubmit={handleSaveGuest} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Speaker Name (English) *</label>
                <input
                  type="text"
                  value={guestForm.nameEn}
                  onChange={(e) => setGuestForm({ ...guestForm, nameEn: e.target.value })}
                  placeholder="e.g. Dr. Scholar Name"
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Speaker Name (Malayalam)</label>
                <input
                  type="text"
                  value={guestForm.nameMl}
                  onChange={(e) => setGuestForm({ ...guestForm, nameMl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={guestForm.titleEn}
                  onChange={(e) => setGuestForm({ ...guestForm, titleEn: e.target.value })}
                  placeholder="e.g. Professor, Central University"
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Photo URL (or /images/...)</label>
                <input
                  type="text"
                  value={guestForm.photoUrl}
                  onChange={(e) => setGuestForm({ ...guestForm, photoUrl: e.target.value })}
                  placeholder="/images/Usthad.png or https://..."
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Bio / Introduction</label>
                <textarea
                  rows={2}
                  value={guestForm.bioEn}
                  onChange={(e) => setGuestForm({ ...guestForm, bioEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={guestForm.published}
                    onChange={(e) => setGuestForm({ ...guestForm, published: e.target.checked })}
                    className="rounded text-brand-gold"
                  />
                  <span className="font-semibold">Publish immediately on website</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGuestModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold shadow hover:bg-brand-gold-hover"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-clash text-lg font-bold">
              {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </h3>

            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Question (English) *</label>
                <input
                  type="text"
                  value={faqForm.questionEn}
                  onChange={(e) => setFaqForm({ ...faqForm, questionEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Question (Malayalam)</label>
                <input
                  type="text"
                  value={faqForm.questionMl}
                  onChange={(e) => setFaqForm({ ...faqForm, questionMl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Answer (English) *</label>
                <textarea
                  rows={3}
                  value={faqForm.answerEn}
                  onChange={(e) => setFaqForm({ ...faqForm, answerEn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Answer (Malayalam)</label>
                <textarea
                  rows={3}
                  value={faqForm.answerMl}
                  onChange={(e) => setFaqForm({ ...faqForm, answerMl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={faqForm.published}
                      onChange={(e) => setFaqForm({ ...faqForm, published: e.target.checked })}
                      className="rounded text-brand-gold"
                    />
                    <span className="font-semibold">Published</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold shadow hover:bg-brand-gold-hover"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
