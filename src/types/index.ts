// Types for the UFUQ '26 application

export type Language = 'en' | 'ml' | 'ar';
export type Theme = 'light' | 'dark' | 'system';

export interface LocalizedString {
  en: string;
  ml?: string;
  ar?: string;
}

export interface EventInfo {
  id: string;
  titleArabic: string;
  titleEnglish: string;
  descriptor: LocalizedString;
  tagline: LocalizedString;
  startDate: string;
  endDate: string;
  organizer: LocalizedString;
  description: LocalizedString;
  registrationOpen: boolean;
  registrationDeadline?: string;
  maxParticipants?: number;
  venue: {
    name: LocalizedString;
    address: LocalizedString;
    mapUrl: string;
    mapEmbedUrl?: string;
  };
}

export interface ScheduleSession {
  id: string;
  day: number; // 1-7
  date: string;
  startTime: string;
  endTime: string;
  title: LocalizedString;
  description?: LocalizedString;
  speaker?: string; // reference to guest ID
  category?: string;
  published: boolean;
  order: number;
}

export interface Guest {
  id: string;
  name: LocalizedString;
  title?: LocalizedString;
  bio?: LocalizedString;
  photoUrl?: string;
  published: boolean;
  order: number;
}

export interface FAQ {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
  category?: string;
  published: boolean;
  order: number;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  darsYear?: string;
  currentInstitution?: string;
  higherStudyPlan?: string;
  dietaryRequirements?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  agreedToTerms: boolean;
  submittedAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface RegistrationField {
  id: string;
  label: LocalizedString;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required: boolean;
  placeholder?: LocalizedString;
  options?: LocalizedString[];
  order: number;
  enabled: boolean;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  whatsapp?: string;
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'editor';
  displayName?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
  duration?: number;
  order: number;
  enabled: boolean;
  isDefault?: boolean;
  uploadedAt?: string;
}
