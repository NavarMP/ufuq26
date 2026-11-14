'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { EventInfo, ScheduleSession, Guest, FAQ, Registration, RegistrationField } from '@/types';
import { initialEventInfo, initialScheduleSessions, initialGuests, initialFAQs, defaultRegistrationFields } from '@/lib/initialData';

interface EventContextType {
  eventInfo: EventInfo;
  schedule: ScheduleSession[];
  guests: Guest[];
  faqs: FAQ[];
  registrations: Registration[];
  registrationFields: RegistrationField[];
  isLoading: boolean;
  isSaving: boolean;
  
  // Public actions
  submitRegistration: (data: Omit<Registration, 'id' | 'submittedAt' | 'status'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  
  // Admin actions
  updateEventInfo: (info: Partial<EventInfo>) => Promise<void>;
  
  // Sessions CRUD
  addSession: (session: Omit<ScheduleSession, 'id'>) => Promise<void>;
  updateSession: (id: string, session: Partial<ScheduleSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  
  // Guests CRUD
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  
  // FAQs CRUD
  addFAQ: (faq: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;

  // Registrations Admin
  updateRegistrationStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  exportRegistrationsCSV: () => void;

  // Reset to initial
  resetToDefaultData: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EVENT_INFO: 'ufuq_event_info_v1',
  SCHEDULE: 'ufuq_schedule_v1',
  GUESTS: 'ufuq_guests_v1',
  FAQS: 'ufuq_faqs_v1',
  REGISTRATIONS: 'ufuq_registrations_v1',
  FIELDS: 'ufuq_reg_fields_v1',
};

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialEventInfo);
  const [schedule, setSchedule] = useState<ScheduleSession[]>(initialScheduleSessions);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>(defaultRegistrationFields);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage or initial on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedEvent = localStorage.getItem(STORAGE_KEYS.EVENT_INFO);
      if (storedEvent) setEventInfo(JSON.parse(storedEvent));

      const storedSchedule = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      if (storedSchedule) setSchedule(JSON.parse(storedSchedule));

      const storedGuests = localStorage.getItem(STORAGE_KEYS.GUESTS);
      if (storedGuests) setGuests(JSON.parse(storedGuests));

      const storedFaqs = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (storedFaqs) setFaqs(JSON.parse(storedFaqs));

      const storedRegs = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (storedRegs) setRegistrations(JSON.parse(storedRegs));

      const storedFields = localStorage.getItem(STORAGE_KEYS.FIELDS);
      if (storedFields) setRegistrationFields(JSON.parse(storedFields));
    } catch (err) {
      console.warn('Could not read from storage, using initial data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to persist in localStorage
  const persist = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.error('Failed to persist key', key, err);
      }
    }
  };

  // Public: Submit registration
  const submitRegistration = async (
    data: Omit<Registration, 'id' | 'submittedAt' | 'status'>
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    setIsSaving(true);
    try {
      // Simulate slight network delay for realism & test loading states
      await new Promise((res) => setTimeout(res, 600));

      // Duplicate email check
      const normalizedEmail = data.email.trim().toLowerCase();
      const existing = registrations.find(
        (r) => r.email.trim().toLowerCase() === normalizedEmail
      );

      if (existing) {
        return {
          success: false,
          error: 'duplicate',
        };
      }

      // Check registration open
      if (!eventInfo.registrationOpen) {
        return {
          success: false,
          error: 'closed',
        };
      }

      const newId = `REG-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const newRegistration: Registration = {
        ...data,
        id: newId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      const updated = [newRegistration, ...registrations];
      setRegistrations(updated);
      persist(STORAGE_KEYS.REGISTRATIONS, updated);

      return { success: true, id: newId };
    } catch (err: any) {
      return { success: false, error: err.message || 'unknown' };
    } finally {
      setIsSaving(false);
    }
  };

  // Admin: Update event info
  const updateEventInfo = async (info: Partial<EventInfo>) => {
    const updated = { ...eventInfo, ...info };
    setEventInfo(updated);
    persist(STORAGE_KEYS.EVENT_INFO, updated);
  };

  // Admin: Schedule sessions
  const addSession = async (sessionData: Omit<ScheduleSession, 'id'>) => {
    const newSession: ScheduleSession = {
      ...sessionData,
      id: `session-${Date.now()}`,
    };
    const updated = [...schedule, newSession].sort((a, b) => a.day - b.day || a.order - b.order);
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
  };

  const updateSession = async (id: string, sessionData: Partial<ScheduleSession>) => {
    const updated = schedule.map((s) => (s.id === id ? { ...s, ...sessionData } : s));
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
  };

  const deleteSession = async (id: string) => {
    const updated = schedule.filter((s) => s.id !== id);
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
  };

  // Admin: Guests
  const addGuest = async (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `guest-${Date.now()}`,
    };
    const updated = [...guests, newGuest].sort((a, b) => a.order - b.order);
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
  };

  const updateGuest = async (id: string, guestData: Partial<Guest>) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, ...guestData } : g));
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
  };

  const deleteGuest = async (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
  };

  // Admin: FAQs
  const addFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    const newFaq: FAQ = {
      ...faqData,
      id: `faq-${Date.now()}`,
    };
    const updated = [...faqs, newFaq].sort((a, b) => a.order - b.order);
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
  };

  const updateFAQ = async (id: string, faqData: Partial<FAQ>) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, ...faqData } : f));
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
  };

  const deleteFAQ = async (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
  };

  // Admin: Registrations
  const updateRegistrationStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, status } : r));
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
  };

  const deleteRegistration = async (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
  };

  const exportRegistrationsCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Full Name',
      'Email',
      'Phone',
      'Current Academic Stage',
      'Higher Study Plans',
      'Emergency Contact',
      'Emergency Phone',
      'Status',
      'Submission Date',
    ];

    const rows = registrations.map((r) => [
      r.id,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      `"${(r.darsYear || '').replace(/"/g, '""')}"`,
      `"${(r.higherStudyPlan || '').replace(/"/g, '""')}"`,
      `"${(r.emergencyContact || '').replace(/"/g, '""')}"`,
      r.emergencyPhone || '',
      r.status,
      new Date(r.submittedAt).toLocaleString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UFUQ26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDefaultData = () => {
    if (typeof window !== 'undefined' && confirm('Are you sure you want to reset all data to default? This will clear any local modifications.')) {
      setEventInfo(initialEventInfo);
      setSchedule(initialScheduleSessions);
      setGuests(initialGuests);
      setFaqs(initialFAQs);
      setRegistrations([]);
      setRegistrationFields(defaultRegistrationFields);
      localStorage.removeItem(STORAGE_KEYS.EVENT_INFO);
      localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
      localStorage.removeItem(STORAGE_KEYS.GUESTS);
      localStorage.removeItem(STORAGE_KEYS.FAQS);
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.FIELDS);
    }
  };

  return (
    <EventContext.Provider
      value={{
        eventInfo,
        schedule,
        guests,
        faqs,
        registrations,
        registrationFields,
        isLoading,
        isSaving,
        submitRegistration,
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
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
