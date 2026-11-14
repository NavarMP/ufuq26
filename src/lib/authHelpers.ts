/**
 * Authentication and normalization utilities for UFUQ '26 Dars accounts
 */

/**
 * Normalizes any phone number input into clean 10-digit format
 * e.g. "+91 9876 543210" -> "9876543210"
 * e.g. "09876543210" -> "9876543210"
 * e.g. "+919876543210" -> "9876543210"
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  // If starts with 91 and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  // If starts with 0 and has 11 digits, strip leading zero
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  // Otherwise take last 10 digits
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Formats a phone number for user-friendly display
 * e.g. "9876543210" -> "+91 98765 43210"
 */
export function formatDisplayPhone(phone: string | null | undefined): string {
  const clean = normalizePhone(phone);
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  }
  return phone || '';
}

/**
 * Generates standard password for a Dars center
 * Uses lowercase RegNo + suffix + '@ufuq'
 */
export function generateDarsPassword(regNo: string, suffix: string | number = '01'): string {
  if (!regNo) return `ufuq${suffix}@ufuq`;
  const cleanReg = regNo.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanSuffix = typeof suffix === 'number' ? String(suffix).padStart(2, '0') : suffix;
  return `${cleanReg}${cleanSuffix}@ufuq`;
}

/**
 * Validates a password input against stored password
 * Uses case-insensitive comparison or exact match
 */
export function validateDarsPassword(inputPass: string, storedPass: string): boolean {
  if (!inputPass || !storedPass) return false;
  return inputPass.trim() === storedPass.trim();
}
