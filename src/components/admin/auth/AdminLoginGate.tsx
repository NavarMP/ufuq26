'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import AdminThemeSwitcher from '../layout/AdminThemeSwitcher';

interface AdminLoginGateProps {
  onSignIn: (email: string, pass: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
}

export default function AdminLoginGate({
  onSignIn,
  onResetPassword,
}: AdminLoginGateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setResetSuccessMessage(null);
    setIsSubmittingAuth(true);
    try {
      await onSignIn(email, password);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in. Please verify your credentials.');
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
      await onResetPassword(email);
      setResetSuccessMessage(`Password reset link sent to ${email.trim()}. Please check your email.`);
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-mesh-pattern relative overflow-hidden">
      {/* Top Floating Theme Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <AdminThemeSwitcher showLabels={true} />
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-brand-teal/10 blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel bg-white/80 dark:bg-[#0c1220]/80 border border-brand-gold/30 shadow-2xl text-center space-y-6 relative z-10 backdrop-blur-xl">
        {/* Brand Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 rounded-3xl bg-brand-navy p-3 flex items-center justify-center border-2 border-brand-gold/40 shadow-xl">
            <Image
              src="/images/UFUQ-Logo.svg"
              alt="UFUQ '26"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center shadow-md">
            <Shield className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h1 className="font-clash text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Organizer Portal
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            UFUQ ’26 — Alathurpadi Dars Students Association
          </p>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs text-left flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {resetSuccessMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs text-left flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resetSuccessMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {!isResetMode ? (
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
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
                  placeholder="organizer@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
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
                  className="text-[11px] text-brand-gold hover:underline font-semibold"
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
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
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
              className="w-full py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
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
          <form onSubmit={handlePasswordReset} className="space-y-4 text-left">
            <div className="space-y-1.5">
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
                  placeholder="organizer@domain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 focus:border-brand-gold text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-neutral-500 pt-1">
                A password reset email will be dispatched via Firebase Authentication.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmittingReset}
              className="w-full py-3.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-clash font-bold text-sm shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmittingReset ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching Reset Link...</span>
                </>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </button>

            <div className="text-center pt-2">
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
            </div>
          </form>
        )}

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] text-neutral-500 text-left border border-brand-gold/15 flex items-start gap-2">
          <Shield className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
          <span>
            <strong>ADSA Security Guard:</strong> Authorized organizer access only. Sessions are encrypted and authenticated via Firebase Auth.
          </span>
        </div>

        {/* Live Site Return */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
