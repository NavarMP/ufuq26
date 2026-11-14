/**
 * UFUQ '26 Unified Data Export & Share Type System
 */

export type ExportFormat =
  | 'csv'
  | 'xlsx'
  | 'pdf'
  | 'json'
  | 'ics'
  | 'png'
  | 'svg'
  | 'vcf'
  | 'print';

export type ExportScope = 'filtered' | 'selected' | 'all';

export interface ExportColumn<T = any> {
  id: string;
  header: string;
  accessor: (item: T, index: number) => string | number | boolean | null | undefined;
  category?: 'identity' | 'contact' | 'institution' | 'status' | 'meta' | 'curriculum';
  defaultVisible?: boolean;
  width?: number; // suggested character width
  alignment?: 'left' | 'center' | 'right';
  isPii?: boolean; // sensitive personal identifiable info
}

export interface ExportPreset<T = any> {
  id: string;
  title: string;
  description: string;
  format: ExportFormat;
  visibleColumnIds: string[];
  maskPii?: boolean;
  groupByField?: string;
  defaultSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface ExportFilterField {
  id: string;
  label: string;
  type: 'select' | 'text' | 'date-range' | 'boolean';
  options?: { value: string; label: string }[];
  currentValue?: any;
}

export interface ExportSortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ExportSheetData<T = any> {
  sheetName: string;
  data: T[];
  columns: ExportColumn<T>[];
  title?: string;
  subTitle?: string;
}

export interface UniversalExportConfig<T = any> {
  title: string;
  filenamePrefix: string;
  data: T[];
  selectedIds?: string[];
  idAccessor?: (item: T) => string;
  columns: ExportColumn<T>[];
  presets?: ExportPreset<T>[];
  defaultFormat?: ExportFormat;
  category?: string;
  additionalSheets?: ExportSheetData<any>[];
  metadata?: Record<string, string | number>;
  onBeforeExport?: (format: ExportFormat, count: number) => void;
  onExportSuccess?: (format: ExportFormat, count: number) => void;
}

export interface ExportExecuteOptions {
  format: ExportFormat;
  scope: ExportScope;
  visibleColumnIds: string[];
  maskPii: boolean;
  filename?: string;
  delimiter?: ',' | ';';
  includeMetadata?: boolean;
  sortConfig?: ExportSortConfig;
  groupByField?: string;
}
