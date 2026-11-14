'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
} from 'lucide-react';
import { Guest } from '@/types';
import GuestFormModal from './GuestFormModal';
import ConfirmDialog from '../shared/ConfirmDialog';
import StatusBadge from '../shared/StatusBadge';

interface GuestsManagerProps {
  guests: Guest[];
  addGuest: (guest: Omit<Guest, 'id'>) => Promise<void>;
  updateGuest: (id: string, guest: Partial<Guest>) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
}

export default function GuestsManager({
  guests,
  addGuest,
  updateGuest,
  deleteGuest,
}: GuestsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

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

  const filteredGuests = useMemo(() => {
    return guests
      .filter((g) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          g.name.en.toLowerCase().includes(q) ||
          (g.name.ml && g.name.ml.toLowerCase().includes(q)) ||
          (g.title?.en && g.title.en.toLowerCase().includes(q)) ||
          (g.bio?.en && g.bio.en.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [guests, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scholars, patrons, faculty by name or role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/25 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGuest(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs shadow hover:bg-brand-gold-hover transition-colors shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Speaker</span>
        </button>
      </div>

      {/* Grid of Speaker Profiles */}
      {filteredGuests.length === 0 ? (
        <div className="py-16 text-center text-xs text-neutral-400 border border-dashed border-brand-gold/20 rounded-3xl p-8 space-y-3">
          <Users className="w-10 h-10 text-brand-gold/40 mx-auto" />
          <p>No speaker profiles match &ldquo;{searchQuery}&rdquo;.</p>
          <button
            type="button"
            onClick={() => {
              setEditingGuest(null);
              setModalOpen(true);
            }}
            className="text-brand-gold font-bold underline"
          >
            Create first speaker profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuests.map((guest) => (
            <div
              key={guest.id}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 hover:border-brand-gold/40 shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start gap-3.5">
                {/* Photo Portrait */}
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-brand-gold/30 bg-black/5 dark:bg-white/5 shrink-0 group-hover:border-brand-gold transition-colors">
                  {guest.photoUrl ? (
                    <Image
                      src={guest.photoUrl}
                      alt={guest.name.en}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-gold font-clash font-bold text-lg">
                      {guest.name.en.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {guest.name.en}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-neutral-400">
                      #{guest.order}
                    </span>
                  </div>

                  {guest.name.ml && (
                    <p className="text-[11px] text-neutral-500 font-medium truncate">
                      {guest.name.ml}
                    </p>
                  )}

                  {guest.title?.en && (
                    <p className="text-xs text-brand-teal dark:text-emerald-400 font-medium line-clamp-1">
                      {guest.title.en}
                    </p>
                  )}
                </div>
              </div>

              {guest.bio?.en && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed text-left">
                  {guest.bio.en}
                </p>
              )}

              {/* Bottom Card Controls */}
              <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between">
                <StatusBadge
                  status={guest.published ? 'published' : 'draft'}
                  showDot={true}
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateGuest(guest.id, { published: !guest.published })}
                    className={`p-1.5 rounded-xl transition-colors ${
                      guest.published
                        ? 'text-emerald-500 hover:bg-emerald-500/10'
                        : 'text-neutral-400 hover:bg-neutral-500/10'
                    }`}
                    title={guest.published ? 'Unpublish' : 'Publish'}
                  >
                    {guest.published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingGuest(guest);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl text-brand-gold hover:bg-brand-gold/10 transition-colors"
                    title="Edit profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDialog({
                        isOpen: true,
                        title: 'Delete Speaker Profile',
                        description: `Are you sure you want to delete "${guest.name.en}"? This action cannot be undone.`,
                        onConfirm: async () => {
                          await deleteGuest(guest.id);
                          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                        },
                      });
                    }}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guest Form Modal */}
      <GuestFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingGuest={editingGuest}
        totalGuestsCount={guests.length}
        onSave={async (payload) => {
          if (editingGuest) {
            await updateGuest(editingGuest.id, payload);
          } else {
            await addGuest(payload);
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
    </div>
  );
}
