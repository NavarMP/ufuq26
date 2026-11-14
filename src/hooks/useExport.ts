'use client';

import { useState, useCallback } from 'react';
import { UniversalExportConfig, ExportExecuteOptions, executeExport } from '@/lib/export';
import toast from 'react-hot-toast';

export function useExport<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConfig, setActiveConfig] = useState<UniversalExportConfig<T> | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const openExport = useCallback((config: UniversalExportConfig<T>) => {
    setActiveConfig(config);
    setIsOpen(true);
  }, []);

  const closeExport = useCallback(() => {
    setIsOpen(false);
  }, []);

  const runExport = useCallback(
    async (options: ExportExecuteOptions) => {
      if (!activeConfig) return;
      setIsExporting(true);
      try {
        const result = await executeExport(activeConfig, options);
        toast.success(`Exported ${result.count} records (${result.filename})`);
        setIsOpen(false);
      } catch (err: any) {
        console.error('Export failed:', err);
        toast.error(`Export failed: ${err.message || 'Unknown error'}`);
      } finally {
        setIsExporting(false);
      }
    },
    [activeConfig]
  );

  return {
    isOpen,
    activeConfig,
    isExporting,
    openExport,
    closeExport,
    runExport,
  };
}
