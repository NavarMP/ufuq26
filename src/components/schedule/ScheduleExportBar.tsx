'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useEvent } from '@/context/EventContext';
import { useScheduleStore } from '@/store/scheduleStore';
import { resolveLocalized } from '@/lib/translations';
import { ScheduleSession } from '@/types';
import { useExport } from '@/hooks/useExport';
import UniversalExportModal from '@/components/export/UniversalExportModal';
import { ExportColumn, ExportFormat, executeExport } from '@/lib/export';
import { formatSessionsToIcs } from '@/lib/export/formatters/icsFormatter';
import { createTextBlob, triggerBlobDownload } from '@/lib/export/utils/downloadHelper';
import { soundEngine } from '@/lib/soundEngine';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import {
  Download,
  CalendarPlus,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function ScheduleExportBar() {
  const { language, t } = useApp();
  const { schedule } = useEvent();
  const { selectedDay, selectedTrack } = useScheduleStore();
  const { triggerSuccess, triggerLight } = useHapticFeedback();

  const {
    isOpen: isExportModalOpen,
    activeConfig: exportModalConfig,
    isExporting,
    openExport,
    closeExport,
    runExport,
  } = useExport<ScheduleSession>();

  const filteredSessions = React.useMemo(() => {
    return schedule.filter((s) => {
      if (!s.published) return false;
      if (selectedDay !== 'all' && s.day !== selectedDay) return false;
      if (selectedTrack !== 'all' && s.category !== selectedTrack) return false;
      return true;
    });
  }, [schedule, selectedDay, selectedTrack]);

  const sessionColumns: ExportColumn<ScheduleSession>[] = React.useMemo(
    () => [
      { id: 'day', header: 'Camp Day', accessor: (s) => `Day ${s.day}`, width: 10, defaultVisible: true },
      { id: 'date', header: 'Date', accessor: (s) => s.date, width: 12, defaultVisible: true },
      { id: 'startTime', header: 'Start Time', accessor: (s) => s.startTime, width: 10, defaultVisible: true },
      { id: 'endTime', header: 'End Time', accessor: (s) => s.endTime, width: 10, defaultVisible: true },
      { id: 'title', header: 'Title', accessor: (s) => resolveLocalized(s.title, language), width: 30, defaultVisible: true },
      { id: 'category', header: 'Track / Category', accessor: (s) => s.category || 'General', width: 16, defaultVisible: true },
      { id: 'speaker', header: 'Speaker / Scholar', accessor: (s) => s.speaker || '—', width: 22, defaultVisible: true },
      { id: 'location', header: 'Venue / Hall', accessor: (s) => s.location || 'Alathurpadi Campus', width: 20, defaultVisible: true },
    ],
    [language]
  );

  const handleQuickIcs = () => {
    triggerSuccess();
    soundEngine.playSuccess();

    const calendarItems = filteredSessions.map((s) => ({
      id: s.id,
      title: resolveLocalized(s.title, language),
      description: s.description ? resolveLocalized(s.description, language) : `UFUQ ’26 - Day ${s.day} Session`,
      location: s.location || 'Alathurpadi Dars Campus & Conference Hall, Malappuram',
      startDate: `${s.date}T${s.startTime}:00+05:30`,
      endDate: `${s.date}T${s.endTime}:00+05:30`,
      category: s.category,
      url: 'https://alathurpadidars.in/schedule',
    }));

    const icsContent = formatSessionsToIcs(
      calendarItems,
      selectedDay === 'all' ? "UFUQ ’26 Full Horizon Schedule" : `UFUQ ’26 Day ${selectedDay} Schedule`
    );
    const blob = createTextBlob(icsContent, 'text/calendar', false);
    const filename = `UFUQ26_Schedule_${selectedDay === 'all' ? 'All_Days' : `Day_${selectedDay}`}.ics`;
    triggerBlobDownload(blob, filename);
  };

  const handleOpenExportModal = () => {
    triggerLight();
    soundEngine.playClick();
    openExport({
      title: selectedDay === 'all' ? "UFUQ ’26 Horizon Camp Schedule" : `UFUQ ’26 Day ${selectedDay} Schedule`,
      filenamePrefix: `UFUQ26_Timetable_${selectedDay === 'all' ? 'All_Days' : `Day_${selectedDay}`}`,
      data: filteredSessions,
      columns: sessionColumns,
      presets: [
        {
          id: 'calendar_ics',
          title: 'Add to Calendar (.ics)',
          description: 'Multi-session iCalendar file for Google, Apple, and Outlook Calendar',
          format: 'ics',
          visibleColumnIds: sessionColumns.map((c) => c.id),
        },
        {
          id: 'excel_sheet',
          title: 'Excel Timetable (.xlsx)',
          description: 'Formatted timetable with timings, speakers, and venue details',
          format: 'xlsx',
          visibleColumnIds: sessionColumns.map((c) => c.id),
        },
        {
          id: 'csv_data',
          title: 'CSV Schedule',
          description: 'Universal spreadsheet format',
          format: 'csv',
          visibleColumnIds: ['day', 'startTime', 'endTime', 'title', 'category', 'speaker', 'location'],
        },
      ],
      defaultFormat: 'ics',
    });
  };

  const handlePrint = () => {
    soundEngine.playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <>
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-brand-gold/40 shadow-xl bg-gradient-to-r from-brand-navy/20 via-brand-dark/10 to-brand-gold/15 flex flex-col md:flex-row items-center justify-between gap-6 my-12">
        <div className="space-y-1.5 text-center md:text-left rtl:md:text-right">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold">
            <Download className="w-3.5 h-3.5" />
            <span>Universal Schedule Synchronization</span>
          </div>
          <h4 className="font-clash text-lg sm:text-xl font-bold text-brand-navy dark:text-white">
            Export or Print Timetable
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Download the active schedule for offline reference, digital calendars, or spreadsheet analysis.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <button
            onClick={handleQuickIcs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
            title="Download multi-session iCalendar (.ics) file"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>iCal / Google (.ics)</span>
          </button>

          <button
            onClick={handleOpenExportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors"
            title="Open Universal Export Modal (Excel, CSV, ICS)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel / CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-panel border border-neutral-300/40 dark:border-white/10 hover:border-brand-gold text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-colors"
            title="Print printable timetable"
          >
            <Printer className="w-3.5 h-3.5 text-brand-gold" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Universal Export Modal */}
      {isExportModalOpen && exportModalConfig && (
        <UniversalExportModal
          isOpen={isExportModalOpen}
          config={exportModalConfig}
          isExporting={isExporting}
          onClose={closeExport}
          onExecute={runExport}
        />
      )}
    </>
  );
}
