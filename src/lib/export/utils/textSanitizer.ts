/**
 * Text & Data Sanitizer for Spreadsheets and Export Formats
 */

/**
 * Mitigates CSV / Excel formula injection (CSV Injection / Formula Injection CWE-1236).
 * Any field starting with =, +, -, @, \t, or \r is prefixed with a single quote.
 */
export function sanitizeForFormulaInjection(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Escapes a field for standard RFC 4180 CSV export.
 * Wraps in double quotes if it contains commas, semicolons, quotes, or newlines.
 */
export function escapeCsvField(value: string | number | boolean | null | undefined, sanitize = true): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  if (sanitize) {
    str = sanitizeForFormulaInjection(str);
  }

  // Double quotes escape inside quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Escapes text for XML Spreadsheet format (Excel XML).
 */
export function escapeXml(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Strips non-printable control characters while preserving UTF-8 letters, Malayalam, Arabic, numbers, and basic punctuation.
 */
export function cleanExportText(text: string): string {
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}
