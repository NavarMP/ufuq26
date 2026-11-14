// Multi-provider Calendar Event generator for UFUQ '26
// Supports Google Calendar, Apple Calendar, Microsoft Outlook, Microsoft 365, Samsung Calendar, Yahoo, and universal RFC 5545 .ics

export interface CalendarEvent {
  id?: string;
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO string e.g. 2026-12-24T09:00:00+05:30
  endDate: string;   // ISO string e.g. 2026-12-30T17:00:00+05:30
  allDay?: boolean;
  url?: string;
  alarmsMinutesBefore?: number[]; // e.g. [1440, 120] (1 day, 2 hours)
}

// Convert Date to UTC string YYYYMMDDTHHmmssZ
function formatUtcIso(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// Convert Date to YYYYMMDD for all-day events
function formatDateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Escape special characters for .ics standard (RFC 5545)
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n');
}

/**
 * 1. Google Calendar Web Intent Link
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  let datesParam: string;
  if (event.allDay) {
    const nextDay = new Date(end);
    nextDay.setDate(nextDay.getDate() + 1);
    datesParam = `${formatDateOnly(start)}/${formatDateOnly(nextDay)}`;
  } else {
    datesParam = `${formatUtcIso(start)}/${formatUtcIso(end)}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: datesParam,
    details: `${event.description}\n\nVenue: ${event.location}\nMore info: ${event.url || 'https://alathurpadidars.in'}`,
    location: event.location,
    ctz: 'Asia/Kolkata',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * 2. Microsoft Outlook Live (Personal Accounts)
 */
export function generateOutlookLiveUrl(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    subject: event.title,
    body: `${event.description}\n\nVenue: ${event.location}\nWebsite: ${event.url || 'https://alathurpadidars.in'}`,
    location: event.location,
    allday: event.allDay ? 'true' : 'false',
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * 3. Microsoft 365 (Office 365 / University / School Accounts)
 */
export function generateOffice365Url(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    subject: event.title,
    body: `${event.description}\n\nVenue: ${event.location}\nWebsite: ${event.url || 'https://alathurpadidars.in'}`,
    location: event.location,
    allday: event.allDay ? 'true' : 'false',
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * 4. Yahoo Calendar Link
 */
export function generateYahooCalendarUrl(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const params = new URLSearchParams({
    v: '60',
    view: 'd',
    type: '20',
    title: event.title,
    st: formatUtcIso(start),
    et: formatUtcIso(end),
    desc: `${event.description}\n\nVenue: ${event.location}\nWebsite: ${event.url || 'https://alathurpadidars.in'}`,
    in_loc: event.location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * 5. Samsung Calendar Android Intent URI
 */
export function generateSamsungCalendarIntent(event: CalendarEvent): string {
  const start = new Date(event.startDate).getTime();
  const end = new Date(event.endDate).getTime();

  const titleEnc = encodeURIComponent(event.title);
  const descEnc = encodeURIComponent(`${event.description} - https://alathurpadidars.in`);
  const locEnc = encodeURIComponent(event.location);

  return `intent://#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;title=${titleEnc};description=${descEnc};eventLocation=${locEnc};beginTime=${start};endTime=${end};allDay=${event.allDay ? 1 : 0};end`;
}

/**
 * 6. Universal RFC 5545 .ics generator (with Apple Calendar & Samsung enhancements, Asia/Kolkata timezone, and VALARM)
 */
export function generateICalendarData(event: CalendarEvent): string {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const now = new Date();
  const uid = event.id ? `${event.id}@ufuq26.adsa.in` : `ufuq26-${Date.now()}@adsa.in`;

  const alarms = event.alarmsMinutesBefore && event.alarmsMinutesBefore.length > 0
    ? event.alarmsMinutesBefore
    : [1440, 120]; // Default: 24h before & 2h before

  const valarmsString = alarms
    .map((mins) => {
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      let durationStr = '-PT';
      if (hours > 0) durationStr += `${hours}H`;
      if (remMins > 0 || hours === 0) durationStr += `${remMins}M`;

      return [
        'BEGIN:VALARM',
        `TRIGGER:${durationStr}`,
        'ACTION:DISPLAY',
        `DESCRIPTION:Reminder: ${escapeIcsText(event.title)}`,
        'END:VALARM',
      ].join('\r\n');
    })
    .join('\r\n');

  let dtStartLine = '';
  let dtEndLine = '';

  if (event.allDay) {
    const nextDay = new Date(end);
    nextDay.setDate(nextDay.getDate() + 1);
    dtStartLine = `DTSTART;VALUE=DATE:${formatDateOnly(start)}`;
    dtEndLine = `DTEND;VALUE=DATE:${formatDateOnly(nextDay)}`;
  } else {
    dtStartLine = `DTSTART:${formatUtcIso(start)}`;
    dtEndLine = `DTEND:${formatUtcIso(end)}`;
  }

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ADSA//UFUQ 26//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:UFUQ ’26 Camp',
    'X-WR-TIMEZONE:Asia/Kolkata',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatUtcIso(now)}`,
    dtStartLine,
    dtEndLine,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description + '\n\nVenue: ' + event.location + '\nOfficial Site: ' + (event.url || 'https://alathurpadidars.in'))}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'GEO:11.027534;75.986873',
    `X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-APPLE-RADIUS=100;X-TITLE="${escapeIcsText(event.location)}":geo:11.027534,75.986873`,
    'ORGANIZER;CN=Alathurpadi Dars Students Association:mailto:alathurpadidars@gmail.com',
    `URL:${event.url || 'https://alathurpadidars.in'}`,
    'STATUS:CONFIRMED',
    valarmsString,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Helper to download .ics file or open via data URI
 */
export function downloadICalendarFile(event: CalendarEvent, filename = 'UFUQ_26_Event.ics'): void {
  const icsData = generateICalendarData(event);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Format a neat clipboard text invite
 */
export function formatClipboardEvent(event: CalendarEvent): string {
  const start = new Date(event.startDate).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });
  const end = new Date(event.endDate).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  });

  return `🗓️ ${event.title}\n📅 When: ${start} – ${end} (IST)\n📍 Venue: ${event.location}\n🌐 Details: ${event.url || 'https://alathurpadidars.in'}\n\n${event.description}`;
}
