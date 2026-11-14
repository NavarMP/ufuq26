'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Guest } from '@/types';
import { uploadMediaToSupabase } from '@/lib/supabase';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGuest: Guest | null;
  totalGuestsCount: number;
  onSave: (guest: Omit<Guest, 'id'>) => Promise<void>;
}

export default function GuestFormModal({
  isOpen,
  onClose,
  editingGuest,
  totalGuestsCount,
  onSave,
}: GuestFormModalProps) {
  const [form, setForm] = useState({
    nameEn: '',
    nameMl: '',
    nameAr: '',
    titleEn: '',
    titleMl: '',
    bioEn: '',
    photoUrl: '',
    published: true,
    order: 1,
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGuest) {
      setForm({
        nameEn: editingGuest.name.en,
        nameMl: editingGuest.name.ml || '',
        nameAr: editingGuest.name.ar || '',
        titleEn: editingGuest.title?.en || '',
        titleMl: editingGuest.title?.ml || '',
        bioEn: editingGuest.bio?.en || '',
        photoUrl: editingGuest.photoUrl || '',
        published: editingGuest.published,
        order: editingGuest.order,
      });
    } else {
      setForm({
        nameEn: '',
        nameMl: '',
        nameAr: '',
        titleEn: '',
        titleMl: '',
        bioEn: '',
        photoUrl: '',
        published: true,
        order: totalGuestsCount + 1,
      });
    }
  }, [editingGuest, totalGuestsCount, isOpen]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadError(null);
    try {
      const publicUrl = await uploadMediaToSupabase(file, 'speakers');
      setForm((prev) => ({ ...prev, photoUrl: publicUrl }));
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Upload failed';
      setUploadError(msg);
      alert(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameEn.trim()) {
      alert('Speaker name in English is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: {
          en: form.nameEn.trim(),
          ml: form.nameMl.trim() || undefined,
          ar: form.nameAr.trim() || undefined,
        },
        title: form.titleEn.trim()
          ? { en: form.titleEn.trim(), ml: form.titleMl.trim() || undefined }
          : undefined,
        bio: form.bioEn.trim() ? { en: form.bioEn.trim() } : undefined,
        photoUrl: form.photoUrl.trim() || undefined,
        published: form.published,
        order: Number(form.order),
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to save speaker profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-panel bg-white/95 dark:bg-[#0c1220]/95 border border-brand-gold/30 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/15">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/20 text-brand-gold flex items-center justify-center border border-brand-gold/30">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-clash text-lg font-bold text-neutral-900 dark:text-white">
                    {editingGuest ? 'Edit Speaker Profile' : 'Add New Dignitary / Speaker'}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Faculty, spiritual patrons & keynote luminaries
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Speaker Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="e.g. Dr. Scholar Name"
                  className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Speaker Name (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.nameMl}
                    onChange={(e) => setForm({ ...form, nameMl: e.target.value })}
                    placeholder="മലയാളത്തിൽ പേര്"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Speaker Name (Arabic)
                  </label>
                  <input
                    type="text"
                    value={form.nameAr}
                    onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                    placeholder="الاسم بالعربية"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-arabic text-right text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Designation / Title (English)
                  </label>
                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                    placeholder="Professor, Department of History"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Designation / Title (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.titleMl}
                    onChange={(e) => setForm({ ...form, titleMl: e.target.value })}
                    placeholder="സ്ഥാനപ്പേര്"
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="space-y-2">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Speaker Portrait Photo
                </label>
                <div className="flex items-center gap-3">
                  {form.photoUrl ? (
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative border-2 border-brand-gold/40 shrink-0">
                      <Image
                        src={form.photoUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-brand-gold/30 flex items-center justify-center shrink-0 text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      placeholder="/images/speakers/dr-name.png or Supabase CDN URL"
                      className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-[11px] text-neutral-900 dark:text-white focus:outline-none"
                    />

                    <label
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-gold/40 bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold font-semibold text-xs cursor-pointer transition ${
                        isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {isUploadingPhoto ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Portrait (Supabase)</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={isUploadingPhoto}
                      />
                    </label>
                  </div>
                </div>
                {uploadError && (
                  <p className="text-[11px] text-rose-500 font-medium">{uploadError}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Biography (English)
                </label>
                <textarea
                  rows={2}
                  value={form.bioEn}
                  onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                  placeholder="Academic credentials, publications, institutional leadership..."
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 font-mono text-neutral-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
                    />
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Publish to Live Website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-gold/15">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="px-5 py-2 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingGuest ? 'Save Changes' : 'Create Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
