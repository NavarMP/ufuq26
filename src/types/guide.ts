export type GuideRole = 'delegate' | 'mudarris' | 'organizer' | 'guest';

export type SupportedLanguage = 'en' | 'ml' | 'ar';

export interface LocalizedString {
  en: string;
  ml: string;
  ar: string;
}

export interface LocalizedList {
  en: string[];
  ml: string[];
  ar: string[];
}

export interface GuideStep {
  id: string;
  stepNumber: number;
  badge: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  tips: LocalizedList;
  actionUrl?: string;
  actionLabel?: LocalizedString;
  simulatorType?: 'search' | 'registration' | 'calendar' | 'sound';
}

export interface DayHorizon {
  dayNumber: number;
  date: string;
  dateFormatted: LocalizedString;
  title: LocalizedString;
  arabicName: string;
  tagline: LocalizedString;
  theme: LocalizedString;
  color: string;
  highlights: LocalizedList;
  sessions: {
    time: string;
    title: LocalizedString;
    speaker?: string;
    type: 'Keynote' | 'Workshop' | 'Halqa' | 'Panel' | 'Mentorship';
  }[];
}

export interface ChecklistItem {
  id: string;
  category: 'admission' | 'packing' | 'academic' | 'travel';
  text: LocalizedString;
  detail: LocalizedString;
  isRequired: boolean;
}

export interface TransitHub {
  id: string;
  name: LocalizedString;
  code: string;
  distanceKm: number;
  travelTime: LocalizedString;
  type: 'airport' | 'railway' | 'bus';
  routeDescription: LocalizedString;
  recommendedTransport: LocalizedString;
}

export interface ShortcutItem {
  keys: string[];
  description: LocalizedString;
  category: 'navigation' | 'discovery' | 'audio' | 'modal';
}

export interface TourStep {
  targetSelector: string; // CSS selector e.g. '[data-tour="search"]'
  title: LocalizedString;
  content: LocalizedString;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  role?: GuideRole;
}
