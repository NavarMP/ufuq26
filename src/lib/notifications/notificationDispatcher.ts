// UFUQ '26 Central Omnichannel Dispatcher
// Manages Email (Resend / Firestore Mail queue), Web Push, WhatsApp, SMS, and In-App feeds

import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import {
  NotificationChannel,
  NotificationEventType,
  NotificationLog,
  NotificationStatus,
} from '@/types/notification';
import {
  TemplateVariables,
  buildHtmlEmail,
  formatWhatsAppMessage,
  buildWhatsAppLink,
  buildDirectSmsUri,
} from './templateEngine';
import { dispatchBrowserNotification, playHarmonicChime } from '@/lib/reminders/notificationManager';

const SENDER_EMAIL = process.env.NEXT_PUBLIC_FROM_EMAIL || 'UFUQ ’26 Organizers <onboarding@resend.dev>';
const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || process.env.RESEND_API_KEY || '';

export interface DispatchNotificationParams {
  recipientId: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  channels: NotificationChannel[];
  eventType: NotificationEventType;
  vars: TemplateVariables;
  locale?: 'en' | 'ml' | 'ar';
  senderAdminEmail?: string;
}

export interface DispatchResult {
  success: boolean;
  logId: string;
  channelResults: Record<NotificationChannel, { success: boolean; message?: string }>;
}

/**
 * Dispatch an email using Resend REST API or Firestore Mail Queue fallback
 */
export async function sendTransactionalEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  logId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { to, subject, html, text, logId } = options;

  // 1. Try Resend Direct REST API if API Key is configured
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [to],
          subject,
          html,
          text,
          tags: [{ name: 'logId', value: logId }],
        }),
      });

      if (res.ok) {
        return { success: true };
      }
      const errorJson = await res.json().catch(() => ({}));
      console.warn('Resend API returned error:', errorJson);
    } catch (err: any) {
      console.warn('Direct Resend fetch failed:', err.message);
    }
  }

  // 2. Fallback: Write document to Firestore 'mail' collection
  // (Works seamlessly with Firebase "Trigger Email" extension or cloud trigger)
  try {
    const mailDocRef = doc(collection(db, 'mail'));
    await setDoc(mailDocRef, {
      to: [to],
      message: {
        subject,
        html,
        text,
      },
      queuedAt: new Date().toISOString(),
      metadata: { logId },
    });
    return { success: true };
  } catch (err: any) {
    console.warn('Firestore mail queue fallback write error:', err);
    return { success: false, error: err.message || 'Email queueing failed' };
  }
}

/**
 * Save notification log to Firestore and localStorage
 */
export async function logNotification(log: NotificationLog): Promise<void> {
  // 1. Cache locally
  try {
    const existingRaw = localStorage.getItem('ufuq26_notification_logs');
    const logs: NotificationLog[] = existingRaw ? JSON.parse(existingRaw) : [];
    logs.unshift(log);
    // Keep last 100 in local storage
    localStorage.setItem('ufuq26_notification_logs', JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    // Ignore storage quota
  }

  // 2. Sync to Firestore
  try {
    await setDoc(doc(db, 'notification_logs', log.id), log);
  } catch (err) {
    console.warn('Firestore notification log write failed:', err);
  }
}

/**
 * Main Omnichannel Dispatch Orchestrator
 */
export async function dispatchNotification(
  params: DispatchNotificationParams
): Promise<DispatchResult> {
  const {
    recipientId,
    recipientName,
    recipientPhone,
    recipientEmail,
    channels,
    eventType,
    vars,
    locale = 'en',
    senderAdminEmail,
  } = params;

  const logId = `NOTIF-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const channelResults: Record<NotificationChannel, { success: boolean; message?: string }> = {
    email: { success: false },
    web_push: { success: false },
    sms: { success: false },
    whatsapp: { success: false },
    in_app: { success: false },
  };

  const { subject, html, text } = buildHtmlEmail({ eventType, vars, locale });
  let overallSuccess = false;

  // 1. Channel: Email
  if (channels.includes('email') && recipientEmail) {
    const emailRes = await sendTransactionalEmail({
      to: recipientEmail,
      subject,
      html,
      text,
      logId,
    });
    channelResults.email = emailRes;
    if (emailRes.success) overallSuccess = true;
  }

  // 2. Channel: Web Push / Browser Notification
  if (channels.includes('web_push')) {
    const pushFired = dispatchBrowserNotification(subject, {
      body: text.slice(0, 150) + '...',
      icon: '/images/UFUQ-Logo-app.svg',
      data: { url: vars.passUrl || '/#pass' },
    });
    channelResults.web_push = { success: pushFired };
    if (pushFired) overallSuccess = true;
  }

  // 3. Channel: In-App Sound & Feed
  if (channels.includes('in_app')) {
    playHarmonicChime();
    channelResults.in_app = { success: true };
    overallSuccess = true;
  }

  // 4. Channel: WhatsApp (Prepared Link)
  if (channels.includes('whatsapp')) {
    const waText = formatWhatsAppMessage(eventType, vars, locale);
    const waUrl = buildWhatsAppLink(recipientPhone, waText);
    channelResults.whatsapp = { success: true, message: waUrl };
    overallSuccess = true;
  }

  // 5. Channel: Free SMS Protocol
  if (channels.includes('sms')) {
    const smsText = `UFUQ '26: ${subject}\nPass: ${vars.passUrl || 'alathurpadidars.in/#pass'}`;
    const smsUri = buildDirectSmsUri(recipientPhone, smsText);
    channelResults.sms = { success: true, message: smsUri };
    overallSuccess = true;
  }

  // Save audit log
  const log: NotificationLog = {
    id: logId,
    recipientId,
    recipientName,
    recipientPhone,
    recipientEmail,
    channel: channels[0] || 'in_app',
    eventType,
    title: subject,
    bodyPreview: text.slice(0, 160),
    status: overallSuccess ? 'delivered' : 'failed',
    sentAt: new Date().toISOString(),
    metadata: {
      regCode: vars.regCode,
      darsRegNo: vars.darsRegNo,
      darsName: vars.darsName,
      senderAdminEmail,
      actionUrl: vars.passUrl,
    },
  };

  await logNotification(log);

  return {
    success: overallSuccess,
    logId,
    channelResults,
  };
}

/**
 * Fetch past notification logs for admin dashboard
 */
export async function fetchNotificationLogs(limitCount: number = 50): Promise<NotificationLog[]> {
  try {
    const q = query(collection(db, 'notification_logs'), orderBy('sentAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map((d) => d.data() as NotificationLog);
    }
  } catch (err) {
    console.warn('Unable to fetch Firestore notification logs, falling back to local storage:', err);
  }

  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem('ufuq26_notification_logs');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }
  return [];
}
