'use client';

import { create } from 'zustand';
import { ScheduleViewMode, TimeFormat } from '@/types/schedule';

interface ScheduleStore {
  // Navigation & View
  activeView: ScheduleViewMode;
  selectedDay: number | 'all';
  selectedTrack: string | 'all';
  selectedVenue: string | 'all';
  searchQuery: string;

  // Dynamic Toggles
  showPrayers: boolean; // Dynamic spiritual rhythm toggle (User requirement #2)
  showHijri: boolean;
  timeFormat: TimeFormat;

  // Personal Bookmarks
  bookmarkedSessionIds: string[];

  // Actions
  setActiveView: (view: ScheduleViewMode) => void;
  setSelectedDay: (day: number | 'all') => void;
  setSelectedTrack: (track: string | 'all') => void;
  setSelectedVenue: (venue: string | 'all') => void;
  setSearchQuery: (query: string) => void;
  setShowPrayers: (show: boolean) => void;
  togglePrayers: () => void;
  setShowHijri: (show: boolean) => void;
  toggleHijri: () => void;
  setTimeFormat: (format: TimeFormat) => void;
  toggleTimeFormat: () => void;
  toggleBookmark: (sessionId: string) => void;
  isBookmarked: (sessionId: string) => boolean;
  resetFilters: () => void;
}

const STORAGE_KEY_BOOKMARKS = 'ufuq_schedule_bookmarks';
const STORAGE_KEY_VIEW = 'ufuq_schedule_view_mode';
const STORAGE_KEY_PRAYERS = 'ufuq_schedule_show_prayers';
const STORAGE_KEY_HIJRI = 'ufuq_schedule_show_hijri';
const STORAGE_KEY_TIME_FORMAT = 'ufuq_schedule_time_format';

function getInitialBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getInitialView(): ScheduleViewMode {
  if (typeof window === 'undefined') return 'timeline';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VIEW) as ScheduleViewMode;
    return ['timeline', 'matrix', 'calendar', 'itinerary'].includes(raw) ? raw : 'timeline';
  } catch {
    return 'timeline';
  }
}

function getInitialBoolean(key: string, defaultVal: boolean): boolean {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : defaultVal;
  } catch {
    return defaultVal;
  }
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  activeView: getInitialView(),
  selectedDay: 'all',
  selectedTrack: 'all',
  selectedVenue: 'all',
  searchQuery: '',
  showPrayers: getInitialBoolean(STORAGE_KEY_PRAYERS, true), // enabled by default
  showHijri: getInitialBoolean(STORAGE_KEY_HIJRI, true),
  timeFormat: '12h',
  bookmarkedSessionIds: getInitialBookmarks(),

  setActiveView: (view) => {
    set({ activeView: view });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_VIEW, view);
      } catch {}
    }
  },

  setSelectedDay: (day) => set({ selectedDay: day }),

  setSelectedTrack: (track) => set({ selectedTrack: track }),

  setSelectedVenue: (venue) => set({ selectedVenue: venue }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setShowPrayers: (show) => {
    set({ showPrayers: show });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_PRAYERS, String(show));
      } catch {}
    }
  },

  togglePrayers: () => {
    const next = !get().showPrayers;
    get().setShowPrayers(next);
  },

  setShowHijri: (show) => {
    set({ showHijri: show });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_HIJRI, String(show));
      } catch {}
    }
  },

  toggleHijri: () => {
    const next = !get().showHijri;
    get().setShowHijri(next);
  },

  setTimeFormat: (format) => {
    set({ timeFormat: format });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_TIME_FORMAT, format);
      } catch {}
    }
  },

  toggleTimeFormat: () => {
    const next = get().timeFormat === '12h' ? '24h' : '12h';
    get().setTimeFormat(next);
  },

  toggleBookmark: (sessionId: string) => {
    const current = get().bookmarkedSessionIds;
    const exists = current.includes(sessionId);
    const updated = exists ? current.filter((id) => id !== sessionId) : [...current, sessionId];

    set({ bookmarkedSessionIds: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
      } catch {}
    }
  },

  isBookmarked: (sessionId: string) => {
    return get().bookmarkedSessionIds.includes(sessionId);
  },

  resetFilters: () => {
    set({
      selectedDay: 'all',
      selectedTrack: 'all',
      selectedVenue: 'all',
      searchQuery: '',
    });
  },
}));
