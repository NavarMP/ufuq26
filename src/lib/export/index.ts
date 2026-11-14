/**
 * Universal Data Export Engine Facade for UFUQ '26
 */

import {
  ExportFormat,
  UniversalExportConfig,
  ExportExecuteOptions,
  ExportSheetData,
} from './types';
import { formatDataToCsv } from './formatters/csvFormatter';
import { formatDataToExcelXml } from './formatters/excelFormatter';
import { formatDataToJson } from './formatters/jsonFormatter';
import { formatSessionsToIcs } from './formatters/icsFormatter';
import {
  triggerBlobDownload,
  createTextBlob,
  generateExportFilename,
} from './utils/downloadHelper';

export * from './types';
export * from './queryEngine';
export * from './utils/downloadHelper';
export * from './utils/textSanitizer';
export * from './utils/piiSanitizer';
export * from './formatters/csvFormatter';
export * from './formatters/excelFormatter';
export * from './formatters/jsonFormatter';
export * from './formatters/icsFormatter';
export * from './formatters/vcardFormatter';
export * from './formatters/svgFormatter';

/**
 * Universal Export Executor: Dispatches the export process for any given dataset and options.
 */
export async function executeExport<T = any>(
  config: UniversalExportConfig<T>,
  options: ExportExecuteOptions
): Promise<{ success: boolean; count: number; filename: string }> {
  const {
    title,
    filenamePrefix,
    data,
    selectedIds = [],
    idAccessor = (item: any) => item.id || '',
    columns,
    additionalSheets = [],
    metadata = {},
  } = config;

  const {
    format,
    scope,
    visibleColumnIds,
    maskPii,
    filename: customFilename,
    delimiter = ',',
  } = options;

  // 1. Resolve records based on scope
  let targetRecords: T[] = [];
  if (scope === 'selected' && selectedIds.length > 0) {
    const idSet = new Set(selectedIds);
    targetRecords = data.filter((item) => idSet.has(idAccessor(item)));
  } else {
    targetRecords = data;
  }

  const recordCount = targetRecords.length;

  if (config.onBeforeExport) {
    config.onBeforeExport(format, recordCount);
  }

  // 2. Determine Filename
  const extensionMap: Record<ExportFormat, string> = {
    csv: 'csv',
    xlsx: 'xls', // Excel XML is recognized as .xls by Microsoft Excel / LibreOffice
    json: 'json',
    ics: 'ics',
    pdf: 'pdf',
    png: 'png',
    svg: 'svg',
    vcf: 'vcf',
    print: 'html',
  };

  const extension = extensionMap[format] || 'dat';
  const finalFilename = customFilename || generateExportFilename(filenamePrefix, extension);

  // 3. Serialize and Deliver
  switch (format) {
    case 'csv': {
      const csvContent = formatDataToCsv({
        data: targetRecords,
        columns,
        visibleColumnIds,
        delimiter,
        maskPii,
      });
      const blob = createTextBlob(csvContent, 'text/csv', true); // with UTF-8 BOM
      triggerBlobDownload(blob, finalFilename);
      break;
    }

    case 'xlsx': {
      const activeColumns = visibleColumnIds
        ? columns.filter((col) => visibleColumnIds.includes(col.id))
        : columns;

      const mainSheet: ExportSheetData<T> = {
        sheetName: 'Records',
        data: targetRecords,
        columns: activeColumns,
        title: title || 'UFUQ ’26 Data Export',
        subTitle: `Generated: ${new Date().toLocaleString('en-IN')} · Total Records: ${recordCount}`,
      };

      const allSheets = [mainSheet, ...additionalSheets];
      const xmlContent = formatDataToExcelXml({
        sheets: allSheets,
        maskPii,
        author: 'UFUQ ’26 Organizing Committee',
        company: 'ADSA Alathurpadi',
      });

      const blob = createTextBlob(xmlContent, 'application/vnd.ms-excel', false);
      triggerBlobDownload(blob, finalFilename);
      break;
    }

    case 'json': {
      const jsonContent = formatDataToJson({
        data: targetRecords,
        columns,
        visibleColumnIds,
        title,
        maskPii,
        metadata: {
          ...metadata,
          exportScope: scope,
          recordCount,
        },
      });
      const blob = createTextBlob(jsonContent, 'application/json', false);
      triggerBlobDownload(blob, finalFilename);
      break;
    }

    case 'ics': {
      // Expects data to be or map to CalendarSessionItem
      const calendarItems = targetRecords as any[];
      const icsContent = formatSessionsToIcs(calendarItems, title);
      const blob = createTextBlob(icsContent, 'text/calendar', false);
      triggerBlobDownload(blob, finalFilename);
      break;
    }

    case 'print': {
      if (typeof window !== 'undefined') {
        window.print();
      }
      break;
    }

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }

  if (config.onExportSuccess) {
    config.onExportSuccess(format, recordCount);
  }

  return { success: true, count: recordCount, filename: finalFilename };
}
