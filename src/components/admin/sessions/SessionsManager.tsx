'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from 'lucide-react';
import { ScheduleSession } from '@/types';
import { useExport } from '@/hooks/useExport';
import UniversalExportModal from '@/components/export/UniversalExportModal';
import ExportTriggerButton from '@/components/export/ExportTriggerButton';
import {
  ExportColumn,
  ExportPreset,
  UniversalExportConfig,
  ExportFormat,
  executeExport,
} from '@/lib/export';
import SessionFormModal from './SessionFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import StatusBadge from '../shared/StatusBadge';

interface SessionsManagerProps {
  schedule: ScheduleSession[];
  addSession: (session: Omit<ScheduleSession, 'id'>) => Promise<void>;
  updateSession: (id: string, session: Partial<ScheduleSession>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

export default function SessionsManager({
  schedule,
  addSession,
  updateSession,
  deleteSession,
}: SessionsManagerProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduleSession | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const filteredSchedule = useMemo(() => {
    return schedule
      .filter((s) => {
        if (selectedDay !== 'all' && s.day !== selectedDay) return false;
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          s.title.en.toLowerCase().includes(q) ||
          (s.title.ml && s.title.ml.toLowerCase().includes(q)) ||
          (s.category && s.category.toLowerCase().includes(q)) ||
          (s.description?.en && s.description.en.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [schedule, selectedDay, searchQuery]);

  const {
    isOpen: isExportModalOpen,
    activeConfig: exportModalConfig,
    isExporting,
    openExport,
    closeExport,
    runExport,
  } = useExport<ScheduleSession>();

  const sessionExportColumns: ExportColumn<ScheduleSession>[] = useMemo(
    () => [
      { id: 'day', header: 'Camp Day', accessor: (s) => `Day ${s.day}`, width: 10, defaultVisible: true },
      { id: 'date', header: 'Date', accessor: (s) => s.date, width: 12, defaultVisible: true },
      { id: 'startTime', header: 'Start Time', accessor: (s) => s.startTime, width: 10, defaultVisible: true },
      { id: 'endTime', header: 'End Time', accessor: (s) => s.endTime, width: 10, defaultVisible: true },
      { id: 'titleEn', header: 'Title (English)', accessor: (s) => s.title.en, width: 30, defaultVisible: true },
      { id: 'titleMl', header: 'Title (Malayalam)', accessor: (s) => s.title.ml || '', width: 30, defaultVisible: true },
      { id: 'category', header: 'Category / Track', accessor: (s) => s.category || 'General', width: 16, defaultVisible: true },
      { id: 'speaker', header: 'Speaker / Faculty', accessor: (s) => s.speaker || '—', width: 22, defaultVisible: true },
      { id: 'location', header: 'Room / Venue', accessor: (s) => s.location || 'Main Auditorium', width: 20, defaultVisible: true },
      { id: 'description', header: 'Session Summary', accessor: (s) => s.description?.en || '', width: 35, defaultVisible: false },
      { id: 'published', header: 'Published', accessor: (s) => (s.published ? 'Yes' : 'Draft'), width: 10, defaultVisible: false },
    ],
    []
  );

  const sessionPresets: ExportPreset<ScheduleSession>[] = useMemo(
    () => [
      {
        id: 'curriculum_master',
        title: 'Master Curriculum Schedule',
        description: 'Complete 7-day academic plan with all tracks and speakers in Excel',
        format: 'xlsx',
        visibleColumnIds: [
          'day', 'date', 'startTime', 'endTime', 'titleEn', 'titleMl', 'category', 'speaker', 'location', 'description', 'published'
        ],
      },
      {
        id: 'daily_roster',
        title: 'Daily Timetable Roster',
        description: 'Chronological time, speaker, and hall assignment sheet',
        format: 'csv',
        visibleColumnIds: ['day', 'startTime', 'endTime', 'titleEn', 'speaker', 'location', 'category'],
      },
      {
        id: 'calendar_sync',
        title: 'Universal Calendar (.ics)',
        description: 'RFC 5545 calendar package ready to sync to Google or Apple Calendar',
        format: 'ics',
        visibleColumnIds: ['day', 'date', 'startTime', 'endTime', 'titleEn', 'category', 'location'],
      },
    ],
    []
  );

  const handleOpenExportModal = () => {
    openExport({
      title: selectedDay === 'all' ? "UFUQ ’26 Full 7-Day Curriculum" : `UFUQ ’26 Day ${selectedDay} Schedule`,
      filenamePrefix: `UFUQ26_Schedule_${selectedDay === 'all' ? 'Full' : `Day_${selectedDay}`}`,
      data: filteredSchedule,
      columns: sessionExportColumns,
      presets: sessionPresets,
      defaultFormat: 'xlsx',
    });
  };

  const handleQuickExport = async (format: ExportFormat) => {
    await executeExport(
      {
        title: selectedDay === 'all' ? "UFUQ ’26 Full 7-Day Curriculum" : `UFUQ ’26 Day ${selectedDay} Schedule`,
        filenamePrefix: `UFUQ26_Schedule_${selectedDay === 'all' ? 'Full' : `Day_${selectedDay}`}`,
        data: filteredSchedule,
        columns: sessionExportColumns,
        presets: sessionPresets,
        defaultFormat: 'xlsx',
      },
      {
        format,
        scope: 'filtered',
        visibleColumnIds: sessionExportColumns.filter((c) => c.defaultVisible !== false).map((c) => c.id),
        maskPii: false,
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Controls & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedDay('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDay === 'all'
                ? 'bg-brand-gold text-brand-navy font-bold shadow-sm'
                : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
            }`}
          >
            All Days ({schedule.length})
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => {
            const count = schedule.filter((s) => s.day === d).length;
            const isSelected = selectedDay === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-gold text-brand-navy font-bold shadow-sm'
                    : 'glass-panel bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-300 hover:text-brand-gold'
                }`}
              >
                Day {d} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Actions: Export & Add Session */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <ExportTriggerButton
            label="Export Curriculum"
            count={filteredSchedule.length}
            onOpenModal={handleOpenExportModal}
            onQuickExport={handleQuickExport}
          />

          <button
            type="button"
            onClick={() => {
              setEditingSession(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sessions by title, category, description..."
          className="w-full pl-9 pr-4 py-2 rounded-xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
        />
      </div>

      {/* Schedule Sessions Cards Grid */}
      {filteredSchedule.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-3xl p-8 space-y-3">
          <Calendar className="w-10 h-10 text-brand-gold/40 mx-auto" />
          <p>No timetable sessions found for the current filters.</p>
          <button
            type="button"
            onClick={() => {
              setEditingSession(null);
              setModalOpen(true);
            }}
            className="text-brand-gold font-bold underline"
          >
            Create first session
          </button>
        </div>
      ) : (
        <div className="grid gap-3.5">
          {filteredSchedule.map((session) => (
            <div
              key={session.id}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 hover:border-brand-gold/40 shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                    Day {session.day} • {session.date}
                  </span>
                  <div className="inline-flex items-center gap-1 font-mono text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>
                      {session.startTime} – {session.endTime}
                    </span>
                  </div>
                  {session.category && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-teal/15 text-brand-teal dark:text-emerald-400 border border-brand-teal/20">
                      {session.category}
                    </span>
                  )}
                  <StatusBadge
                    status={session.published ? 'published' : 'draft'}
                    showDot={true}
                  />
                </div>

                <h4 className="font-clash font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {session.title.en}
                </h4>

                {session.title.ml && (
                  <p className="text-xs text-neutral-500 font-medium">
                    {session.title.ml}
                  </p>
                )}

                {session.description?.en && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {session.description.en}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => updateSession(session.id, { published: !session.published })}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                    session.published
                      ? 'text-emerald-500 hover:bg-emerald-500/10'
                      : 'text-neutral-400 hover:bg-neutral-500/10'
                  }`}
                  title={session.published ? 'Unpublish from live website' : 'Publish to live website'}
                >
                  {session.published ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingSession(session);
                    setModalOpen(true);
                  }}
                  className="p-2 rounded-xl text-brand-gold hover:bg-brand-gold/10 transition-colors"
                  title="Edit session details"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Delete Schedule Session',
                      description: `Are you sure you want to delete "${session.title.en}"? This action cannot be undone.`,
                      onConfirm: async () => {
                        await deleteSession(session.id);
                        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                      },
                    });
                  }}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Editor Modal */}
      <SessionFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingSession={editingSession}
        totalSessionsCount={schedule.length}
        onSave={async (payload) => {
          if (editingSession) {
            await updateSession(editingSession.id, payload);
          } else {
            await addSession(payload);
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Universal Export Suite Modal */}
      <UniversalExportModal
        isOpen={isExportModalOpen}
        onClose={closeExport}
        config={exportModalConfig}
        onExecute={runExport}
        isExporting={isExporting}
      />
    </div>
  );
}
