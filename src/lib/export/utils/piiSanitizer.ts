/**
 * PII Sanitizer for Public, Volunteer, and Anonymized Data Exports
 */

/**
 * Masks phone numbers to protect delegate and student privacy in public sheets.
 * e.g. "9847123456" -> "+91 9847***456"
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return '***';

  const last10 = digits.slice(-10);
  const prefix = last10.slice(0, 4);
  const suffix = last10.slice(-3);
  return `+91 ${prefix}***${suffix}`;
}

/**
 * Masks email addresses.
 * e.g. "ahmad.faheem@example.com" -> "a***m@example.com"
 */
export function maskEmail(email?: string | null): string {
  if (!email || !email.includes('@')) return '—';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `*@${domain}`;
  const first = local[0];
  const last = local[local.length - 1];
  return `${first}***${last}@${domain}`;
}

/**
 * Strips or redacts sensitive administrative notes or private keys.
 */
export function redactSensitiveText(text?: string | null): string {
  if (!text) return '';
  return '[CONFIDENTIAL REDACTED]';
}
