// Types for the UFUQ '26 Advanced Systematic Reminder System

export type ReminderTargetType =
  | 'full_camp'             // Dec 24-30
  | 'registration_deadline' // Dec 10
  | 'specific_day'          // Day 1 to 7
  | 'specific_session';     // Individual workshop / lecture

export type ReminderTimingPreset =
  | '1_week_before'   // 7 days before event (09:00 AM)
  | '3_days_before'   // 3 days before event (09:00 AM)
  | '1_day_before'    // 24 hours before (09:00 AM)
  | 'camp_morning'    // Day of event at 07:00 AM
  | '2_hours_before'  // 2 hours prior to start
  | '30_min_before'   // 30 minutes prior to session
  | 'custom';         // Custom date & time

export type ReminderChannel = 'browser' | 'calendar' | 'whatsapp';

export interface CampReminder {
  id: string;
  targetType: ReminderTargetType;
  targetId?: string;           // Session ID or Day number
  title: string;               // e.g. "UFUQ '26 Camp Starts Tomorrow"
  description: string;
  targetDateTime: string;      // Event start in ISO format
  notifyDateTime: string;      // When the notification must fire (ISO)
  preset: ReminderTimingPreset;
  channels: ReminderChannel[];
  createdAt: string;
  status: 'active' | 'triggered' | 'dismissed';
  notes?: string;
}

export interface ReminderDraft {
  targetType: ReminderTargetType;
  targetId?: string;
  title: string;
  description: string;
  targetDateTime: string;
  preset: ReminderTimingPreset;
  customDateTime?: string;
  channels: ReminderChannel[];
}
