// Utility functions for Registrations Admin Module

export const KERALA_DISTRICTS = [
  'Malappuram',
  'Kozhikode',
  'Kannur',
  'Kasaragod',
  'Wayanad',
  'Palakkad',
  'Thrissur',
  'Ernakulam',
  'Idukki',
  'Kottayam',
  'Alappuzha',
  'Pathanamthitta',
  'Kollam',
  'Thiruvananthapuram',
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'regular', label: 'Regular Student', color: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300 border-neutral-500/20' },
  { value: 'vip', label: 'VIP Guest', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  { value: 'delegate', label: 'Dars Delegate', color: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30' },
  { value: 'faculty', label: 'Faculty / Mudarris', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  { value: 'volunteer', label: 'Volunteer', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
] as const;

/**
 * Format timestamp into exact Date + 12-hour Time (e.g., "14 Nov 2026, 12:58 PM")
 */
export function formatExactDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Format timestamp into full date + 12-hour time with seconds
 */
export function formatFullDateTimeWithSeconds(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/**
 * Humanized relative time ("Just now", "8m ago", "2h ago", "Yesterday 4:15 PM")
 */
export function formatRelativeTime(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs)) return '';

    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 45) return 'Just now';

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) {
      const timeStr = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `Yesterday ${timeStr}`;
    }
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

/**
 * Detailed human elapsed time string ("2 hours, 14 minutes ago")
 */
export function getDetailedTimeElapsed(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    const diffMs = Date.now() - d.getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';

    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 1) return 'Less than a minute ago';
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;

    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'}${remMins > 0 ? `, ${remMins} min` : ''} ago`;
    }

    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days} day${days === 1 ? '' : 's'}${remHours > 0 ? `, ${remHours} hr` : ''} ago`;
  } catch {
    return '';
  }
}

/**
 * Clean phone to pure digits (last 10 digits for Indian mobile numbers)
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Generate direct WhatsApp URL with pre-filled organizer message
 */
export function getWhatsAppUrl(phone?: string | null, fullName?: string, refId?: string, status?: string): string {
  const digits = cleanPhoneNumber(phone);
  if (!digits) return '#';
  const clean10 = digits.slice(-10);
  const name = fullName || 'Student';
  const id = refId || '';
  const currentStatus = status || 'confirmed';

  const message = `Assalamu Alaikum ${name},\n\nGreetings from UFUQ '26 Organizers (7-Day Residential Workshop, Jamia Nooriyya Arabiyya).\n\nYour Registration Reference: *${id}*\nStatus: *${currentStatus.toUpperCase()}*\n\nPlease keep this reference code handy. Feel free to reply here if you have any questions.`;

  return `https://wa.me/91${clean10}?text=${encodeURIComponent(message)}`;
}

/**
 * Check if a timestamp occurred today
 */
export function isToday(isoString?: string | null): boolean {
  if (!isoString) return false;
  try {
    const d = new Date(isoString);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Check if a timestamp occurred yesterday
 */
export function isYesterday(isoString?: string | null): boolean {
  if (!isoString) return false;
  try {
    const d = new Date(isoString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      d.getDate() === yesterday.getDate() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getFullYear() === yesterday.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Check if a timestamp falls within the last N days
 */
export function isWithinDays(isoString?: string | null, days: number = 7): boolean {
  if (!isoString) return false;
  try {
    const d = new Date(isoString);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return d.getTime() >= cutoff.getTime();
  } catch {
    return false;
  }
}
