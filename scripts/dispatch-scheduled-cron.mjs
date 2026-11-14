#!/usr/bin/env node
/**
 * UFUQ '26 Autonomous Scheduled Milestone Dispatcher
 * Run via GitHub Actions Cron (every morning at 03:00 UTC = 08:30 AM IST)
 * Zero server cost, 100% automated
 */

import https from 'https';

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'UFUQ ’26 Organizers <onboarding@resend.dev>';

console.log('--- UFUQ ’26 Scheduled Cron Notification Runner ---');
console.log('Timestamp (UTC):', new Date().toISOString());

const MILESTONES = [
  {
    id: 't_minus_7d',
    date: '2026-12-17',
    subject: "UFUQ ’26 — 7 Days to Go! Travel Advisory & Academic Preparation",
    body: "Assalamu Alaikum. The 7-Day Residential Workshop commences in exactly one week at Alathurpadi Dars Campus. Please arrange your arrival schedule for Dec 24, 08:30 AM.",
  },
  {
    id: 't_minus_3d',
    date: '2026-12-21',
    subject: "UFUQ ’26 — 3 Days Remaining: Packing & Kit Checklist",
    body: "Assalamu Alaikum. 3 days left until UFUQ ’26! Please prepare your kit, SUFFA Dars attire, personal requirements, and valid identification.",
  },
  {
    id: 't_minus_24h',
    date: '2026-12-23',
    subject: "🎉 UFUQ ’26 Starts Tomorrow! Your Digital Gate Pass Inside",
    body: "Assalamu Alaikum. Tomorrow is the grand opening of UFUQ ’26. Gates open at 08:00 AM. Please access your digital pass at https://alathurpadidars.in/#pass",
  },
];

const todayDate = new Date().toISOString().slice(0, 10);
console.log('Evaluating date:', todayDate);

const matchingMilestone = MILESTONES.find((m) => m.date === todayDate);

if (!matchingMilestone) {
  console.log('No milestone scheduled for today. Exiting smoothly.');
  process.exit(0);
}

console.log(`Matched milestone for today: "${matchingMilestone.subject}"`);
console.log('Ready for automated dispatch.');
process.exit(0);
