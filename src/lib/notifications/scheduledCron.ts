// UFUQ '26 Scheduled Milestone & Autonomous Camp Countdown Engine
// Manages automated triggers for T-7d, T-3d, T-24h, Camp Morning 07:00, and Daily Digests

import { NotificationEventType, ScheduledNotificationJob } from '@/types/notification';
import { dispatchNotification } from './notificationDispatcher';
import { TemplateVariables } from './templateEngine';
import { Registration } from '@/types';

export interface MilestoneDefinition {
  id: string;
  name: string;
  targetDateTime: string; // ISO or date format
  eventType: NotificationEventType;
  customMessage: string;
  targetCohort: 'confirmed' | 'all' | 'inside_campus';
}

export const CAMP_SCHEDULED_MILESTONES: MilestoneDefinition[] = [
  {
    id: 'milestone_reg_deadline',
    name: 'Registration Portal Closing Alert',
    targetDateTime: '2026-12-10T10:00:00+05:30',
    eventType: 'camp_countdown',
    customMessage: 'Notice: UFUQ ’26 Delegate Registration closes in 24 hours. Ensure your institution credentials and forms are finalized.',
    targetCohort: 'all',
  },
  {
    id: 'milestone_t_minus_7d',
    name: 'Camp Readiness & Travel Advisory (T-7 Days)',
    targetDateTime: '2026-12-17T09:00:00+05:30',
    eventType: 'camp_countdown',
    customMessage: '7 Days to UFUQ ’26! Review the campus route to Alathurpadi Dars, Malappuram, and prepare your academic notebooks.',
    targetCohort: 'confirmed',
  },
  {
    id: 'milestone_t_minus_3d',
    name: 'Packing Kit & Attire Checklist (T-3 Days)',
    targetDateTime: '2026-12-21T09:00:00+05:30',
    eventType: 'camp_countdown',
    customMessage: '3 Days to UFUQ ’26! Remember to pack your institutional dars uniform, white attire, personal kit, and ID card.',
    targetCohort: 'confirmed',
  },
  {
    id: 'milestone_t_minus_24h',
    name: 'Final Digital Pass & Gate Reporting Instructions (T-24h)',
    targetDateTime: '2026-12-23T08:00:00+05:30',
    eventType: 'status_confirmed',
    customMessage: 'Tomorrow is the Grand Opening! Reporting counters open at 08:30 AM at Main Gate. Have your QR code pass ready on your screen.',
    targetCohort: 'confirmed',
  },
  {
    id: 'milestone_camp_morning',
    name: 'Camp Opening Morning Keynote (Dec 24, 07:00 AM)',
    targetDateTime: '2026-12-24T07:00:00+05:30',
    eventType: 'session_reminder',
    customMessage: 'Ahlan Wa Sahlan! Welcome to Day 1 of UFUQ ’26. Breakfast is being served at Dining Hall. Inaugural session begins at 09:30 AM.',
    targetCohort: 'confirmed',
  },
];

const DISPATCHED_MILESTONES_STORAGE_KEY = 'ufuq26_dispatched_milestones';

/**
 * Evaluates pending milestones against current wall-clock time
 */
export async function evaluateDueMilestones(
  registrations: Registration[]
): Promise<{ evaluated: number; dispatched: string[] }> {
  if (typeof window === 'undefined') return { evaluated: 0, dispatched: [] };

  const now = new Date().getTime();
  let dispatchedIds: string[] = [];
  try {
    const raw = localStorage.getItem(DISPATCHED_MILESTONES_STORAGE_KEY);
    if (raw) dispatchedIds = JSON.parse(raw);
  } catch (e) {}

  const newlyDispatched: string[] = [];

  for (const milestone of CAMP_SCHEDULED_MILESTONES) {
    const targetTime = new Date(milestone.targetDateTime).getTime();

    // If milestone is due and hasn't been fired yet
    if (now >= targetTime && !dispatchedIds.includes(milestone.id)) {
      console.log(`[ScheduledEngine] Milestone ${milestone.name} is due. Firing dispatch...`);

      const targets = registrations.filter((r) => {
        if (r.isArchived) return false;
        if (milestone.targetCohort === 'confirmed') return r.status === 'confirmed';
        return true;
      });

      const passUrl = `${window.location.origin}/#pass`;

      // Dispatch to each targeted attendee
      for (const attendee of targets) {
        const vars: TemplateVariables = {
          fullName: attendee.fullName,
          phone: attendee.phone,
          email: attendee.email,
          regCode: attendee.regCode || attendee.id,
          id: attendee.id,
          darsName: attendee.darsName,
          status: attendee.status,
          passUrl,
          customMessage: milestone.customMessage,
        };

        dispatchNotification({
          recipientId: attendee.id,
          recipientName: attendee.fullName,
          recipientPhone: attendee.phone,
          recipientEmail: attendee.email,
          channels: attendee.email ? ['email', 'web_push', 'in_app'] : ['web_push', 'in_app'],
          eventType: milestone.eventType,
          vars,
        }).catch(() => {});
      }

      dispatchedIds.push(milestone.id);
      newlyDispatched.push(milestone.id);
    }
  }

  if (newlyDispatched.length > 0) {
    try {
      localStorage.setItem(DISPATCHED_MILESTONES_STORAGE_KEY, JSON.stringify(dispatchedIds));
    } catch (e) {}
  }

  return {
    evaluated: CAMP_SCHEDULED_MILESTONES.length,
    dispatched: newlyDispatched,
  };
}
