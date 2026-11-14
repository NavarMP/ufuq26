'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { resolveLocalized } from '@/lib/translations';
import { ScheduleSession, Guest, FAQ, AudioTrack } from '@/types';
import { uploadMediaToSupabase } from '@/lib/supabase';
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
  Upload,
  Loader2,
  Music,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Star,
  Check,
  LogOut,
  Mail,
  KeyRound,
} from 'lucide-react';

export default function AdminPage() {
  const {
    eventInfo,
    schedule,
    guests,
    faqs,
    registrations,
    audioTracks,
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
    addAudioTrack,
    updateAudioTrack,
    deleteAudioTrack,
    reorderAudioTracks,
    fetchRegistrations,
    updateRegistrationStatus,
    deleteRegistration,
    exportRegistrationsCSV,
    resetToDefaultData,
  } = useEvent();

  const { language } = useApp();
  const { user, loading: authLoading, signIn, signOut, resetPassword } = useAuth();

  // Authentication State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Auto-fetch registrations when organizer is authenticated
  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'sessions' | 'guests' | 'faqs' | 'registrations' | 'audio' | 'settings'>('dashboard');

  // Background Music Admin State
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioArtist, setAudioArtist] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioIsDefault, setAudioIsDefault] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadMediaToSupabase(file, 'speakers');
      setGuestForm((prev) => ({ ...prev, photoUrl: publicUrl }));
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Upload failed';
      setUploadError(msg);
      alert(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle audio file selection and duration extraction
  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 35 * 1024 * 1024) {
      alert('Audio file size exceeds 35MB limit.');
      return;
    }

    setAudioFile(file);
    setAudioUploadError(null);

    // Auto-generate clean title from file name
    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setAudioTitle((prev) => prev.trim() || rawName);
    setAudioArtist((prev) => prev.trim() || 'UFUQ ’26');

    // Read duration
    if (typeof window !== 'undefined') {
      const url = URL.createObjectURL(file);
      const audio = new window.Audio(url);
      audio.onloadedmetadata = () => {
        if (isFinite(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
        URL.revokeObjectURL(url);
      };
    }
  };

  // Upload audio to Supabase Storage & add to playlist
  const handleUploadAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      alert('Please select an audio file to upload.');
      return;
    }

    setIsUploadingAudio(true);
    setAudioUploadError(null);

    try {
      const publicUrl = await uploadMediaToSupabase(audioFile, 'audio');
      await addAudioTrack({
        title: audioTitle.trim() || 'Background Audio Track',
        artist: audioArtist.trim() || 'UFUQ ’26',
        src: publicUrl,
        duration: audioDuration || 0,
        order: audioTracks.length + 1,
        enabled: true,
        isDefault: audioIsDefault || audioTracks.length === 0,
      });

      setAudioFile(null);
      setAudioTitle('');
      setAudioArtist('');
      setAudioDuration(0);
      setAudioIsDefault(false);
      alert('Audio track successfully uploaded and added to the playlist!');
    } catch (err: any) {
      console.error('Audio upload error:', err);
      const msg = err.message || 'Audio upload failed';
      setAudioUploadError(msg);
      alert(msg);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  // Preview track inside admin table
  const toggleTrackPreview = (track: AudioTrack) => {
    if (!previewAudioRef.current) return;
    const audio = previewAudioRef.current;

    if (previewingTrackId === track.id) {
      audio.pause();
      setPreviewingTrackId(null);
    } else {
      audio.src = track.src;
      audio.play().catch(() => {});
      setPreviewingTrackId(track.id);
    }
  };

  // Reorder audio tracks
  const handleMoveTrack = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= audioTracks.length) return;

    const copy = [...audioTracks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    await reorderAudioTracks(copy);
  };

  // Set track as default
  const handleSetDefaultTrack = async (trackId: string) => {
    for (const t of audioTracks) {
      await updateAudioTrack(t.id, { isDefault: t.id === trackId });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);
    setIsSubmittingAuth(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);
    setIsSubmittingReset(true);
    try {
      await resetPassword(email);
      setResetSuccessMessage(`Password reset email sent to ${email.trim()}! Please check your inbox.`);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmittingReset(false);
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

  // Loading auth session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          <p className="text-xs font-mono text-neutral-400">Verifying organizer session...</p>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy p-3 flex items-center justify-center mx-auto border border-brand-gold/30 shadow-md">
            <Shield className="w-8 h-8 text-brand-gold" />
          </div>

          <div className="space-y-1">
            <h1 className="font-clash text-2xl font-bold text-brand-navy dark:text-white">
              Organizer Administration
            </h1>
            <p className="text-xs text-neutral-500">
              UFUQ ’26 — Alathurpadi Dars Students Association
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs text-left flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-left flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-left space-y-1">
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Organizer Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@gmail.com, @alathurpadidars.in..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="text-left space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setAuthError(null);
                      setResetSuccessMessage(null);
                    }}
                    className="text-[11px] text-brand-gold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your organizer password"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingAuth ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Admin Portal</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="text-left space-y-1">
                <label
                  htmlFor="reset-email"
                  className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                >
                  Organizer Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered organizer email"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 dark:bg-black/40 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 pt-1">
                  We will send a password reset link to this address via Firebase Authentication.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReset}
                className="w-full py-3 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingReset ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setAuthError(null);
                  setResetSuccessMessage(null);
                }}
                className="text-xs text-neutral-500 hover:text-brand-gold transition-colors"
              >
                &larr; Back to Sign In
              </button>
            </form>
          )}

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] text-neutral-500 text-left border border-brand-gold/10">
            <strong>Security Notice:</strong> Organizer accounts are managed via Firebase Authentication. Organizers may use any approved email (Gmail, Yahoo, alathurpadidars.in, etc.).
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

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs text-brand-navy dark:text-neutral-200">
            <Mail className="w-3.5 h-3.5 text-brand-gold" />
            <span className="font-mono text-[11px] truncate max-w-[200px]">{user?.email}</span>
          </div>

          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
            title="Sign out of organizer session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
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
            { id: 'audio', label: `Background Music (${audioTracks.length})`, icon: Music },
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchRegistrations()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-gold/20 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors shrink-0"
                  title="Fetch latest registrations from Cloud Firestore"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sync Cloud</span>
                </button>

                <button
                  onClick={exportRegistrationsCSV}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV ({registrations.length})</span>
                </button>
              </div>
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

        {/* TAB: BACKGROUND MUSIC & AUDIO */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            {/* Hidden Preview Audio Element */}
            <audio
              ref={previewAudioRef}
              onEnded={() => setPreviewingTrackId(null)}
              className="hidden"
            />

            {/* Header / Intro */}
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-clash text-lg font-bold flex items-center gap-2 text-brand-navy dark:text-brand-gold-light">
                  <Music className="w-5 h-5 text-brand-gold" />
                  <span>Background Music & Soundscapes ({audioTracks.length})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Upload audio files (.mp3, .wav, .ogg, .m4a) to Supabase Storage CDN, arrange playback order, set default launch tracks, or remove tracks.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shrink-0">
                Storage: Supabase CDN (ufuq-media/audio)
              </div>
            </div>

            {/* UPLOAD NEW TRACK CARD */}
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 space-y-4">
              <h4 className="font-clash font-bold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-brand-gold" />
                <span>Upload New Audio Track</span>
              </h4>

              <form onSubmit={handleUploadAudio} className="space-y-4 text-xs">
                {/* File input / dropzone */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-brand-gold/30 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-gold/60 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center w-full">
                    <Upload className="w-6 h-6 text-brand-gold mb-2" />
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {audioFile ? audioFile.name : 'Choose or drag & drop audio file (.mp3, .wav, .ogg, .m4a)'}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">
                      {audioFile
                        ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Auto-detected Duration: ${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, '0')}`
                        : 'Max file size 35MB. Direct upload to high-speed CDN.'}
                    </span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a"
                      onChange={handleAudioFileSelect}
                      className="hidden"
                      disabled={isUploadingAudio}
                    />
                  </label>
                </div>

                {audioUploadError && (
                  <p className="text-xs text-rose-500 font-medium">{audioUploadError}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Track Title *</label>
                    <input
                      type="text"
                      value={audioTitle}
                      onChange={(e) => setAudioTitle(e.target.value)}
                      placeholder="e.g. UFUQ ’26 — Ambient Theme"
                      className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Artist / Source</label>
                    <input
                      type="text"
                      value={audioArtist}
                      onChange={(e) => setAudioArtist(e.target.value)}
                      placeholder="e.g. Alathurpadi Dars / ADSA"
                      className="w-full p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-700 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      checked={audioIsDefault}
                      onChange={(e) => setAudioIsDefault(e.target.checked)}
                      className="rounded accent-brand-gold"
                    />
                    <span>Set as Default Starting Track on Launch</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!audioFile || isUploadingAudio}
                    className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-semibold flex items-center gap-2 shadow-md transition-all disabled:opacity-40"
                  >
                    {isUploadingAudio ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading to CDN...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload & Add to Playlist</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* PLAYLIST TRACKS TABLE */}
            <div className="p-6 rounded-3xl glass-panel border border-brand-gold/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-clash font-bold text-sm text-neutral-800 dark:text-neutral-200">
                  Current Audio Playlist ({audioTracks.length})
                </h4>
                <span className="text-[10px] text-neutral-400">
                  Use arrows to order • Auto-advances to next track
                </span>
              </div>

              {audioTracks.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  No audio tracks configured. Select an audio file above to upload to Supabase CDN.
                </div>
              ) : (
                <div className="divide-y divide-brand-gold/15">
                  {audioTracks.map((track, idx) => {
                    const isPreviewing = previewingTrackId === track.id;
                    const mins = Math.floor((track.duration || 0) / 60);
                    const secs = ((track.duration || 0) % 60).toString().padStart(2, '0');

                    return (
                      <div
                        key={track.id || idx}
                        className={`py-3.5 flex items-center justify-between gap-3 text-xs ${
                          !track.enabled ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Order & Preview Play */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => handleMoveTrack(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-neutral-400 hover:text-brand-gold disabled:opacity-20"
                              title="Move Up"
                              aria-label="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveTrack(idx, 'down')}
                              disabled={idx === audioTracks.length - 1}
                              className="p-1 rounded text-neutral-400 hover:text-brand-gold disabled:opacity-20"
                              title="Move Down"
                              aria-label="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => toggleTrackPreview(track)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isPreviewing
                                ? 'bg-brand-gold text-brand-navy shadow-md'
                                : 'bg-black/5 dark:bg-white/10 hover:bg-brand-gold/20 text-neutral-700 dark:text-neutral-200'
                            }`}
                            title={isPreviewing ? 'Pause Preview' : 'Play Preview'}
                          >
                            {isPreviewing ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>

                        {/* Title & Artist */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                              {track.title}
                            </h5>
                            {track.isDefault && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-brand-gold text-brand-navy font-bold flex items-center gap-1 shrink-0">
                                <Star className="w-2.5 h-2.5 fill-current" /> Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                            <span>{track.artist || 'ADSA Soundscape'}</span>
                            <span>•</span>
                            <span className="font-mono">{mins}:{secs}</span>
                            <span>•</span>
                            <a
                              href={track.src}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-gold hover:underline flex items-center gap-0.5"
                            >
                              <span>{track.src.startsWith('http') ? 'CDN Link' : 'Local file'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!track.isDefault && (
                            <button
                              onClick={() => handleSetDefaultTrack(track.id)}
                              className="px-2 py-1 rounded-lg text-[10px] text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5"
                              title="Set as Default Launch Track"
                            >
                              Make Default
                            </button>
                          )}

                          <button
                            onClick={() => updateAudioTrack(track.id, { enabled: !track.enabled })}
                            className={`p-1.5 rounded-lg ${
                              track.enabled
                                ? 'text-emerald-500 hover:bg-emerald-500/10'
                                : 'text-neutral-400 hover:bg-neutral-500/10'
                            }`}
                            title={track.enabled ? 'Enabled in public playlist' : 'Disabled (hidden)'}
                          >
                            {track.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${track.title}" from the playlist?`)) {
                                if (previewingTrackId === track.id && previewAudioRef.current) {
                                  previewAudioRef.current.pause();
                                  setPreviewingTrackId(null);
                                }
                                deleteAudioTrack(track.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                            title="Delete Track"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <label className="font-semibold block mb-1">Speaker Portrait / Photo</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={guestForm.photoUrl}
                      onChange={(e) => setGuestForm({ ...guestForm, photoUrl: e.target.value })}
                      placeholder="/images/Usthad.png or Supabase CDN URL"
                      className="flex-1 p-2.5 rounded-xl border border-brand-gold/20 bg-white/50 dark:bg-black/40 text-sm"
                    />
                    <label className={`cursor-pointer px-4 py-2.5 rounded-xl border border-brand-gold/40 bg-brand-gold/15 hover:bg-brand-gold/25 flex items-center gap-2 text-sm font-medium transition ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-brand-gold" />
                          <span>Upload File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>
                  </div>
                  {uploadError && (
                    <p className="text-xs text-red-500 font-medium">{uploadError}</p>
                  )}
                  <p className="text-xs text-brand-sand/70 dark:text-gray-400">
                    Upload directly to Supabase Storage, or enter an image URL / local path.
                  </p>
                  {guestForm.photoUrl && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-brand-gold/15">
                      <img
                        src={guestForm.photoUrl}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border border-brand-gold/30"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs truncate flex-1 opacity-80">{guestForm.photoUrl}</span>
                    </div>
                  )}
                </div>
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
