import { LocalizedString, ScheduleSession } from './index';

export type ScheduleViewMode = 'timeline' | 'matrix' | 'calendar' | 'itinerary';
export type TimeFormat = '12h' | '24h';

export interface CampusVenue {
  id: string;
  name: LocalizedString;
  shortName: string;
  building: string;
  floor?: string;
  capacity?: number;
  features: string[];
  mapCoordinates?: { x: number; y: number };
}

export interface PrayerOrPauseSlot {
  id: string;
  day: number;
  time: string;
  endTime?: string;
  type: 'prayer' | 'meal' | 'spiritual_pause';
  name: LocalizedString;
  arabicName: string;
  description?: LocalizedString;
  venue?: string;
  icon?: string;
}

export interface DayThemeInfo {
  day: number;
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. Dec 24, 2026
  hijriDate: string; // e.g. 14 Rajab 1448 AH
  title: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  leadFaculty?: LocalizedString;
  color: {
    primary: string;
    glow: string;
    badgeBg: string;
    border: string;
    text: string;
  };
  keyMilestone: LocalizedString;
}

export interface EnhancedScheduleSession extends ScheduleSession {
  venueId?: string;
  trackColor?: string;
  learningOutcomes?: LocalizedString[];
  prerequisites?: LocalizedString;
  isKeynote?: boolean;
  tags?: string[];
  speakerGuestId?: string;
}

export interface TrackMeta {
  id: string;
  name: LocalizedString;
  color: string;
  borderColor: string;
  bgLight: string;
  bgDark: string;
  textLight: string;
  textDark: string;
}
