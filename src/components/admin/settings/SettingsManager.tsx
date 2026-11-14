'use client';

import React, { useState } from 'react';
import {
  Settings,
  Calendar,
  RotateCcw,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { EventInfo } from '@/types';
import ConfirmDialog from '../shared/ConfirmDialog';

interface SettingsManagerProps {
  eventInfo: EventInfo;
  updateEventInfo: (info: Partial<EventInfo>) => Promise<void>;
  resetToDefaultData: () => void;
}

export default function SettingsManager({
  eventInfo,
  updateEventInfo,
  resetToDefaultData,
}: SettingsManagerProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleToggleRegistration = async () => {
    setIsSaving(true);
    try {
      await updateEventInfo({ registrationOpen: !eventInfo.registrationOpen });
      setSuccessMessage(
        `Registration portal is now ${!eventInfo.registrationOpen ? 'OPEN (Accepting applications)' : 'CLOSED'}`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert('Failed to update registration status: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDatesUpdate = async (field: 'startDate' | 'endDate', val: string) => {
    try {
      await updateEventInfo({ [field]: val });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in text-left">
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Registration Status Control */}
      <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-gold/15">
          <Settings className="w-5 h-5 text-brand-gold" />
          <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
            Registration Portal Status
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-brand-gold/15">
          <div className="space-y-0.5">
            <span className="font-clash font-bold text-sm text-neutral-900 dark:text-white">
              Public Registration Intake
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              When closed, the public application form is disabled and displays a &ldquo;Registration Closed&rdquo; advisory.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleRegistration}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-2 ${
              eventInfo.registrationOpen
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                eventInfo.registrationOpen ? 'bg-white animate-pulse' : 'bg-neutral-400'
              }`}
            />
            <span>{eventInfo.registrationOpen ? 'OPEN (Accepting)' : 'CLOSED'}</span>
          </button>
        </div>
      </div>

      {/* Event Schedule & Dates */}
      <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-brand-gold/15">
          <Calendar className="w-5 h-5 text-brand-gold" />
          <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
            Residency Dates & Timeline
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-neutral-700 dark:text-neutral-300">
              Camp Start Date
            </label>
            <input
              type="date"
              value={eventInfo.startDate}
              onChange={(e) => handleDatesUpdate('startDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/25 font-mono text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-700 dark:text-neutral-300">
              Camp End Date
            </label>
            <input
              type="date"
              value={eventInfo.endDate}
              onChange={(e) => handleDatesUpdate('endDate', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-panel bg-black/5 dark:bg-white/5 border border-brand-gold/25 font-mono text-neutral-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl glass-panel bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/30 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-rose-500">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-clash text-lg font-bold text-rose-600 dark:text-rose-400">
            Danger Zone
          </h3>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Resetting default data will restore initial seed sessions, faculty profiles, initial audio tracks, and initial FAQs from source templates.
        </p>

        <button
          type="button"
          onClick={() => {
            setConfirmDialog({
              isOpen: true,
              title: 'Reset All Event Data to Defaults?',
              description:
                'WARNING: This will overwrite schedule sessions, speaker profiles, audio tracks, and FAQs with initial seed templates. This cannot be undone.',
              onConfirm: () => {
                resetToDefaultData();
                setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                alert('Default template data restored successfully.');
              },
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Content to Default</span>
        </button>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
