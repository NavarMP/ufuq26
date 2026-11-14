// UFUQ '26 Comprehensive Omnichannel Notification & Communication Types

export type NotificationChannel = 'email' | 'web_push' | 'sms' | 'whatsapp' | 'in_app';

export type NotificationEventType =
  | 'registration_submitted'
  | 'status_confirmed'
  | 'status_pending'
  | 'status_cancelled'
  | 'gate_entry'
  | 'meal_claimed'
  | 'session_reminder'
  | 'camp_countdown'
  | 'custom_broadcast';

export type NotificationStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'opened';

export interface NotificationLog {
  id: string;
  recipientId: string; // Registration ID or 'all'
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  channel: NotificationChannel;
  eventType: NotificationEventType;
  title: string;
  bodyPreview: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt: string; // ISO timestamp
  deliveredAt?: string;
  openedAt?: string;
  metadata?: {
    regCode?: string;
    darsRegNo?: string;
    darsName?: string;
    senderAdminEmail?: string;
    actionUrl?: string;
    batchId?: string;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: 'transactional' | 'announcement' | 'reminder';
  eventType: NotificationEventType;
  subject: {
    en: string;
    ml: string;
    ar: string;
  };
  contentMarkdown: {
    en: string;
    ml: string;
    ar: string;
  };
  variables: string[]; // e.g. ['fullName', 'regCode', 'darsName', 'passUrl', 'venue']
  isActive: boolean;
  updatedAt: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'celebration';
  category: 'admission' | 'schedule' | 'gate' | 'general';
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface ScheduledNotificationJob {
  id: string;
  title: string;
  eventType: NotificationEventType;
  channels: NotificationChannel[];
  targetFilter: {
    cohort: 'all' | 'confirmed' | 'pending' | 'inside_campus' | 'outside_campus' | 'specific_dars';
    darsRegNo?: string;
    category?: string;
  };
  scheduledFor: string; // ISO timestamp
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalTargeted?: number;
  totalSuccess?: number;
  totalFailed?: number;
  createdAt: string;
  createdByName?: string;
}

export interface NotificationPreference {
  email: boolean;
  webPush: boolean;
  whatsapp: boolean;
  inApp: boolean;
  lastUpdated: string;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  byChannel: Record<NotificationChannel, number>;
  byEventType: Record<string, number>;
}
