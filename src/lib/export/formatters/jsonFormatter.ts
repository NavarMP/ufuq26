import { ExportColumn } from '../types';
import { maskPhoneNumber, maskEmail } from '../utils/piiSanitizer';

export interface JsonFormatterOptions<T> {
  data: T[];
  columns: ExportColumn<T>[];
  visibleColumnIds?: string[];
  title?: string;
  maskPii?: boolean;
  metadata?: Record<string, string | number>;
}

export function formatDataToJson<T>(options: JsonFormatterOptions<T>): string {
  const { data, columns, visibleColumnIds, title = 'UFUQ ’26 Data Export', maskPii = false, metadata = {} } = options;

  const activeColumns = visibleColumnIds
    ? columns.filter((col) => visibleColumnIds.includes(col.id))
    : columns;

  const mappedRecords = data.map((item, idx) => {
    const record: Record<string, any> = {};
    activeColumns.forEach((col) => {
      let val = col.accessor(item, idx);
      if (maskPii && col.isPii) {
        if (typeof val === 'string' && val.includes('@')) {
          val = maskEmail(val);
        } else {
          val = maskPhoneNumber(String(val));
        }
      }
      record[col.id] = val;
    });
    return record;
  });

  const outputEnvelope = {
    $schema: 'https://alathurpadidars.in/schemas/export-v1.json',
    system: 'UFUQ ’26 Transition & Leadership Camp',
    organization: 'Alathurpadi Dars Students Association (ADSA)',
    title,
    exportedAt: new Date().toISOString(),
    totalRecords: mappedRecords.length,
    metadata,
    records: mappedRecords,
  };

  return JSON.stringify(outputEnvelope, null, 2);
}
