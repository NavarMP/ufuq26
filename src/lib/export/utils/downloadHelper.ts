/**
 * Cross-Browser Blob Downloader & Delivery Utility
 */

export interface BlobDownloadOptions {
  blob: Blob;
  filename: string;
}

/**
 * Triggers a native browser download for a Blob payload and automatically revokes the ObjectURL.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Defer cleanup to allow browser download initiation
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Creates a text Blob with UTF-8 encoding.
 */
export function createTextBlob(content: string, mimeType: string, prependBom = false): Blob {
  const parts: BlobPart[] = [];
  if (prependBom) {
    // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
    parts.push('\uFEFF');
  }
  parts.push(content);
  return new Blob(parts, { type: `${mimeType};charset=utf-8;` });
}

/**
 * Formats a clean, filesystem-safe filename with date.
 * e.g. "UFUQ26_Registrations_Confirmed_2026-11-14.csv"
 */
export function generateExportFilename(prefix: string, extension: string, suffix?: string): string {
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeSuffix = suffix ? `_${suffix.replace(/[^a-zA-Z0-9_-]/g, '_')}` : '';
  const dateStr = new Date().toISOString().split('T')[0];
  const cleanExt = extension.startsWith('.') ? extension.slice(1) : extension;
  return `${safePrefix}${safeSuffix}_${dateStr}.${cleanExt}`;
}
