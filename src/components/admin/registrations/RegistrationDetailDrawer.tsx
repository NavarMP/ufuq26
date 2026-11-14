'use client';

import React, { useState } from 'react';
import { Registration, SuffaDars } from '@/types';
import {
  formatFullDateTimeWithSeconds,
  getDetailedTimeElapsed,
  getWhatsAppUrl,
} from './registrationUtils';
import {
  X,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Copy,
  Check,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  ExternalLink,
  MessageSquare,
  MapPin,
  Tag,
  ShieldAlert,
  Save,
  Printer,
  DoorOpen,
  UtensilsCrossed,
  BookOpen,
} from 'lucide-react';
import PlasticCardBadge from '@/components/badge/PlasticCardBadge';
import { ensureRegistrationCode } from '@/lib/regCodeGenerator';
import SendNoticeModal from './SendNoticeModal';

interface RegistrationDetailDrawerProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (reg: Registration) => void;
  onStatusChange: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onPermanentDelete: (id: string, name: string) => void;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  darsList: SuffaDars[];
}

export default function RegistrationDetailDrawer({
  registration,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
  onArchive,
  onUnarchive,
  onPermanentDelete,
  onSaveNotes,
  darsList,
}: RegistrationDetailDrawerProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [adminNotes, setAdminNotes] = useState(registration?.adminNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  // Sync adminNotes when registration changes
  React.useEffect(() => {
    setAdminNotes(registration?.adminNotes || '');
    setNotesSavedSuccess(false);
  }, [registration]);

  if (!isOpen || !registration) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(registration.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 1500);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await onSaveNotes(registration.id, adminNotes);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 2000);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const waUrl = getWhatsAppUrl(
    registration.phone,
    registration.fullName,
    registration.id,
    registration.status
  );

  // Find matching Dars in directory if extra details are available
  const matchedDars = darsList.find(
    (d) =>
      d.regNo === registration.darsRegNo ||
      d.id === registration.darsId ||
      d.nameEn.toLowerCase() === (registration.darsName || '').toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-neutral-900 shadow-2xl flex flex-col border-l border-brand-gold/20">
          {/* Drawer Top Header */}
          <div className="px-6 py-5 border-b border-brand-gold/15 flex items-center justify-between bg-black/5 dark:bg-white/5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-base text-brand-gold tracking-tight">
                  {registration.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1 hover:bg-brand-gold/20 rounded text-neutral-400 hover:text-brand-gold transition-colors"
                  title="Copy Reference ID"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Status selector */}
                <select
                  value={registration.status}
                  onChange={(e) =>
                    onStatusChange(registration.id, e.target.value as any)
                  }
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
                    registration.status === 'confirmed'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : registration.status === 'cancelled'
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {registration.isArchived && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-500/20 text-neutral-400 border border-neutral-500/30 flex items-center gap-1">
                    <Archive className="w-3 h-3" />
                    <span>Archived</span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Contact & Communication Action Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setIsNoticeModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all hover:scale-[1.02] active:scale-95"
                title="Send Omnichannel Notice (Email, SMS, WhatsApp, In-App)"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-navy" />
                <span>Send Notice</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
                title="Send WhatsApp confirmation message"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${registration.phone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-brand-gold/15 text-neutral-800 dark:text-neutral-200 font-semibold text-xs border border-brand-gold/20 transition-all"
                title="Direct Phone Call"
              >
                <Phone className="w-3.5 h-3.5 text-brand-gold" />
                <span>Call</span>
              </a>

              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs border border-white/10 shadow transition-all"
                title="Preview & Print CR80 Plastic ID Card"
              >
                <Printer className="w-3.5 h-3.5 text-brand-gold" />
                <span>Print ID</span>
              </button>
            </div>

            {/* Campus Gate & Accreditation Status */}
            <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider flex items-center gap-1.5">
                  <DoorOpen className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Gate &amp; Accreditation Status</span>
                </h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    registration.gateStatus === 'inside'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {registration.gateStatus === 'inside' ? 'INSIDE CAMPUS' : 'OUTSIDE VENUE'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="text-[10px] text-neutral-400 block">Registration Code</span>
                  <span className="font-mono font-bold text-brand-gold text-xs truncate block">
                    {registration.regCode || registration.id}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="text-[10px] text-neutral-400 block">Campus Entries</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-100">
                    {registration.totalCampusEntries || 0} Entries
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                  <span className="text-[10px] text-neutral-400 block">Meals Claimed</span>
                  <span className="font-mono font-bold text-indigo-400">
                    {Object.keys(registration.claimedMeals || {}).length} Vouchers
                  </span>
                </div>
              </div>
            </div>

            {/* Candidate Profile Details */}
            <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 space-y-3">
              <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider">
                Candidate Profile
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Full Name</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                    {registration.fullName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 block">Contact Phone</span>
                  <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {registration.phone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 block">Email Address</span>
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {registration.email || <span className="italic text-neutral-400">None</span>}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 block">Registration Source</span>
                  <span className="font-mono text-neutral-700 dark:text-neutral-300">
                    {registration.source === 'admin_manual' ? 'Admin Walk-in / Manual' : 'Online Website'}
                  </span>
                </div>
              </div>
            </div>

            {/* SUFFA Dars Institution Profile */}
            <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                  <span>SUFFA Dars Institution</span>
                </h4>
                {registration.darsRegNo && (
                  <span className="px-2 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono font-bold text-xs">
                    {registration.darsRegNo}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Institution Name</span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100">
                    {registration.darsName || registration.darsYear || '—'}
                  </span>
                  {matchedDars?.nameMl && (
                    <div className="text-neutral-400 text-[11px] font-sans mt-0.5">
                      {matchedDars.nameMl}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Chief Mudarris</span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                      {registration.darsMudarris || matchedDars?.mudarris || '—'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 block">District</span>
                    <span className="text-neutral-800 dark:text-neutral-200 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-brand-gold" />
                      {registration.darsDistrict || matchedDars?.district || 'Kerala'}
                    </span>
                  </div>
                </div>

                {matchedDars?.phone && (
                  <div className="pt-1">
                    <span className="text-[10px] text-neutral-400 block">Mudarris Contact</span>
                    <a
                      href={`tel:${matchedDars.phone}`}
                      className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{matchedDars.phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Time & Audit Trail */}
            <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 space-y-3">
              <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                <span>Timestamp & Audit Trail</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Submitted At (Exact Time)</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {formatFullDateTimeWithSeconds(registration.submittedAt)}
                  </span>
                  <div className="text-[11px] text-brand-gold mt-0.5">
                    {getDetailedTimeElapsed(registration.submittedAt)}
                  </div>
                </div>

                {registration.updatedAt && (
                  <div className="pt-1">
                    <span className="text-[10px] text-neutral-400 block">Last Modified At</span>
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">
                      {formatFullDateTimeWithSeconds(registration.updatedAt)}
                    </span>
                  </div>
                )}

                {registration.isArchived && registration.archivedAt && (
                  <div className="pt-1 text-amber-600 dark:text-amber-400">
                    <span className="text-[10px] text-neutral-400 block">Archived At</span>
                    <span className="font-mono font-medium">
                      {formatFullDateTimeWithSeconds(registration.archivedAt)}
                    </span>
                    {registration.archivedReason && (
                      <div className="text-[11px] text-neutral-400 mt-0.5 italic">
                        Reason: {registration.archivedReason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Internal Admin Notes */}
            <div className="p-4 rounded-2xl glass-panel border border-brand-gold/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase text-neutral-400 font-bold tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Internal Admin Notes</span>
                </h4>
                {notesSavedSuccess && (
                  <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Saved!
                  </span>
                )}
              </div>

              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add private organizer notes (e.g. fees paid offline, room accommodation, special dietary requirements)..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-brand-gold resize-none"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes || adminNotes === (registration.adminNotes || '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors disabled:opacity-40"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-brand-gold/15 bg-black/5 dark:bg-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Archive / Restore */}
              {registration.isArchived ? (
                <button
                  onClick={() => onUnarchive(registration.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold border border-emerald-500/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              ) : (
                <button
                  onClick={() => onArchive(registration.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-amber-500/15 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 text-xs font-semibold border border-brand-gold/20 transition-colors"
                  title="Move to Archived pool"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              )}

              {/* Permanent Delete */}
              <button
                onClick={() => onPermanentDelete(registration.id, registration.fullName)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/30 transition-colors"
                title="Permanently remove record"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            {/* Edit */}
            <button
              onClick={() => onEdit(registration)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* CR80 Plastic Card Badge Preview Modal */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-brand-gold/40 shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-brand-gold/20">
              <span className="font-clash text-lg font-bold text-white">
                Plastic Card ID Badge
              </span>
              <button
                type="button"
                onClick={() => setIsBadgeModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <PlasticCardBadge
              registration={registration}
              orientation="portrait"
              showControls={true}
            />
          </div>
        </div>
      )}

      {/* Send Notice Modal */}
      {isNoticeModalOpen && (
        <SendNoticeModal
          registration={registration}
          isOpen={isNoticeModalOpen}
          onClose={() => setIsNoticeModalOpen(false)}
        />
      )}
    </div>
  );
}
