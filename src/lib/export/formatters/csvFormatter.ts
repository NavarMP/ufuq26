import { ExportColumn } from '../types';
import { escapeCsvField } from '../utils/textSanitizer';
import { maskPhoneNumber, maskEmail } from '../utils/piiSanitizer';

export interface CsvFormatterOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  visibleColumnIds?: string[];
  delimiter?: ',' | ';';
  maskPii?: boolean;
}

/**
 * Generates an RFC 4180 compliant CSV string with formula sanitization and UTF-8 BOM support.
 */
export function formatDataToCsv<T>(options: CsvFormatterOptions<T>): string {
  const { data, columns, visibleColumnIds, delimiter = ',', maskPii = false } = options;

  const activeColumns = visibleColumnIds
    ? columns.filter((col) => visibleColumnIds.includes(col.id))
    : columns;

  if (activeColumns.length === 0) return '';

  // 1. Header row
  const headerRow = activeColumns
    .map((col) => escapeCsvField(col.header, false))
    .join(delimiter);

  // 2. Data rows
  const rows: string[] = [];

  data.forEach((item, idx) => {
    const row = activeColumns
      .map((col) => {
        let val = col.accessor(item, idx);

        if (maskPii && col.isPii) {
          if (typeof val === 'string' && val.includes('@')) {
            val = maskEmail(val);
          } else {
            val = maskPhoneNumber(String(val));
          }
        }

        return escapeCsvField(val, true);
      })
      .join(delimiter);

    rows.push(row);
  });

  return [headerRow, ...rows].join('\r\n');
}
