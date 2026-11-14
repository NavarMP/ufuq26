// Helper to generate WhatsApp reminder links for UFUQ '26

import { CampReminder } from '@/types/reminder';

export function generateWhatsAppReminderUrl(reminder: CampReminder): string {
  const targetFormatted = new Date(reminder.targetDateTime).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const notifyFormatted = new Date(reminder.notifyDateTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  const textLines = [
    `🔔 *UFUQ ’26 Reminder Alert*`,
    `📌 *Event:* ${reminder.title}`,
    `📅 *Event Time:* ${targetFormatted} IST`,
    `⏰ *Reminder Scheduled For:* ${notifyFormatted} IST`,
    `📍 *Venue:* Alathurpadi Dars Campus, Malappuram, Kerala`,
    `🌐 *Official Website:* https://alathurpadidars.in`,
    ``,
    `_Organized by Alathurpadi Dars Students Association (ADSA) for SUFFA Dars students._`,
  ];

  const encodedText = encodeURIComponent(textLines.join('\n'));
  // Opening wa.me with empty number allows user to select "Message yourself" or any contact on mobile!
  // Alternatively if helpdesk is desired: `https://wa.me/${helpdeskPhone}?text=${encodedText}`
  return `https://wa.me/?text=${encodedText}`;
}
