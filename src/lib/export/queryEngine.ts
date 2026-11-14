import { ExportSortConfig } from './types';

/**
 * Natural Alphanumeric String Comparator.
 * Ensures "UF26-2" comes before "UF26-10" and correctly sorts dates and numbers.
 */
export function naturalCompare(a: any, b: any): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;

  // Numbers
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // Dates
  const dateA = Date.parse(a);
  const dateB = Date.parse(b);
  if (!isNaN(dateA) && !isNaN(dateB) && typeof a === 'string' && (a.includes('-') || a.includes('/'))) {
    return dateA - dateB;
  }

  // Natural string sort
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

/**
 * Multi-tier sorting of items.
 */
export function sortRecords<T>(
  records: T[],
  sortConfigs: (ExportSortConfig | { accessor: (item: T) => any; direction: 'asc' | 'desc' })[]
): T[] {
  if (!sortConfigs || sortConfigs.length === 0) return [...records];

  return [...records].sort((itemA, itemB) => {
    for (const config of sortConfigs) {
      let valA: any;
      let valB: any;

      if ('accessor' in config) {
        valA = config.accessor(itemA);
        valB = config.accessor(itemB);
      } else {
        valA = (itemA as any)[config.field];
        valB = (itemB as any)[config.field];
      }

      const cmp = naturalCompare(valA, valB);
      if (cmp !== 0) {
        return config.direction === 'desc' ? -cmp : cmp;
      }
    }
    return 0;
  });
}

/**
 * Omni-search across designated accessors or properties.
 */
export function searchRecords<T>(
  records: T[],
  query: string,
  fieldExtractors: ((item: T) => string | number | null | undefined)[]
): T[] {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return records;

  return records.filter((item) => {
    for (const extractor of fieldExtractors) {
      const val = extractor(item);
      if (val !== null && val !== undefined) {
        if (String(val).toLowerCase().includes(cleanQ)) {
          return true;
        }
      }
    }
    return false;
  });
}

/**
 * Groups an array of records by a category key and returns a map.
 */
export function groupRecordsBy<T>(
  records: T[],
  keyExtractor: (item: T) => string
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of records) {
    const key = keyExtractor(item) || 'Uncategorized';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}
