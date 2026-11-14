'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { EventInfo, ScheduleSession, Guest, FAQ, Registration, RegistrationField, AudioTrack, SuffaDars, DarsAccount, GalleryItem } from '@/types';
import { initialEventInfo, initialScheduleSessions, initialGuests, initialFAQs, defaultRegistrationFields, initialAudioTracks } from '@/lib/initialData';
import { initialDarsList } from '@/lib/darsData';
import { initialDarsAccounts } from '@/lib/initialDarsAccounts';
import { initialGalleryItems } from '@/lib/initialGalleryData';
import { normalizePhone, formatDisplayPhone, generateDarsPassword } from '@/lib/authHelpers';
import { ensureRegistrationCode, generateRegistrationCode } from '@/lib/regCodeGenerator';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { executeFirestoreBatch } from '@/lib/batch/firestoreBatchService';
import { batchAuditManager } from '@/lib/batch/batchAuditStore';
import { dispatchNotification } from '@/lib/notifications/notificationDispatcher';

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
  findRegistration: (query: string) => Promise<{ found: boolean; registration?: Registration; message?: string }>;
  
  // Admin actions
  updateEventInfo: (info: Partial<EventInfo>) => Promise<void>;
  
  // Sessions CRUD
  addSession: (session: Omit<ScheduleSession, 'id'>) => Promise<void>;
  updateSession: (id: string, session: Partial<ScheduleSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  bulkUpdateSessions: (ids: string[], updates: Partial<ScheduleSession>) => Promise<void>;
  bulkDeleteSessions: (ids: string[]) => Promise<void>;
  bulkTimeShiftSessions: (ids: string[], shiftMinutes: number) => Promise<void>;
  
  // Guests CRUD
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
  bulkUpdateGuests: (ids: string[], updates: Partial<Guest>) => Promise<void>;
  bulkDeleteGuests: (ids: string[]) => Promise<void>;
  
  // FAQs CRUD
  addFAQ: (faq: Omit<FAQ, 'id'>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  bulkUpdateFAQs: (ids: string[], updates: Partial<FAQ>) => Promise<void>;
  bulkDeleteFAQs: (ids: string[]) => Promise<void>;

  // Audio Tracks CRUD
  audioTracks: AudioTrack[];
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => Promise<void>;
  updateAudioTrack: (id: string, track: Partial<AudioTrack>) => Promise<void>;
  deleteAudioTrack: (id: string) => Promise<void>;
  reorderAudioTracks: (tracks: AudioTrack[]) => Promise<void>;

  // SUFFA Dars CRUD
  darsList: SuffaDars[];
  addDars: (dars: Omit<SuffaDars, 'id'> & { id?: string }) => Promise<void>;
  updateDars: (id: string, updates: Partial<SuffaDars>) => Promise<void>;
  deleteDars: (id: string) => Promise<void>;
  bulkUpdateDars: (ids: string[], updates: Partial<SuffaDars>) => Promise<void>;
  bulkDeleteDars: (ids: string[]) => Promise<void>;
  resetDarsToDefault: () => Promise<void>;

  // Dars Logins & Accounts CRUD (Admin)
  darsAccounts: DarsAccount[];
  addDarsAccount: (account: DarsAccount) => Promise<void>;
  updateDarsAccount: (id: string, updates: Partial<DarsAccount>) => Promise<void>;
  deleteDarsAccount: (id: string) => Promise<void>;
  bulkUpdateDarsAccounts: (ids: string[], updates: Partial<DarsAccount>) => Promise<void>;
  bulkDeleteDarsAccounts: (ids: string[]) => Promise<void>;
  bulkResetDarsPasswords: (ids: string[]) => Promise<void>;
  seedDarsAccounts: () => Promise<{ count: number; seeded: DarsAccount[] }>;
  exportDarsCredentialsCSV: () => void;

  // Student CRUD for Dars Coordinators
  addStudentForDars: (student: Omit<Registration, 'id' | 'submittedAt'>) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateStudentForDars: (id: string, updates: Partial<Registration>) => Promise<void>;
  deleteStudentForDars: (id: string) => Promise<void>;

  // Registrations Admin
  fetchRegistrations: () => Promise<void>;
  addRegistration: (data: Omit<Registration, 'id' | 'submittedAt'> & { id?: string }) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateRegistration: (id: string, updates: Partial<Registration>) => Promise<void>;
  updateRegistrationStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  archiveRegistration: (id: string, reason?: string) => Promise<void>;
  unarchiveRegistration: (id: string) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  bulkUpdateRegistrations: (ids: string[], updates: Partial<Registration>) => Promise<void>;
  bulkUpdateRegistrationStatus: (ids: string[], status: 'pending' | 'confirmed' | 'cancelled') => Promise<void>;
  bulkArchiveRegistrations: (ids: string[]) => Promise<void>;
  bulkUnarchiveRegistrations: (ids: string[]) => Promise<void>;
  bulkDeleteRegistrations: (ids: string[]) => Promise<void>;
  exportRegistrationsCSV: (regsToExport?: Registration[] | unknown, filename?: string) => void;

  // Reset to initial
  resetToDefaultData: () => void;

  // Gallery Showcase CRUD
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  bulkUpdateGalleryItems: (ids: string[], updates: Partial<GalleryItem>) => Promise<void>;
  bulkDeleteGalleryItems: (ids: string[]) => Promise<void>;
  reorderGalleryItems: (items: GalleryItem[]) => Promise<void>;
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
  DARS: 'ufuq_dars_v1',
  DARS_ACCOUNTS: 'ufuq_dars_accounts_v1',
  GALLERY: 'ufuq_gallery_v1',
};

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [eventInfo, setEventInfo] = useState<EventInfo>(initialEventInfo);
  const [schedule, setSchedule] = useState<ScheduleSession[]>(initialScheduleSessions);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [darsList, setDarsList] = useState<SuffaDars[]>(initialDarsList);
  const [darsAccounts, setDarsAccounts] = useState<DarsAccount[]>(initialDarsAccounts);
  const [registrationFields, setRegistrationFields] = useState<RegistrationField[]>(defaultRegistrationFields);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(initialAudioTracks);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
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
      if (storedRegs) {
        const parsed = JSON.parse(storedRegs);
        const normalized = Array.isArray(parsed)
          ? parsed.map((r: any, idx: number) => ensureRegistrationCode(r, idx))
          : [];
        setRegistrations(normalized);
      }

      const storedFields = localStorage.getItem(STORAGE_KEYS.FIELDS);
      if (storedFields) setRegistrationFields(JSON.parse(storedFields));

      const storedAudio = localStorage.getItem(STORAGE_KEYS.AUDIO_TRACKS);
      if (storedAudio) setAudioTracks(JSON.parse(storedAudio));

      const storedGallery = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (storedGallery) setGalleryItems(JSON.parse(storedGallery));

      const storedDars = localStorage.getItem(STORAGE_KEYS.DARS);
      if (storedDars) {
        setDarsList(JSON.parse(storedDars));
      } else {
        persist(STORAGE_KEYS.DARS, initialDarsList);
      }

      const storedAccounts = localStorage.getItem(STORAGE_KEYS.DARS_ACCOUNTS);
      if (storedAccounts) {
        setDarsAccounts(JSON.parse(storedAccounts));
      } else {
        persist(STORAGE_KEYS.DARS_ACCOUNTS, initialDarsAccounts);
      }
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

        const darsSnap = await getDocs(collection(db, 'dars'));
        if (!darsSnap.empty) {
          const remoteDars: SuffaDars[] = [];
          darsSnap.forEach((docSnap) => {
            remoteDars.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteDars.sort((a, b) => (a.slNo || 999) - (b.slNo || 999));
          setDarsList(remoteDars);
          persist(STORAGE_KEYS.DARS, remoteDars);
        }

        const accountsSnap = await getDocs(collection(db, 'dars_accounts'));
        if (!accountsSnap.empty) {
          const remoteAccounts: DarsAccount[] = [];
          accountsSnap.forEach((docSnap) => {
            remoteAccounts.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteAccounts.sort((a, b) => (a.regNo || '').localeCompare(b.regNo || '', undefined, { numeric: true }));
          setDarsAccounts(remoteAccounts);
          persist(STORAGE_KEYS.DARS_ACCOUNTS, remoteAccounts);
        }

        const gallerySnap = await getDocs(collection(db, 'gallery'));
        if (!gallerySnap.empty) {
          const remoteGallery: GalleryItem[] = [];
          gallerySnap.forEach((docSnap) => {
            remoteGallery.push({ id: docSnap.id, ...(docSnap.data() as any) });
          });
          remoteGallery.sort((a, b) => (a.order || 0) - (b.order || 0));
          setGalleryItems(remoteGallery);
          persist(STORAGE_KEYS.GALLERY, remoteGallery);
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
      // Robust phone duplicate check (last 10 digits for matching)
      const cleanPhone = (p: string) => (p || '').replace(/\D/g, '').slice(-10);
      const inputCleanPhone = cleanPhone(data.phone);
      const inputNormalizedEmail = data.email?.trim().toLowerCase() || '';

      const existing = registrations.find((r) => {
        const phoneMatch = inputCleanPhone.length >= 8 && cleanPhone(r.phone) === inputCleanPhone;
        const emailMatch = inputNormalizedEmail.length > 0 && r.email && r.email.trim().toLowerCase() === inputNormalizedEmail;
        return phoneMatch || emailMatch;
      });

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
      const { regCode, checkDigit } = generateRegistrationCode({
        category: (data as any).category || 'scholar',
        darsRegNo: data.darsRegNo,
        sequenceNumber: registrations.length + 1,
      });

      const newRegistration: Registration = {
        ...data,
        id: newId,
        regCode,
        checkDigit,
        gateStatus: 'outside',
        totalCampusEntries: 0,
        attendedSessions: [],
        claimedMeals: {},
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

      // 3. Dispatch Automatic Omnichannel Registration Notification
      try {
        const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass';
        dispatchNotification({
          recipientId: newId,
          recipientName: newRegistration.fullName,
          recipientPhone: newRegistration.phone,
          recipientEmail: newRegistration.email,
          channels: newRegistration.email ? ['email', 'web_push', 'in_app'] : ['web_push', 'in_app'],
          eventType: 'registration_submitted',
          vars: {
            fullName: newRegistration.fullName,
            phone: newRegistration.phone,
            email: newRegistration.email,
            regCode: newRegistration.regCode,
            id: newId,
            darsName: newRegistration.darsName,
            darsRegNo: newRegistration.darsRegNo,
            darsMudarris: newRegistration.darsMudarris,
            status: 'pending',
            passUrl,
          },
        }).catch((e) => console.warn('Registration notification dispatch failed silently:', e));
      } catch (notifErr) {
        console.warn('Notification trigger caught:', notifErr);
      }

      return { success: true, id: newId };
    } catch (err: any) {
      return { success: false, error: err.message || 'unknown' };
    } finally {
      setIsSaving(false);
    }
  };

  // Public: Find registration by Phone, Reference ID, or Email
  const findRegistration = async (
    query: string
  ): Promise<{ found: boolean; registration?: Registration; message?: string }> => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { found: false, message: 'Please enter a phone number, registration ID, or email.' };
    }

    const lower = cleanQuery.toLowerCase();
    const queryDigits = cleanQuery.replace(/\D/g, '');

    // 1. Search locally in registrations
    let match = registrations.find((r) => {
      // Match by exact ID (e.g. REG-ABC123)
      if (r.id && r.id.toLowerCase() === lower) return true;

      // Match by Systematic Reg Code (e.g. UF26-SCH-SDC01-0042)
      if (r.regCode && r.regCode.toLowerCase() === lower) return true;

      // Match by Phone (last 10 digits or exact match)
      if (queryDigits.length >= 8) {
        const rDigits = (r.phone || '').replace(/\D/g, '');
        if (
          rDigits === queryDigits ||
          rDigits.slice(-10) === queryDigits.slice(-10) ||
          rDigits.endsWith(queryDigits) ||
          queryDigits.endsWith(rDigits)
        ) {
          return true;
        }
      }

      // Match by Email (if email was provided)
      if (r.email && r.email.trim().toLowerCase() === lower) return true;

      return false;
    });

    // 2. If not found in local cache, check backend API
    if (!match) {
      try {
        const res = await fetch('/api/register/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: cleanQuery }),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.found && resData.registration) {
            match = resData.registration;
            // Cache locally
            if (match && !registrations.some((r) => r.id === match!.id)) {
              const updated = [match, ...registrations];
              setRegistrations(updated);
              persist(STORAGE_KEYS.REGISTRATIONS, updated);
            }
          }
        }
      } catch (err) {
        // Fallback to local search result
      }
    }

    if (match) {
      return { found: true, registration: match };
    }

    return {
      found: false,
      message: 'No registration found matching your details.',
    };
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

  const bulkUpdateSessions = async (ids: string[], updates: Partial<ScheduleSession>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const prevSnapshots = schedule
      .filter((s) => idSet.has(s.id))
      .map((s) => ({ id: s.id, prevData: { ...s } }));

    const updated = schedule.map((s) => (idSet.has(s.id) ? { ...s, ...updates } : s));
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'schedule', type: 'update' as const, data: updates }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} timetable sessions`,
      collectionName: 'schedule',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = schedule.map((s) => (revertMap.has(s.id) ? { ...s, ...revertMap.get(s.id)! } : s));
        setSchedule(reverted);
        persist(STORAGE_KEYS.SCHEDULE, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'schedule', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteSessions = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = schedule.filter((s) => !idSet.has(s.id));
    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'schedule', type: 'delete' as const }))
    );
  };

  const bulkTimeShiftSessions = async (ids: string[], shiftMinutes: number) => {
    if (ids.length === 0 || shiftMinutes === 0) return;
    const idSet = new Set(ids);
    const prevSnapshots = schedule
      .filter((s) => idSet.has(s.id))
      .map((s) => ({ id: s.id, prevData: { startTime: s.startTime, endTime: s.endTime } }));

    const shiftTime = (timeStr: string, delta: number): string => {
      if (!timeStr) return timeStr;
      const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return timeStr;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const ampm = match[3]?.toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      let totalMinutes = hours * 60 + minutes + delta;
      totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

      const newHours24 = Math.floor(totalMinutes / 60);
      const newMins = totalMinutes % 60;
      const pad = (n: number) => n.toString().padStart(2, '0');

      if (ampm) {
        const finalAmpm = newHours24 >= 12 ? 'PM' : 'AM';
        const hours12 = newHours24 % 12 || 12;
        return `${pad(hours12)}:${pad(newMins)} ${finalAmpm}`;
      } else {
        return `${pad(newHours24)}:${pad(newMins)}`;
      }
    };

    const updated = schedule.map((s) => {
      if (!idSet.has(s.id)) return s;
      return {
        ...s,
        startTime: shiftTime(s.startTime, shiftMinutes),
        endTime: shiftTime(s.endTime, shiftMinutes),
      };
    });

    setSchedule(updated);
    persist(STORAGE_KEYS.SCHEDULE, updated);

    const mutations = ids.map((id) => {
      const item = updated.find((s) => s.id === id);
      return {
        id,
        collectionName: 'schedule',
        type: 'update' as const,
        data: { startTime: item?.startTime, endTime: item?.endTime },
      };
    });

    await executeFirestoreBatch(mutations);

    batchAuditManager.registerUndoableAction({
      title: `Time-shifted ${ids.length} sessions (${shiftMinutes > 0 ? '+' : ''}${shiftMinutes}m)`,
      collectionName: 'schedule',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = schedule.map((s) => (revertMap.has(s.id) ? { ...s, ...revertMap.get(s.id)! } : s));
        setSchedule(reverted);
        persist(STORAGE_KEYS.SCHEDULE, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'schedule', type: 'update' as const, data: item.prevData }))
        );
      },
    });
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

  const bulkUpdateGuests = async (ids: string[], updates: Partial<Guest>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const prevSnapshots = guests
      .filter((g) => idSet.has(g.id))
      .map((g) => ({ id: g.id, prevData: { ...g } }));

    const updated = guests.map((g) => (idSet.has(g.id) ? { ...g, ...updates } : g));
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'guests', type: 'update' as const, data: updates }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} scholars & faculty`,
      collectionName: 'guests',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = guests.map((g) => (revertMap.has(g.id) ? { ...g, ...revertMap.get(g.id)! } : g));
        setGuests(reverted);
        persist(STORAGE_KEYS.GUESTS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'guests', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteGuests = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = guests.filter((g) => !idSet.has(g.id));
    setGuests(updated);
    persist(STORAGE_KEYS.GUESTS, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'guests', type: 'delete' as const }))
    );
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

  const bulkUpdateFAQs = async (ids: string[], updates: Partial<FAQ>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const prevSnapshots = faqs
      .filter((f) => idSet.has(f.id))
      .map((f) => ({ id: f.id, prevData: { ...f } }));

    const updated = faqs.map((f) => (idSet.has(f.id) ? { ...f, ...updates } : f));
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'faqs', type: 'update' as const, data: updates }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} FAQs`,
      collectionName: 'faqs',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = faqs.map((f) => (revertMap.has(f.id) ? { ...f, ...revertMap.get(f.id)! } : f));
        setFaqs(reverted);
        persist(STORAGE_KEYS.FAQS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'faqs', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteFAQs = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = faqs.filter((f) => !idSet.has(f.id));
    setFaqs(updated);
    persist(STORAGE_KEYS.FAQS, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'faqs', type: 'delete' as const }))
    );
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

  // Admin: Gallery Showcase CRUD
  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = `gal-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const newItem: GalleryItem = {
      ...itemData,
      id: newId,
      views: itemData.views ?? 0,
      likes: itemData.likes ?? 0,
      published: itemData.published ?? true,
      featured: itemData.featured ?? false,
      order: itemData.order ?? (galleryItems.length + 1),
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...galleryItems, newItem].sort((a, b) => (a.order || 0) - (b.order || 0));
    setGalleryItems(updated);
    persist(STORAGE_KEYS.GALLERY, updated);
    try {
      await setDoc(doc(db, 'gallery', newId), newItem);
    } catch (e) {
      console.warn('Failed to sync gallery item to Firestore (offline fallback active):', e);
    }
  };

  const updateGalleryItem = async (id: string, updates: Partial<GalleryItem>) => {
    const now = new Date().toISOString();
    const updated = galleryItems.map((g) =>
      g.id === id ? { ...g, ...updates, updatedAt: now } : g
    ).sort((a, b) => (a.order || 0) - (b.order || 0));
    setGalleryItems(updated);
    persist(STORAGE_KEYS.GALLERY, updated);
    try {
      await updateDoc(doc(db, 'gallery', id), { ...updates, updatedAt: now });
    } catch (e) {
      console.warn('Failed to update gallery item in Firestore:', e);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = galleryItems.filter((g) => g.id !== id);
    setGalleryItems(updated);
    persist(STORAGE_KEYS.GALLERY, updated);
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Failed to delete gallery item from Firestore:', e);
    }
  };

  const bulkUpdateGalleryItems = async (ids: string[], updates: Partial<GalleryItem>) => {
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    const idSet = new Set(ids);
    const prevSnapshots = galleryItems
      .filter((g) => idSet.has(g.id))
      .map((g) => ({ id: g.id, prevData: { ...g } }));

    const updated = galleryItems.map((g) =>
      idSet.has(g.id) ? { ...g, ...updates, updatedAt: now } : g
    );
    setGalleryItems(updated);
    persist(STORAGE_KEYS.GALLERY, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({
        id,
        collectionName: 'gallery',
        type: 'update' as const,
        data: { ...updates, updatedAt: now },
      }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} gallery assets`,
      collectionName: 'gallery',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = galleryItems.map((g) => (revertMap.has(g.id) ? { ...g, ...revertMap.get(g.id)! } : g));
        setGalleryItems(reverted);
        persist(STORAGE_KEYS.GALLERY, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'gallery', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteGalleryItems = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = galleryItems.filter((g) => !idSet.has(g.id));
    setGalleryItems(updated);
    persist(STORAGE_KEYS.GALLERY, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'gallery', type: 'delete' as const }))
    );
  };

  const reorderGalleryItems = async (reordered: GalleryItem[]) => {
    const now = new Date().toISOString();
    const normalized = reordered.map((item, idx) => ({
      ...item,
      order: idx + 1,
      updatedAt: now,
    }));
    setGalleryItems(normalized);
    persist(STORAGE_KEYS.GALLERY, normalized);
    try {
      for (const item of normalized) {
        await setDoc(doc(db, 'gallery', item.id), item);
      }
    } catch (e) {}
  };

  // Admin: SUFFA Dars
  const addDars = async (darsData: Omit<SuffaDars, 'id'> & { id?: string }) => {
    const newId = darsData.id || `dars-${Date.now()}`;
    const newDars: SuffaDars = {
      ...darsData,
      id: newId,
      createdAt: darsData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...darsList, newDars].sort((a, b) => (a.slNo || 999) - (b.slNo || 999));
    setDarsList(updated);
    persist(STORAGE_KEYS.DARS, updated);
    try {
      await setDoc(doc(db, 'dars', newId), newDars);
    } catch (e) {}
  };

  const updateDars = async (id: string, updates: Partial<SuffaDars>) => {
    const updated = darsList.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
    setDarsList(updated);
    persist(STORAGE_KEYS.DARS, updated);
    try {
      await updateDoc(doc(db, 'dars', id), updates);
    } catch (e) {}
  };

  const deleteDars = async (id: string) => {
    const updated = darsList.filter((d) => d.id !== id);
    setDarsList(updated);
    persist(STORAGE_KEYS.DARS, updated);
    try {
      await deleteDoc(doc(db, 'dars', id));
    } catch (e) {}
  };

  const bulkUpdateDars = async (ids: string[], updates: Partial<SuffaDars>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    const prevSnapshots = darsList
      .filter((d) => idSet.has(d.id))
      .map((d) => ({ id: d.id, prevData: { ...d } }));

    const updated = darsList.map((d) =>
      idSet.has(d.id) ? { ...d, ...updates, updatedAt: now } : d
    );
    setDarsList(updated);
    persist(STORAGE_KEYS.DARS, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({
        id,
        collectionName: 'dars',
        type: 'update' as const,
        data: { ...updates, updatedAt: now },
      }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} SUFFA institutions`,
      collectionName: 'dars',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = darsList.map((d) => (revertMap.has(d.id) ? { ...d, ...revertMap.get(d.id)! } : d));
        setDarsList(reverted);
        persist(STORAGE_KEYS.DARS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'dars', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteDars = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = darsList.filter((d) => !idSet.has(d.id));
    setDarsList(updated);
    persist(STORAGE_KEYS.DARS, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'dars', type: 'delete' as const }))
    );
  };

  const resetDarsToDefault = async () => {
    setDarsList(initialDarsList);
    persist(STORAGE_KEYS.DARS, initialDarsList);
  };

  // Admin: Dars Logins & Accounts
  const addDarsAccount = async (accountData: DarsAccount) => {
    const cleanPhone = normalizePhone(accountData.phone);
    const newAccount: DarsAccount = {
      ...accountData,
      id: accountData.regNo || accountData.id,
      darsId: accountData.darsId || accountData.regNo,
      regNo: accountData.regNo,
      phone: cleanPhone,
      displayPhone: accountData.displayPhone || formatDisplayPhone(cleanPhone),
      password: accountData.password || generateDarsPassword(accountData.regNo),
      isActive: accountData.isActive ?? true,
      createdAt: accountData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [
      ...darsAccounts.filter((a) => a.id !== newAccount.id && a.regNo !== newAccount.regNo),
      newAccount,
    ].sort((a, b) => a.regNo.localeCompare(b.regNo, undefined, { numeric: true }));

    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);

    try {
      await setDoc(doc(db, 'dars_accounts', newAccount.id), newAccount);
    } catch (e) {
      console.warn('Firestore addDarsAccount notice', e);
    }
  };

  const updateDarsAccount = async (id: string, updates: Partial<DarsAccount>) => {
    const now = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt: now };
    if (updates.phone) {
      cleanUpdates.phone = normalizePhone(updates.phone);
      cleanUpdates.displayPhone = formatDisplayPhone(cleanUpdates.phone);
    }
    const updated = darsAccounts.map((a) => (a.id === id || a.regNo === id ? { ...a, ...cleanUpdates } : a));
    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);
    try {
      await updateDoc(doc(db, 'dars_accounts', id), cleanUpdates);
    } catch (e) {
      console.warn('Firestore updateDarsAccount notice', e);
    }
  };

  const deleteDarsAccount = async (id: string) => {
    const updated = darsAccounts.filter((a) => a.id !== id && a.regNo !== id);
    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);
    try {
      await deleteDoc(doc(db, 'dars_accounts', id));
    } catch (e) {
      console.warn('Firestore deleteDarsAccount notice', e);
    }
  };

  const bulkUpdateDarsAccounts = async (ids: string[], updates: Partial<DarsAccount>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    const prevSnapshots = darsAccounts
      .filter((a) => idSet.has(a.id) || idSet.has(a.regNo))
      .map((a) => ({ id: a.id, prevData: { ...a } }));

    const updated = darsAccounts.map((a) =>
      idSet.has(a.id) || idSet.has(a.regNo) ? { ...a, ...updates, updatedAt: now } : a
    );
    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({
        id,
        collectionName: 'dars_accounts',
        type: 'update' as const,
        data: { ...updates, updatedAt: now },
      }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} Dars accounts`,
      collectionName: 'dars_accounts',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = darsAccounts.map((a) => (revertMap.has(a.id) ? { ...a, ...revertMap.get(a.id)! } : a));
        setDarsAccounts(reverted);
        persist(STORAGE_KEYS.DARS_ACCOUNTS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'dars_accounts', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkDeleteDarsAccounts = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = darsAccounts.filter((a) => !idSet.has(a.id) && !idSet.has(a.regNo));
    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'dars_accounts', type: 'delete' as const }))
    );
  };

  const bulkResetDarsPasswords = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    const prevSnapshots = darsAccounts
      .filter((a) => idSet.has(a.id) || idSet.has(a.regNo))
      .map((a) => ({ id: a.id, prevData: { password: a.password } }));

    const updated = darsAccounts.map((a) => {
      if (idSet.has(a.id) || idSet.has(a.regNo)) {
        const newPassword = generateDarsPassword(a.regNo);
        return { ...a, password: newPassword, updatedAt: now };
      }
      return a;
    });

    setDarsAccounts(updated);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, updated);

    const mutations = ids.map((id) => {
      const acc = updated.find((a) => a.id === id || a.regNo === id);
      return {
        id,
        collectionName: 'dars_accounts',
        type: 'update' as const,
        data: { password: acc?.password, updatedAt: now },
      };
    });

    await executeFirestoreBatch(mutations);

    batchAuditManager.registerUndoableAction({
      title: `Reset passwords for ${ids.length} Dars accounts`,
      collectionName: 'dars_accounts',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = darsAccounts.map((a) => (revertMap.has(a.id) ? { ...a, ...revertMap.get(a.id)! } : a));
        setDarsAccounts(reverted);
        persist(STORAGE_KEYS.DARS_ACCOUNTS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'dars_accounts', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const seedDarsAccounts = async (): Promise<{ count: number; seeded: DarsAccount[] }> => {
    // Generate/ensure accounts for all SUFFA Dars entries in directory
    const sourceList = darsList.length > 0 ? darsList : initialDarsList;
    const now = new Date().toISOString();

    const seeded: DarsAccount[] = sourceList.map((dars, idx) => {
      const cleanPhone = normalizePhone(dars.phone);
      const regNo = dars.regNo;
      // requested password format: sdc0101@ufuq
      const password = generateDarsPassword(regNo);
      return {
        id: regNo,
        darsId: regNo,
        regNo,
        slNo: dars.slNo || idx + 1,
        darsNameEn: dars.nameEn,
        darsNameMl: dars.nameMl,
        mudarris: dars.mudarris,
        phone: cleanPhone,
        displayPhone: dars.phone || formatDisplayPhone(cleanPhone),
        password,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
    });

    setDarsAccounts(seeded);
    persist(STORAGE_KEYS.DARS_ACCOUNTS, seeded);

    try {
      for (const acc of seeded) {
        await setDoc(doc(db, 'dars_accounts', acc.id), acc, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore seedDarsAccounts notice', e);
    }

    return { count: seeded.length, seeded };
  };

  const exportDarsCredentialsCSV = () => {
    const headers = [
      'Sl No',
      'Reg No',
      'Dars Name (English)',
      'Dars Name (Malayalam)',
      'Mudarris',
      'Phone Number',
      'Password',
      'Login URL',
    ];
    const rows = darsAccounts.map((acc, idx) => [
      idx + 1,
      acc.regNo,
      `"${(acc.darsNameEn || '').replace(/"/g, '""')}"`,
      `"${(acc.darsNameMl || '').replace(/"/g, '""')}"`,
      `"${(acc.mudarris || '').replace(/"/g, '""')}"`,
      acc.displayPhone || acc.phone,
      acc.password,
      `${typeof window !== 'undefined' ? window.location.origin : ''}/dars`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ufuq26_dars_logins_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dars Portal Student CRUD
  const addStudentForDars = async (
    studentData: Omit<Registration, 'id' | 'submittedAt'>
  ): Promise<{ success: boolean; id?: string; error?: string }> => {
    const cleanPhone = (p: string) => (p || '').replace(/\D/g, '').slice(-10);
    const studentPhone = cleanPhone(studentData.phone);

    // Duplicate check within system
    if (studentPhone.length >= 8) {
      const existing = registrations.find(
        (r) => cleanPhone(r.phone) === studentPhone
      );
      if (existing) {
        return { success: false, error: 'duplicate' };
      }
    }

    const newId = `REG-DARS-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const { regCode, checkDigit } = generateRegistrationCode({
      category: studentData.category || 'scholar',
      darsRegNo: studentData.darsRegNo,
      sequenceNumber: registrations.length + 1,
    });
    const now = new Date().toISOString();
    const newStudent: Registration = {
      ...studentData,
      id: newId,
      regCode,
      checkDigit,
      gateStatus: 'outside',
      totalCampusEntries: 0,
      attendedSessions: [],
      claimedMeals: {},
      submittedAt: now,
      status: 'pending', // Strictly default to pending nomination; approval is admin power
      source: 'dars_portal',
      registeredBy: 'dars',
      isArchived: false,
    };

    const updated = [newStudent, ...registrations];
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);

    try {
      await setDoc(doc(db, 'registrations', newId), newStudent);
    } catch (e) {
      console.warn('Firestore addStudentForDars notice', e);
    }

    return { success: true, id: newId };
  };

  const updateStudentForDars = async (id: string, updates: Partial<Registration>) => {
    const now = new Date().toISOString();
    // Prevent Dars coordinators from modifying status (admin authority only)
    const { status, ...allowedUpdates } = updates;
    const cleanUpdates = { ...allowedUpdates, updatedAt: now };
    const updated = registrations.map((r) => (r.id === id ? { ...r, ...cleanUpdates } : r));
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await updateDoc(doc(db, 'registrations', id), cleanUpdates);
    } catch (e) {
      console.warn('Firestore updateStudentForDars notice', e);
    }
  };

  const deleteStudentForDars = async (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (e) {
      console.warn('Firestore deleteStudentForDars notice', e);
    }
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
        const normalized = remoteRegs.map((r, idx) => ensureRegistrationCode(r, idx));
        setRegistrations(normalized);
        persist(STORAGE_KEYS.REGISTRATIONS, normalized);
      }
    } catch (err) {
      console.warn('Could not sync registrations from Firestore (requires admin auth):', err);
    }
  };

  const addRegistration = async (
    data: Omit<Registration, 'id' | 'submittedAt'> & { id?: string }
  ) => {
    const newId =
      data.id ||
      `REG-ADM-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const { regCode, checkDigit } = generateRegistrationCode({
      category: data.category || 'scholar',
      darsRegNo: data.darsRegNo,
      sequenceNumber: registrations.length + 1,
    });
    const now = new Date().toISOString();
    const newReg: Registration = {
      ...data,
      id: newId,
      regCode,
      checkDigit,
      gateStatus: 'outside',
      totalCampusEntries: 0,
      attendedSessions: [],
      claimedMeals: {},
      submittedAt: now,
      status: data.status || 'confirmed',
      source: data.source || 'admin_manual',
      isArchived: false,
    };
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await setDoc(doc(db, 'registrations', newId), newReg);
    } catch (err) {
      console.warn('Firestore write error in addRegistration', err);
    }
    return { success: true, id: newId };
  };

  const updateRegistration = async (id: string, updates: Partial<Registration>) => {
    const now = new Date().toISOString();
    const finalUpdates = { ...updates, updatedAt: now };
    const updated = registrations.map((r) => (r.id === id ? { ...r, ...finalUpdates } : r));
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await updateDoc(doc(db, 'registrations', id), finalUpdates);
    } catch (e) {
      console.warn('Firestore update error in updateRegistration', e);
    }
  };

  const updateRegistrationStatus = async (
    id: string,
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    await updateRegistration(id, { status });

    // Automatic trigger on status change
    const target = registrations.find((r) => r.id === id);
    if (target) {
      const eventType =
        status === 'confirmed'
          ? 'status_confirmed'
          : status === 'cancelled'
          ? 'status_cancelled'
          : 'status_pending';

      const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass';
      dispatchNotification({
        recipientId: target.id,
        recipientName: target.fullName,
        recipientPhone: target.phone,
        recipientEmail: target.email,
        channels: target.email ? ['email', 'web_push', 'in_app'] : ['web_push', 'in_app'],
        eventType,
        vars: {
          fullName: target.fullName,
          phone: target.phone,
          email: target.email,
          regCode: target.regCode || target.id,
          id: target.id,
          darsName: target.darsName,
          darsRegNo: target.darsRegNo,
          status,
          passUrl,
        },
      }).catch((e) => console.warn('Status change notification dispatch error:', e));
    }
  };

  const archiveRegistration = async (id: string, reason?: string) => {
    const now = new Date().toISOString();
    await updateRegistration(id, {
      isArchived: true,
      archivedAt: now,
      archivedReason: reason || 'Archived by admin',
    });
  };

  const unarchiveRegistration = async (id: string) => {
    const now = new Date().toISOString();
    const updated = registrations.map((r) =>
      r.id === id
        ? {
            ...r,
            isArchived: false,
            archivedAt: undefined,
            archivedReason: undefined,
            updatedAt: now,
          }
        : r
    );
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await updateDoc(doc(db, 'registrations', id), {
        isArchived: false,
        archivedAt: null,
        archivedReason: null,
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Firestore unarchive error', e);
    }
  };

  const deleteRegistration = async (id: string) => {
    const updated = registrations.filter((r) => r.id !== id);
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    try {
      await deleteDoc(doc(db, 'registrations', id));
    } catch (e) {}
  };

  const bulkUpdateRegistrations = async (ids: string[], updates: Partial<Registration>) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    const prevSnapshots = registrations
      .filter((r) => idSet.has(r.id))
      .map((r) => ({ id: r.id, prevData: { ...r } }));

    const cleanUpdates = { ...updates, updatedAt: now };
    const updated = registrations.map((r) =>
      idSet.has(r.id) ? { ...r, ...cleanUpdates } : r
    );
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);

    await executeFirestoreBatch(
      ids.map((id) => ({
        id,
        collectionName: 'registrations',
        type: 'update' as const,
        data: cleanUpdates,
      }))
    );

    batchAuditManager.registerUndoableAction({
      title: `Updated ${ids.length} registrations`,
      collectionName: 'registrations',
      itemCount: ids.length,
      snapshot: prevSnapshots,
      onUndo: async () => {
        const revertMap = new Map(prevSnapshots.map((item) => [item.id, item.prevData]));
        const reverted = registrations.map((r) => (revertMap.has(r.id) ? { ...r, ...revertMap.get(r.id)! } : r));
        setRegistrations(reverted);
        persist(STORAGE_KEYS.REGISTRATIONS, reverted);
        await executeFirestoreBatch(
          prevSnapshots.map((item) => ({ id: item.id, collectionName: 'registrations', type: 'update' as const, data: item.prevData }))
        );
      },
    });
  };

  const bulkUpdateRegistrationStatus = async (
    ids: string[],
    status: 'pending' | 'confirmed' | 'cancelled'
  ) => {
    if (ids.length === 0) return;
    await bulkUpdateRegistrations(ids, { status });

    // Batch Dispatch Notifications
    try {
      const passUrl = typeof window !== 'undefined' ? `${window.location.origin}/#pass` : 'https://alathurpadidars.in/#pass';
      const eventType =
        status === 'confirmed'
          ? 'status_confirmed'
          : status === 'cancelled'
          ? 'status_cancelled'
          : 'status_pending';

      const idSet = new Set(ids);
      const affected = registrations.filter((r) => idSet.has(r.id));
      affected.forEach((attendee) => {
        dispatchNotification({
          recipientId: attendee.id,
          recipientName: attendee.fullName,
          recipientPhone: attendee.phone,
          recipientEmail: attendee.email,
          channels: attendee.email ? ['email', 'web_push'] : ['web_push'],
          eventType,
          vars: {
            fullName: attendee.fullName,
            phone: attendee.phone,
            email: attendee.email,
            regCode: attendee.regCode || attendee.id,
            id: attendee.id,
            darsName: attendee.darsName,
            status,
            passUrl,
          },
        }).catch(() => {});
      });
    } catch (e) {}
  };

  const bulkArchiveRegistrations = async (ids: string[]) => {
    if (ids.length === 0) return;
    const now = new Date().toISOString();
    await bulkUpdateRegistrations(ids, {
      isArchived: true,
      archivedAt: now,
      archivedReason: 'Bulk archived by admin',
    });
  };

  const bulkUnarchiveRegistrations = async (ids: string[]) => {
    if (ids.length === 0) return;
    await bulkUpdateRegistrations(ids, {
      isArchived: false,
      archivedReason: undefined,
    });
  };

  const bulkDeleteRegistrations = async (ids: string[]) => {
    if (ids.length === 0) return;
    const idSet = new Set(ids);
    const updated = registrations.filter((r) => !idSet.has(r.id));
    setRegistrations(updated);
    persist(STORAGE_KEYS.REGISTRATIONS, updated);
    await executeFirestoreBatch(
      ids.map((id) => ({ id, collectionName: 'registrations', type: 'delete' as const }))
    );
  };

  const exportRegistrationsCSV = (
    regsToExport?: Registration[] | unknown,
    filename?: string
  ) => {
    const list = Array.isArray(regsToExport) ? (regsToExport as Registration[]) : registrations;
    if (list.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Student Name',
      'Phone Number',
      'Email',
      'Dars Reg No',
      'Dars Name',
      'Mudarris',
      'District',
      'Category',
      'Status',
      'Archived',
      'Submission Timestamp',
      'Formatted Date & Time',
      'Source',
      'Admin Notes',
    ];

    const rows = list.map((r) => [
      r.id,
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      r.phone || '',
      r.email || '',
      r.darsRegNo || '',
      `"${(r.darsName || '').replace(/"/g, '""')}"`,
      `"${(r.darsMudarris || '').replace(/"/g, '""')}"`,
      `"${(r.darsDistrict || '').replace(/"/g, '""')}"`,
      r.category || 'regular',
      r.status,
      r.isArchived ? 'Yes' : 'No',
      r.submittedAt,
      `"${new Date(r.submittedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })}"`,
      r.source || 'online',
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const name =
      filename ||
      `UFUQ26_Registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', name);
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
        findRegistration,
        updateEventInfo,
        addSession,
        updateSession,
        deleteSession,
        bulkUpdateSessions,
        bulkDeleteSessions,
        bulkTimeShiftSessions,
        addGuest,
        updateGuest,
        deleteGuest,
        bulkUpdateGuests,
        bulkDeleteGuests,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        bulkUpdateFAQs,
        bulkDeleteFAQs,
        addAudioTrack,
        updateAudioTrack,
        deleteAudioTrack,
        reorderAudioTracks,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        bulkUpdateGalleryItems,
        bulkDeleteGalleryItems,
        reorderGalleryItems,
        darsList,
        addDars,
        updateDars,
        deleteDars,
        bulkUpdateDars,
        bulkDeleteDars,
        resetDarsToDefault,
        darsAccounts,
        addDarsAccount,
        updateDarsAccount,
        deleteDarsAccount,
        bulkUpdateDarsAccounts,
        bulkDeleteDarsAccounts,
        bulkResetDarsPasswords,
        seedDarsAccounts,
        exportDarsCredentialsCSV,
        addStudentForDars,
        updateStudentForDars,
        deleteStudentForDars,
        fetchRegistrations,
        addRegistration,
        updateRegistration,
        updateRegistrationStatus,
        archiveRegistration,
        unarchiveRegistration,
        deleteRegistration,
        bulkUpdateRegistrations,
        bulkUpdateRegistrationStatus,
        bulkArchiveRegistrations,
        bulkUnarchiveRegistrations,
        bulkDeleteRegistrations,
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
