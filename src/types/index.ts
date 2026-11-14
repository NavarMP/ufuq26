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
  contact?: ContactInfo;
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

export interface SuffaDars {
  id: string;
  regNo: string;
  slNo?: number;
  nameEn: string;
  nameMl: string;
  mudarris: string;
  phone: string;
  district?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DarsAccount {
  id: string; // Typically matches regNo e.g. 'SDC01'
  slNo?: number;
  darsId: string;
  regNo: string;
  darsNameEn: string;
  darsNameMl: string;
  mudarris: string;
  phone: string; // Clean 10-digit phone number
  displayPhone: string; // Formatted phone, e.g. '+91 98765 43210'
  password: string; // Protected credentials string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type AttendeeCategory =
  | 'scholar'
  | 'faculty'
  | 'vip'
  | 'organizer'
  | 'volunteer'
  | 'press'
  | 'regular'
  | 'delegate';

export type GateStatus = 'outside' | 'inside';

export interface Registration {
  id: string;
  legacyId?: string;
  regCode?: string; // e.g. 'UF26-SCH-SDC01-0042'
  checkDigit?: string;
  fullName: string;
  phone: string;
  email?: string;
  darsId?: string;
  darsName?: string;
  darsRegNo?: string;
  darsMudarris?: string;
  darsDistrict?: string;
  submittedAt: string;
  updatedAt?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredBy?: 'public' | 'dars' | 'admin';
  notes?: string;
  // Archival and operational fields
  isArchived?: boolean;
  archivedAt?: string;
  archivedReason?: string;
  category?: AttendeeCategory;
  tags?: string[];
  adminNotes?: string;
  source?: 'online' | 'admin_manual' | 'dars_portal';

  // Gate, Attendance & Access fields
  gateStatus?: GateStatus;
  lastScannedAt?: string;
  lastCheckpoint?: string; // 'main_gate' | 'dining_hall' | 'auditorium' | 'hostel'
  lastScannedBy?: string;
  totalCampusEntries?: number;
  attendedSessions?: string[]; // Array of session IDs attended
  claimedMeals?: Record<string, string>; // mealSlotKey -> ISO timestamp string
  bloodGroup?: string;
  hostelRoom?: string;

  // Legacy optional fields for backward compatibility
  darsYear?: string;
  currentInstitution?: string;
  higherStudyPlan?: string;
  dietaryRequirements?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  agreedToTerms?: boolean;
}

export type CheckpointType = 'main_gate' | 'dining_hall' | 'auditorium' | 'hostel';

export interface GateScanLog {
  id: string;
  registrationId: string;
  regCode: string;
  attendeeName: string;
  darsRegNo?: string;
  darsName?: string;
  category: AttendeeCategory;
  checkpoint: CheckpointType;
  direction: 'in' | 'out' | 'verify_only';
  action:
    | 'entry_allowed'
    | 'exit_recorded'
    | 'meal_claimed'
    | 'session_marked'
    | 'denied_duplicate'
    | 'denied_invalid'
    | 'verified';
  resultStatus: 'granted' | 'warning' | 'denied';
  message: string;
  scannedAt: string;
  scannedByUid: string;
  scannedByName: string;
  deviceType: 'camera' | 'hardware_wedge' | 'manual_override';
  sessionContext?: string;
  offlineQueued?: boolean;
}

export interface MealSlot {
  id: string; // e.g. 'day1_lunch'
  label: string;
  day: number;
  type: 'breakfast' | 'lunch' | 'tea' | 'dinner';
  date: string;
  startTime: string; // '12:30'
  endTime: string; // '14:30'
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
  displayPhone?: string;
  whatsapp?: string;
  socialLinks: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
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
