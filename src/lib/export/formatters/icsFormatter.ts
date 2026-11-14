/**
 * Universal RFC 5545 iCalendar (.ics) Generator
 * Supports batch multi-event packages, alarms, organizer credentials, and geocoding.
 */

export interface CalendarSessionItem {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string; // ISO or YYYY-MM-DDTHH:mm:ss+05:30
  endDate: string;
  allDay?: boolean;
  category?: string;
  url?: string;
  alarmsMinutesBefore?: number[]; // e.g. [1440, 120, 15]
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
}

function formatUtcIso(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function formatDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function formatSessionsToIcs(
  events: CalendarSessionItem[],
  calendarName = 'UFUQ ’26 Horizon Schedule'
): string {
  const nowUtc = formatUtcIso(new Date());

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ADSA//UFUQ 2026 Residential Camp//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  for (const event of events) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const uid = `${event.id || 'event'}-${start.getTime()}@alathurpadidars.in`;
    const loc = event.location || 'Alathurpadi Dars Campus, Malappuram, Kerala 676503, India';
    const desc = event.description || "UFUQ ’26 — A Transition & Leadership Camp organized by ADSA.";
    const url = event.url || 'https://alathurpadidars.in';

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${nowUtc}`);

    if (event.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${formatDateOnly(start)}`);
      const nextDay = new Date(end);
      nextDay.setDate(nextDay.getDate() + 1);
      lines.push(`DTEND;VALUE=DATE:${formatDateOnly(nextDay)}`);
    } else {
      lines.push(`DTSTART:${formatUtcIso(start)}`);
      lines.push(`DTEND:${formatUtcIso(end)}`);
    }

    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    lines.push(`DESCRIPTION:${escapeIcsText(`${desc}\n\nVenue: ${loc}\nWebsite: ${url}`)}`);
    lines.push(`LOCATION:${escapeIcsText(loc)}`);
    lines.push('GEO:11.0267;76.0825'); // Alathurpadi, Malappuram
    lines.push(`URL:${url}`);
    lines.push('STATUS:CONFIRMED');

    if (event.category) {
      lines.push(`CATEGORIES:${escapeIcsText(event.category)}`);
    }

    // Default alarms: 1 day before (1440m) and 2 hours before (120m)
    const alarms = event.alarmsMinutesBefore || [1440, 120];
    for (const mins of alarms) {
      lines.push('BEGIN:VALARM');
      lines.push('ACTION:DISPLAY');
      lines.push(`DESCRIPTION:Reminder: ${escapeIcsText(event.title)} commences soon`);
      lines.push(`TRIGGER:-PT${mins}M`);
      lines.push('END:VALARM');
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
