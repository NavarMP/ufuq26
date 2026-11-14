'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to translate Firebase Auth errors into clear, organizer-friendly messages
function getFriendlyAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your organizer credentials.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This organizer account has been deactivated. Please contact the administrator.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    case 'auth/missing-email':
      return 'Please enter your email address.';
    default:
      return 'Authentication failed. Please verify your credentials and try again.';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) {
        throw new Error('Please enter your email address.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }
      await signInWithEmailAndPassword(auth, trimmedEmail, password);
    } catch (err: any) {
      console.error('Firebase sign-in error:', err);
      const message = err.code
        ? getFriendlyAuthErrorMessage(err.code)
        : err.message || 'Failed to sign in. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error('Firebase sign-out error:', err);
      setError(err.message || 'Failed to sign out.');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const msg = 'Please enter your email address to receive password reset instructions.';
      setError(msg);
      throw new Error(msg);
    }
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
    } catch (err: any) {
      console.error('Firebase password reset error:', err);
      const message = err.code
        ? getFriendlyAuthErrorMessage(err.code)
        : err.message || 'Failed to send password reset email.';
      setError(message);
      throw new Error(message);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
