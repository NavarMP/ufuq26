'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DarsAccount } from '@/types';
import { useEvent } from '@/context/EventContext';
import { normalizePhone, validateDarsPassword } from '@/lib/authHelpers';

interface DarsAuthContextType {
  currentDars: DarsAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const DarsAuthContext = createContext<DarsAuthContextType | undefined>(undefined);

const DARS_SESSION_STORAGE_KEY = 'ufuq_dars_session_v1';

export function DarsAuthProvider({ children }: { children: React.ReactNode }) {
  const { darsAccounts, updateDarsAccount } = useEvent();
  const [currentDars, setCurrentDars] = useState<DarsAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(DARS_SESSION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { id: string; phone: string };
        if (parsed?.id) {
          // Re-sync with latest account data in darsAccounts
          const matched = darsAccounts.find((a) => a.id === parsed.id || a.regNo === parsed.id);
          if (matched && matched.isActive) {
            setCurrentDars(matched);
          } else if (matched && !matched.isActive) {
            localStorage.removeItem(DARS_SESSION_STORAGE_KEY);
            setCurrentDars(null);
          } else {
            setCurrentDars(parsed as unknown as DarsAccount);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to restore Dars session', e);
    } finally {
      setIsLoading(false);
    }
  }, [darsAccounts]);

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    }

    if (!password || !password.trim()) {
      return { success: false, error: 'Please enter your Dars password.' };
    }

    // Match by phone number in darsAccounts
    const account = darsAccounts.find((a) => {
      const accClean = normalizePhone(a.phone) || normalizePhone(a.displayPhone);
      return accClean === cleanPhone;
    });

    if (!account) {
      return {
        success: false,
        error: 'No SUFFA Dars found registered with this phone number. Please verify with UFUQ organizers.',
      };
    }

    if (!account.isActive) {
      return {
        success: false,
        error: 'This Dars portal account has been deactivated. Please contact the general convenor.',
      };
    }

    const isValid = validateDarsPassword(password, account.password);
    if (!isValid) {
      return {
        success: false,
        error: 'Incorrect mobile number or password. Please verify your credentials.',
      };
    }

    // Update lastLoginAt
    const updatedAccount = {
      ...account,
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentDars(updatedAccount);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DARS_SESSION_STORAGE_KEY, JSON.stringify(updatedAccount));
      } catch (e) {}
    }

    // Persist login timestamp asynchronously
    updateDarsAccount(account.id, { lastLoginAt: updatedAccount.lastLoginAt }).catch(() => {});

    return { success: true };
  };

  const logout = () => {
    setCurrentDars(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DARS_SESSION_STORAGE_KEY);
      } catch (e) {}
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentDars) {
      return { success: false, error: 'Not authenticated.' };
    }

    if (!validateDarsPassword(oldPassword, currentDars.password)) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const trimmedNew = newPassword.trim();
    const updated: DarsAccount = {
      ...currentDars,
      password: trimmedNew,
      updatedAt: new Date().toISOString(),
    };

    setCurrentDars(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DARS_SESSION_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
    }

    await updateDarsAccount(currentDars.id, { password: trimmedNew });
    return { success: true };
  };

  return (
    <DarsAuthContext.Provider
      value={{
        currentDars,
        isAuthenticated: !!currentDars,
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </DarsAuthContext.Provider>
  );
}

export function useDarsAuth() {
  const context = useContext(DarsAuthContext);
  if (!context) {
    throw new Error('useDarsAuth must be used within a DarsAuthProvider');
  }
  return context;
}
