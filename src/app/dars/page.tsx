'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarsAuth } from '@/context/DarsAuthContext';
import { useEvent } from '@/context/EventContext';
import { useApp } from '@/context/AppContext';
import { Registration } from '@/types';
import { normalizePhone, formatDisplayPhone } from '@/lib/authHelpers';
import BatchCardPrintModal from '@/components/badge/BatchCardPrintModal';
import PlasticCardBadge from '@/components/badge/PlasticCardBadge';
import ShareModal from '@/components/share/ShareModal';
import ShareTriggerButton from '@/components/share/ShareTriggerButton';
import {
  Building2,
  Phone,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  UserPlus,
  Users,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Download,
  Printer,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  AlertCircle,
  Sparkles,
  Check,
  X,
  FileText,
} from 'lucide-react';

export default function DarsPortalPage() {
  const { currentDars, isAuthenticated, isLoading: authLoading, login, logout, changePassword } = useDarsAuth();
  const { registrations, addStudentForDars, updateStudentForDars, deleteStudentForDars } = useEvent();
  const { language } = useApp();

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Student Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  // Batch Print & Individual Badge Modal State
  const [batchPrintOpen, setBatchPrintOpen] = useState(false);
  const [viewBadgeStudent, setViewBadgeStudent] = useState<Registration | null>(null);

  // Student Add / Edit Modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Registration | null>(null);
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [studentFormError, setStudentFormError] = useState<string | null>(null);
  const [isSavingStudent, setIsSavingStudent] = useState(false);

  // Change Password Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Filter students for the authenticated Dars
  const darsStudents = useMemo(() => {
    if (!currentDars) return [];
    return registrations.filter((r) => {
      // Primary match: by darsRegNo or darsId
      const regMatch = (r.darsRegNo || '').toUpperCase() === (currentDars.regNo || '').toUpperCase();
      const idMatch = (r.darsId || '').toUpperCase() === (currentDars.id || currentDars.regNo || '').toUpperCase();
      return regMatch || idMatch;
    });
  }, [registrations, currentDars]);

  // Filtered by search & status
  const filteredStudents = useMemo(() => {
    return darsStudents.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      const q = studentSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        (s.fullName || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.id || '').toLowerCase().includes(q)
      );
    });
  }, [darsStudents, studentSearch, statusFilter]);

  // Stats
  const confirmedCount = darsStudents.filter((s) => s.status === 'confirmed').length;
  const pendingCount = darsStudents.filter((s) => s.status === 'pending').length;

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await login(loginPhone, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Failed to sign in.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Open Create Student Modal
  const openCreateStudentModal = () => {
    setEditingStudent(null);
    setStudentForm({
      fullName: '',
      phone: '',
      email: '',
      notes: '',
    });
    setStudentFormError(null);
    setStudentModalOpen(true);
  };

  // Open Edit Student Modal
  const openEditStudentModal = (student: Registration) => {
    setEditingStudent(student);
    setStudentForm({
      fullName: student.fullName,
      phone: student.phone,
      email: student.email || '',
      notes: student.notes || '',
    });
    setStudentFormError(null);
    setStudentModalOpen(true);
  };

  // Save Student (Create / Update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDars) return;
    setStudentFormError(null);

    const cleanPh = normalizePhone(studentForm.phone);
    if (!studentForm.fullName.trim()) {
      setStudentFormError('Please enter the student\'s full name.');
      return;
    }
    if (cleanPh.length < 8) {
      setStudentFormError('Please enter a valid 10-digit mobile number for the student.');
      return;
    }

    setIsSavingStudent(true);
    try {
      if (editingStudent) {
        await updateStudentForDars(editingStudent.id, {
          fullName: studentForm.fullName.trim(),
          phone: cleanPh,
          email: studentForm.email.trim() || undefined,
          notes: studentForm.notes.trim() || undefined,
        });
      } else {
        const res = await addStudentForDars({
          fullName: studentForm.fullName.trim(),
          phone: cleanPh,
          email: studentForm.email.trim() || undefined,
          darsId: currentDars.id || currentDars.regNo,
          darsRegNo: currentDars.regNo,
          darsName: currentDars.darsNameEn,
          darsMudarris: currentDars.mudarris,
          status: 'pending', // Strictly default to pending nomination; approval is admin power
          notes: studentForm.notes.trim() || undefined,
          registeredBy: 'dars',
        });

        if (!res.success) {
          if (res.error === 'duplicate') {
            setStudentFormError('A student is already registered with this mobile number.');
          } else {
            setStudentFormError(res.error || 'Failed to add student.');
          }
          setIsSavingStudent(false);
          return;
        }
      }

      setStudentModalOpen(false);
    } catch (err: any) {
      setStudentFormError(err.message || 'Operation failed.');
    } finally {
      setIsSavingStudent(false);
    }
  };

  // Delete Student
  const handleDeleteStudent = async (student: Registration) => {
    if (confirm(`Remove ${student.fullName} from your Dars nomination list?`)) {
      await deleteStudentForDars(student.id);
    }
  };

  // Handle Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      if (res.success) {
        setPasswordSuccess('Password successfully updated!');
        setTimeout(() => {
          setPasswordModalOpen(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordSuccess(null);
        }, 1500);
      } else {
        setPasswordError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!currentDars) return;
    const headers = ['Sl No', 'Reg ID', 'Full Name', 'Phone', 'Email', 'Status', 'Date Submitted'];
    const rows = darsStudents.map((s, idx) => [
      idx + 1,
      s.id,
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      s.phone,
      s.email || '',
      s.status,
      new Date(s.submittedAt).toLocaleDateString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${currentDars.regNo}_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Roster
  const handlePrint = () => {
    window.print();
  };

  // 1. Loading Session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
          <p className="text-xs font-mono text-neutral-400">Loading SUFFA Dars portal...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated View: Dars Login Form
  if (!isAuthenticated || !currentDars) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-pattern selection:bg-brand-gold selection:text-brand-navy">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block group">
              <div className="w-16 h-16 rounded-2xl bg-brand-navy p-2 flex items-center justify-center mx-auto border border-brand-gold/40 shadow-lg group-hover:scale-105 transition-transform">
                <Image
                  src="/images/UFUQ-Logo.svg"
                  alt="UFUQ '26 Logo"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
            </Link>

            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                SUFFA Dars Coordinator Portal
              </span>
              <h1 className="font-clash text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                ദർസ് പോർട്ടൽ ലോഗിൻ
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Enter your registered Mudarris mobile number and password to manage student nominations for UFUQ &rsquo;26.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Registered Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-mono text-neutral-400">
                  <Phone className="w-3.5 h-3.5 text-brand-gold" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter portal password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/30 text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400">
                Please enter the secure password issued to your SUFFA Dars coordinator.
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In to Dars Portal</span>
              )}
            </button>
          </form>

          {/* Support / Help Notice */}
          <div className="pt-4 border-t border-brand-gold/15 text-center space-y-2">
            <p className="text-[11px] text-neutral-500">
              Need assistance or your Dars coordinator credentials?
            </p>
            <p className="text-xs font-semibold text-brand-gold">
              UFUQ Helpdesk: +91 90745 25205
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-brand-gold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to UFUQ &rsquo;26 Website</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated View: Dars Student Management Dashboard
  return (
    <div className="min-h-screen bg-mesh-pattern text-neutral-900 dark:text-neutral-100 selection:bg-brand-gold selection:text-brand-navy">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-brand-navy p-1.5 flex items-center justify-center border border-brand-gold/30">
                <Image
                  src="/images/UFUQ-Logo.svg"
                  alt="UFUQ '26 Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-brand-gold/20 border border-brand-gold/30 text-brand-gold font-mono font-bold text-xs">
                  {currentDars.regNo}
                </span>
                <h1 className="font-clash font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                  {currentDars.darsNameEn}
                </h1>
                {currentDars.darsNameMl && (
                  <span className="hidden md:inline text-xs text-neutral-500 font-medium">
                    ({currentDars.darsNameMl})
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-teal dark:text-emerald-400">
                Mudarris: {currentDars.mudarris} • Ph: {currentDars.displayPhone || currentDars.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ShareTriggerButton
              variant="outline"
              size="sm"
              label="Share Link"
              payload={{
                title: `Register for UFUQ ’26 — ${currentDars.darsNameEn}`,
                text: `SUFFA Dars: ${currentDars.darsNameEn} (${currentDars.regNo}). Mudarris: ${currentDars.mudarris}. Register online for UFUQ ’26 Transition & Leadership Camp.`,
                url: `https://alathurpadidars.in#register?dars=${currentDars.regNo}`,
                type: 'dars',
                badgeText: currentDars.regNo,
              }}
            />

            <button
              onClick={() => {
                setPasswordError(null);
                setPasswordSuccess(null);
                setPasswordModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Change Dars portal password"
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-gold" />
              <span>Change Password</span>
            </button>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-colors"
              title="Sign out of portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* KPI / Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-neutral-500">Total Registered Students</p>
              <p className="text-2xl font-clash font-bold text-brand-gold mt-1">
                {darsStudents.length}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">from {currentDars.darsNameEn}</p>
            </div>
            <Users className="w-8 h-8 text-brand-gold/30" />
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-neutral-500">Confirmed Nominees</p>
              <p className="text-2xl font-clash font-bold text-emerald-500 mt-1">
                {confirmedCount}
              </p>
              <p className="text-[10px] text-emerald-500/70 mt-0.5">Approved for UFUQ &rsquo;26</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500/30" />
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-brand-gold/20 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-medium text-neutral-500">Pending Review</p>
              <p className="text-2xl font-clash font-bold text-amber-500 mt-1">
                {pendingCount}
              </p>
              <p className="text-[10px] text-amber-500/70 mt-0.5">Awaiting organizer check</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500/30" />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students by name or phone..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/15 text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-brand-gold text-brand-navy' : 'text-neutral-500'
                }`}
              >
                All ({darsStudents.length})
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'confirmed' ? 'bg-brand-gold text-brand-navy' : 'text-neutral-500'
                }`}
              >
                Confirmed ({confirmedCount})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  statusFilter === 'pending' ? 'bg-brand-gold text-brand-navy' : 'text-neutral-500'
                }`}
              >
                Pending ({pendingCount})
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
              title="Download CSV of students"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
              title="Print student roster"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print List</span>
            </button>

            <button
              onClick={() => setBatchPrintOpen(true)}
              disabled={darsStudents.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gold/15 hover:bg-brand-gold text-brand-gold hover:text-brand-navy border border-brand-gold/30 text-xs font-bold transition-all shadow-sm disabled:opacity-40"
              title="Print CR80 Plastic Card Badges for your student delegation"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Delegation Badges</span>
            </button>

            <button
              onClick={openCreateStudentModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Student Table */}
        <div className="rounded-3xl glass-panel border border-brand-gold/20 overflow-hidden shadow-lg">
          {filteredStudents.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users className="w-12 h-12 text-brand-gold/30 mx-auto" />
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {darsStudents.length === 0
                  ? 'No students added yet for this Dars.'
                  : `No students matching "${studentSearch}".`}
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Register your students attending UFUQ &rsquo;26 to ensure their camp entry passes and accommodation.
              </p>
              <button
                onClick={openCreateStudentModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors mt-2"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add First Student</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-black/5 dark:bg-white/5 border-b border-brand-gold/15 text-neutral-500 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Sl No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Mobile Phone</th>
                    <th className="py-3 px-4">Registration ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gold/10">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-neutral-400">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-neutral-900 dark:text-neutral-100">
                            {student.fullName}
                          </p>
                          {student.gateStatus === 'inside' && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                              IN CAMPUS
                            </span>
                          )}
                        </div>
                        {student.email && (
                          <p className="text-[11px] text-neutral-500 font-mono">
                            {student.email}
                          </p>
                        )}
                        {student.notes && (
                          <p className="text-[10px] text-brand-gold italic">
                            Note: {student.notes}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                        {formatDisplayPhone(student.phone)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-brand-gold/10 border border-brand-gold/20 text-brand-gold font-mono font-bold text-[11px]">
                          {student.regCode || student.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            student.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              : student.status === 'cancelled'
                              ? 'bg-rose-500/15 text-rose-600'
                              : 'bg-amber-500/15 text-amber-600'
                          }`}
                        >
                          {student.status === 'confirmed'
                            ? 'Confirmed'
                            : student.status === 'cancelled'
                            ? 'Cancelled'
                            : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-500">
                        {new Date(student.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setViewBadgeStudent(student)}
                            className="p-1.5 rounded-lg text-brand-gold hover:bg-brand-gold/15 transition-colors"
                            title="View & Print Plastic ID Card"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditStudentModal(student)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                            title="Edit student details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Remove student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* STUDENT MODAL (CREATE / EDIT) */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-8 space-y-5 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-gold" />
                <h3 className="font-clash text-lg font-bold">
                  {editingStudent ? 'Edit Student Details' : 'Add Student from Dars'}
                </h3>
              </div>
              <button
                onClick={() => setStudentModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-100 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {studentFormError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400">
                {studentFormError}
              </div>
            )}

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentForm.fullName}
                  onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
                  placeholder="e.g. Muhammed Bilal"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Student Mobile Phone (10 digits) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 font-mono text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Notes / Coordinator Remarks
                </label>
                <textarea
                  rows={2}
                  value={studentForm.notes}
                  onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                  placeholder="Optional remarks about the student"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="px-5 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingStudent ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingStudent ? 'Save Changes' : 'Confirm & Add'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 sm:p-7 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-brand-gold" />
                <h3 className="font-clash text-base font-bold">Change Portal Password</h3>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-100 font-bold"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 rounded-xl bg-white/70 dark:bg-black/50 border border-brand-gold/25 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-1.5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 5. Delegation Batch Print Badges Modal */}
      {batchPrintOpen && (
        <BatchCardPrintModal
          isOpen={batchPrintOpen}
          onClose={() => setBatchPrintOpen(false)}
          registrations={darsStudents}
          darsName={currentDars.darsNameEn}
          darsRegNo={currentDars.regNo}
        />
      )}

      {/* 6. Single Student Plastic Card Preview Modal */}
      {viewBadgeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
              <span className="font-clash text-lg font-bold text-white">
                Plastic ID Card Preview
              </span>
              <button
                type="button"
                onClick={() => setViewBadgeStudent(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PlasticCardBadge
              registration={viewBadgeStudent}
              orientation="portrait"
              showControls={true}
            />
          </div>
        </div>
      )}

      {/* Global Share Hub Modal */}
      <ShareModal />
    </div>
  );
}
