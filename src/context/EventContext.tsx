'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { EventInfo, ScheduleSession, Guest, FAQ, Registration, RegistrationField, AudioTrack } from '@/types';
import { initialEventInfo, initialScheduleSessions, initialGuests, initialFAQs, defaultRegistrationFields, initialAudioTracks } from '@/lib/initialData';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

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

  // Audio Tracks CRUD
  audioTracks: AudioTrack[];
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => Promise<void>;
  updateAudioTrack: (id: string, track: Partial<AudioTrack>) => Promise<void>;
  deleteAudioTrack: (id: string) => Promise<void>;
  reorderAudioTracks: (tracks: AudioTrack[]) => Promise<void>;

  // Registrations Admin
  fetchRegistrations: () => Promise<void>;
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
  AUDIO_TRACKS: 'ufuq_audio_tracks_v1',
};

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialEventInfo);
  const [schedule, setSchedule] = useState<ScheduleSession[]>(initialScheduleSessions);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>(defaultRegistrationFields);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(initialAudioTracks);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage first, then sync from Firestore if available
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Initial local load
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

      const storedAudio = localStorage.getItem(STORAGE_KEYS.AUDIO_TRACKS);
      if (storedAudio) setAudioTracks(JSON.parse(storedAudio));
    } catch (err) {
      console.warn('Could not read from storage, using initial data', err);
    } finally {
      setIsLoading(false);
    }

    // 2. Background Firestore fetch if connected
    const syncFromFirestore = async () => {
      try {
        const scheduleSnap = await getDocs(collection(db, 'schedule'));
        if (!scheduleSnap.empty) {
          const remoteSessions: ScheduleSession[] = [];
          scheduleSnap.forEach((docSnap) => {
            remoteSessions.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteSessions.sort((a, b) => a.day - b.day || a.order - b.order);
          setSchedule(remoteSessions);
          persist(STORAGE_KEYS.SCHEDULE, remoteSessions);
        }

        const guestsSnap = await getDocs(collection(db, 'guests'));
        if (!guestsSnap.empty) {
          const remoteGuests: Guest[] = [];
          guestsSnap.forEach((docSnap) => {
            remoteGuests.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteGuests.sort((a, b) => a.order - b.order);
          setGuests(remoteGuests);
          persist(STORAGE_KEYS.GUESTS, remoteGuests);
        }

        const faqsSnap = await getDocs(collection(db, 'faqs'));
        if (!faqsSnap.empty) {
          const remoteFaqs: FAQ[] = [];
          faqsSnap.forEach((docSnap) => {
            remoteFaqs.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteFaqs.sort((a, b) => a.order - b.order);
          setFaqs(remoteFaqs);
          persist(STORAGE_KEYS.FAQS, remoteFaqs);
        }

        const audioSnap = await getDocs(collection(db, 'audio_tracks'));
        if (!audioSnap.empty) {
          const remoteTracks: AudioTrack[] = [];
          audioSnap.forEach((docSnap) => {
            remoteTracks.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteTracks.sort((a, b) => a.order - b.order);
          setAudioTracks(remoteTracks);
          persist(STORAGE_KEYS.AUDIO_TRACKS, remoteTracks);
        }
      } catch (e) {
        // Firestore rules or offline: keep using local cache seamlessly
      }
    };

    syncFromFirestore();
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

      // 1. Save to local state and localStorage
      const updated = [newRegistration, ...registrations];
      setRegistrations(updated);
      persist(STORAGE_KEYS.REGISTRATIONS, updated);

      // 2. Sync to Firestore in background
      try {
        await setDoc(doc(db, 'registrations', newId), newRegistration);
      } catch (err) {
        // Firestore will sync when online or rules are applied
        console.warn('Firestore write queued or local-only', err);
      }

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
    try {
      await setDoc(doc(db, 'events', 'ufuq-2026'), updated, { merge: true });
    } catch (e) {
      // local-fallback
    }
  };

  // Admin: Schedule sessions
  const addSession = async (sessionData: Omit<ScheduleSession, 'id'>) => {
    const newId = `session-${Date.now()}`;
    const newSession: ScheduleSession = {
      ...sessionData,
      id: newId,
    };
    const updated = [...schedule, newSession].sort((a, b) => a.day - b.day || a.order - b.order);
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await setDoc(doc(db, 'schedule', newId), newSession);
    } catch (e) {}
  };

  const updateSession = async (id: string, sessionData: Partial<ScheduleSession>) => {
    const updated = schedule.map((s) => (s.id === id ? { ...s, ...sessionData } : s));
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await updateDoc(doc(db, 'schedule', id), sessionData);
    } catch (e) {}
  };

  const deleteSession = async (id: string) => {
    const updated = schedule.filter((s) => s.id !== id);
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
    try {
      await deleteDoc(doc(db, 'schedule', id));
    } catch (e) {}
  };

  // Admin: Guests
  const addGuest = async (guestData: Omit<Guest, 'id'>) => {
    const newId = `guest-${Date.now()}`;
    const newGuest: Guest = {
      ...guestData,
      id: newId,
    };
    const updated = [...guests, newGuest].sort((a, b) => a.order - b.order);
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
    try {
      await setDoc(doc(db, 'guests', newId), newGuest);
    } catch (e) {}
  };

  const updateGuest = async (id: string, guestData: Partial<Guest>) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, ...guestData } : g));
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
    try {
      await updateDoc(doc(db, 'guests', id), guestData);
    } catch (e) {}
  };

  const deleteGuest = async (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
    try {
      await deleteDoc(doc(db, 'guests', id));
    } catch (e) {}
  };

  // Admin: FAQs
  const addFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    const newId = `faq-${Date.now()}`;
    const newFaq: FAQ = {
      ...faqData,
      id: newId,
    };
    const updated = [...faqs, newFaq].sort((a, b) => a.order - b.order);
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
    try {
      await setDoc(doc(db, 'faqs', newId), newFaq);
    } catch (e) {}
  };

  const updateFAQ = async (id: string, faqData: Partial<FAQ>) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, ...faqData } : f));
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
    try {
      await updateDoc(doc(db, 'faqs', id), faqData);
    } catch (e) {}
  };

  const deleteFAQ = async (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (e) {}
  };

  // Admin: Audio Tracks
  const addAudioTrack = async (trackData: Omit<AudioTrack, 'id'>) => {
    const newId = `track-${Date.now()}`;
    const newTrack: AudioTrack = {
      ...trackData,
      id: newId,
      uploadedAt: new Date().toISOString(),
    };
    const updated = [...audioTracks, newTrack].sort((a, b) => a.order - b.order);
    setAudioTracks(updated);
    persist(STORAGE_KEYS.AUDIO_TRACKS, updated);
    try {
      await setDoc(doc(db, 'audio_tracks', newId), newTrack);
    } catch (e) {}
  };

  const updateAudioTrack = async (id: string, updates: Partial<AudioTrack>) => {
    const updated = audioTracks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setAudioTracks(updated);
    persist(STORAGE_KEYS.AUDIO_TRACKS, updated);
    try {
      await updateDoc(doc(db, 'audio_tracks', id), updates);
    } catch (e) {}
  };

  const deleteAudioTrack = async (id: string) => {
    const updated = audioTracks.filter((t) => t.id !== id);
    setAudioTracks(updated);
    persist(STORAGE_KEYS.AUDIO_TRACKS, updated);
    try {
      await deleteDoc(doc(db, 'audio_tracks', id));
    } catch (e) {}
  };

  const reorderAudioTracks = async (reordered: AudioTrack[]) => {
    const normalized = reordered.map((t, idx) => ({ ...t, order: idx + 1 }));
    setAudioTracks(normalized);
    persist(STORAGE_KEYS.AUDIO_TRACKS, normalized);
    try {
      for (const track of normalized) {
        await setDoc(doc(db, 'audio_tracks', track.id), track);
      }
    } catch (e) {}
  };

  // Admin: Registrations
  const fetchRegistrations = async () => {
    try {
      const snap = await getDocs(collection(db, 'registrations'));
      if (!snap.empty) {
        const remoteRegs: Registration[] = [];
        snap.forEach((docSnap) => {
          remoteRegs.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        remoteRegs.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setRegistrations(remoteRegs);
        persist(STORAGE_KEYS.REGISTRATIONS, remoteRegs);
      }
    } catch (err) {
      console.warn('Could not sync registrations from Firestore (requires admin auth):', err);
    }
  };

  const updateRegistrationStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    const updated = registrations.map((r) => (r.id === id ? { ...r, status } : r));
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await updateDoc(doc(db, 'registrations', id), { status });
    } catch (e) {}
  };

  const deleteRegistration = async (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (e) {}
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
      setAudioTracks(initialAudioTracks);
      localStorage.removeItem(STORAGE_KEYS.EVENT_INFO);
      localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
      localStorage.removeItem(STORAGE_KEYS.GUESTS);
      localStorage.removeItem(STORAGE_KEYS.FAQS);
      localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
      localStorage.removeItem(STORAGE_KEYS.FIELDS);
      localStorage.removeItem(STORAGE_KEYS.AUDIO_TRACKS);
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
        audioTracks,
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
        addAudioTrack,
        updateAudioTrack,
        deleteAudioTrack,
        reorderAudioTracks,
        fetchRegistrations,
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
