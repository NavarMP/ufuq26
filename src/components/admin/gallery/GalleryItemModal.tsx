'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Tag,
  Camera,
  Star,
  Eye,
  Sparkles,
  Download,
  Film,
} from 'lucide-react';
import Image from 'next/image';
import { GalleryItem, GalleryCategory, GalleryMediaType, GalleryAspectRatio } from '@/types/gallery';
import { uploadMediaToSupabase } from '@/lib/supabase';

interface GalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: GalleryItem | null;
  totalCount: number;
  onSave: (item: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

export default function GalleryItemModal({
  isOpen,
  onClose,
  editingItem,
  totalCount,
  onSave,
}: GalleryItemModalProps) {
  const [form, setForm] = useState({
    titleEn: '',
    titleMl: '',
    titleAr: '',
    captionEn: '',
    captionMl: '',
    captionAr: '',
    descriptionEn: '',
    mediaType: 'image' as GalleryMediaType,
    aspectRatio: 'landscape' as GalleryAspectRatio,
    category: 'camp_moments' as GalleryCategory,
    url: '',
    thumbnailUrl: '',
    date: '2026-12-24',
    hijriDate: '14 Rajab 1448 AH',
    locationEn: 'Alathurpadi Dars Campus',
    locationMl: 'അലത്തൂർപടി ദർസ് കാമ്പസ്',
    locationAr: 'حرم دار ألاذوربادي',
    photographer: 'ADSA Media Wing',
    tags: 'Camp, UFUQ26, Scholars',
    storyGroup: '',
    featured: true,
    heroSpotlight: false,
    downloadAllowed: true,
    published: true,
    order: 1,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        titleEn: editingItem.title?.en || '',
        titleMl: editingItem.title?.ml || '',
        titleAr: editingItem.title?.ar || '',
        captionEn: editingItem.caption?.en || '',
        captionMl: editingItem.caption?.ml || '',
        captionAr: editingItem.caption?.ar || '',
        descriptionEn: editingItem.description?.en || '',
        mediaType: editingItem.mediaType || 'image',
        aspectRatio: editingItem.aspectRatio || 'landscape',
        category: editingItem.category || 'camp_moments',
        url: editingItem.url || '',
        thumbnailUrl: editingItem.thumbnailUrl || '',
        date: editingItem.date || '2026-12-24',
        hijriDate: editingItem.hijriDate || '',
        locationEn: editingItem.location?.en || '',
        locationMl: editingItem.location?.ml || '',
        locationAr: editingItem.location?.ar || '',
        photographer: editingItem.photographer || '',
        tags: (editingItem.tags || []).join(', '),
        storyGroup: editingItem.storyGroup || '',
        featured: editingItem.featured ?? false,
        heroSpotlight: editingItem.heroSpotlight ?? false,
        downloadAllowed: editingItem.downloadAllowed ?? true,
        published: editingItem.published ?? true,
        order: editingItem.order ?? 1,
      });
    } else {
      setForm({
        titleEn: '',
        titleMl: '',
        titleAr: '',
        captionEn: '',
        captionMl: '',
        captionAr: '',
        descriptionEn: '',
        mediaType: 'image',
        aspectRatio: 'landscape',
        category: 'camp_moments',
        url: '',
        thumbnailUrl: '',
        date: '2026-12-24',
        hijriDate: '14 Rajab 1448 AH',
        locationEn: 'Alathurpadi Dars Campus',
        locationMl: 'അലത്തൂർപടി ദർസ് കാമ്പസ്',
        locationAr: 'حرم دار ألاذوربادي',
        photographer: 'ADSA Media Wing',
        tags: 'Camp, UFUQ26, Scholars',
        storyGroup: '',
        featured: true,
        heroSpotlight: false,
        downloadAllowed: true,
        published: true,
        order: totalCount + 1,
      });
    }
    setUploadError(null);
  }, [editingItem, totalCount, isOpen]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const publicUrl = await uploadMediaToSupabase(file, 'gallery');
      setForm((prev) => ({
        ...prev,
        url: publicUrl,
        thumbnailUrl: publicUrl,
        // Auto-detect media type
        mediaType: file.type.startsWith('video/') ? 'video' : 'image',
      }));
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Ensure Supabase credentials are configured.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url.trim()) {
      setUploadError('Please provide a Media URL or upload a file.');
      return;
    }
    if (!form.titleEn.trim()) {
      setUploadError('Please enter at least an English title.');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      const parsedTags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        title: {
          en: form.titleEn.trim(),
          ml: form.titleMl.trim() || undefined,
          ar: form.titleAr.trim() || undefined,
        },
        caption: form.captionEn.trim()
          ? {
              en: form.captionEn.trim(),
              ml: form.captionMl.trim() || undefined,
              ar: form.captionAr.trim() || undefined,
            }
          : undefined,
        description: form.descriptionEn.trim()
          ? {
              en: form.descriptionEn.trim(),
            }
          : undefined,
        mediaType: form.mediaType,
        aspectRatio: form.aspectRatio,
        category: form.category,
        url: form.url.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || form.url.trim(),
        date: form.date.trim() || undefined,
        hijriDate: form.hijriDate.trim() || undefined,
        location: form.locationEn.trim()
          ? {
              en: form.locationEn.trim(),
              ml: form.locationMl.trim() || undefined,
              ar: form.locationAr.trim() || undefined,
            }
          : undefined,
        photographer: form.photographer.trim() || undefined,
        tags: parsedTags,
        storyGroup: form.storyGroup.trim() || undefined,
        featured: form.featured,
        heroSpotlight: form.heroSpotlight,
        downloadAllowed: form.downloadAllowed,
        published: form.published,
        order: Number(form.order) || 1,
      });
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Failed to save gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl my-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl bg-brand-navy-dark/95 text-neutral-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/40">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-clash text-lg font-bold text-white">
                  {editingItem ? 'Edit Gallery Artifact' : 'Add New Gallery Artifact'}
                </h3>
                <p className="text-xs text-neutral-400">
                  Curate imagery, video reels, and historical moments across the 7 Horizon pillars
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {uploadError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {uploadError}
              </div>
            )}

            {/* Media Upload & Preview Section */}
            <div className="grid sm:grid-cols-12 gap-5 items-start">
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-brand-gold/40 bg-black/40 group flex flex-col items-center justify-center">
                  {form.url ? (
                    form.mediaType === 'video' ? (
                      <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                        <Film className="w-10 h-10 text-brand-gold" />
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-0.5 rounded text-white">
                          Video Asset Linked
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={form.url}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="flex flex-col items-center text-center p-4">
                      <Upload className="w-8 h-8 text-brand-gold/70 mb-2" />
                      <span className="text-xs font-medium text-neutral-300">Upload Media</span>
                      <span className="text-[10px] text-neutral-500 mt-1">JPEG, PNG, WebP, MP4</span>
                    </div>
                  )}

                  {/* Upload overlay */}
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 text-brand-gold animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-white mb-1" />
                        <span className="text-xs text-white font-medium">Change File</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/mp4"
                      onChange={handleMediaUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="mt-2 w-full">
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Or Direct Public URL
                  </label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                    placeholder="https://... or /images/..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Core Attributes */}
              <div className="sm:col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Pillar Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      <option value="camp_moments" className="bg-brand-navy">Camp UFUQ ’26</option>
                      <option value="dars_heritage" className="bg-brand-navy">Alathurpadi Dars Heritage</option>
                      <option value="ustad_scholars" className="bg-brand-navy">The Respected Ustads</option>
                      <option value="adsa_initiatives" className="bg-brand-navy">ADSA & Alumni Council</option>
                      <option value="suffa_fraternity" className="bg-brand-navy">39+ SUFFA Dars Network</option>
                      <option value="suhba_life" className="bg-brand-navy">The Philosophy of SUHBA</option>
                      <option value="digital_craft" className="bg-brand-navy">Digital Craft & Innovation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Aspect Ratio
                    </label>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) => setForm({ ...form, aspectRatio: e.target.value as GalleryAspectRatio })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      <option value="landscape" className="bg-brand-navy">Landscape (16:9 / 4:3)</option>
                      <option value="portrait" className="bg-brand-navy">Portrait (4:5 / 9:16)</option>
                      <option value="square" className="bg-brand-navy">Square (1:1)</option>
                      <option value="ultrawide" className="bg-brand-navy">Ultrawide (21:9)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Media Type
                    </label>
                    <select
                      value={form.mediaType}
                      onChange={(e) => setForm({ ...form, mediaType: e.target.value as GalleryMediaType })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                    >
                      <option value="image" className="bg-brand-navy">Photograph</option>
                      <option value="video" className="bg-brand-navy">Video / Reel</option>
                      <option value="audio_visual" className="bg-brand-navy">Audio-Visual Story</option>
                      <option value="document" className="bg-brand-navy">Historical Document</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={form.order}
                      onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Story Group Reel Key (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.storyGroup}
                    onChange={(e) => setForm({ ...form, storyGroup: e.target.value })}
                    placeholder="e.g. heritage_circle, usthad_moments"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Items with matching story keys group into tap-through Stories of Horizon
                  </span>
                </div>
              </div>
            </div>

            {/* Trilingual Titles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
                Trilingual Titling
              </span>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.titleEn}
                    onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                    placeholder="The Horizon Gathering"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Title (Malayalam)
                  </label>
                  <input
                    type="text"
                    value={form.titleMl}
                    onChange={(e) => setForm({ ...form, titleMl: e.target.value })}
                    placeholder="ദർസ് സംഗമം"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold font-sans"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Title (Arabic)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.titleAr}
                    onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                    placeholder="مجلس الأفق المبارك"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold font-arabic"
                  />
                </div>
              </div>
            </div>

            {/* Trilingual Captions */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
                Captions & Descriptions
              </span>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Caption (English)
                  </label>
                  <textarea
                    rows={2}
                    value={form.captionEn}
                    onChange={(e) => setForm({ ...form, captionEn: e.target.value })}
                    placeholder="Brief description of the moment..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Caption (Malayalam)
                  </label>
                  <textarea
                    rows={2}
                    value={form.captionMl}
                    onChange={(e) => setForm({ ...form, captionMl: e.target.value })}
                    placeholder="ചിത്രവിവരണം..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold resize-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                    Caption (Arabic)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={form.captionAr}
                    onChange={(e) => setForm({ ...form, captionAr: e.target.value })}
                    placeholder="وصف مختصر للحدث..."
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold resize-none font-arabic"
                  />
                </div>
              </div>
            </div>

            {/* Context & Metadata (Dates, Location, Photographer, Tags) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/10">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3 text-brand-gold" /> Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-brand-gold" /> Hijri Date
                </label>
                <input
                  type="text"
                  value={form.hijriDate}
                  onChange={(e) => setForm({ ...form, hijriDate: e.target.value })}
                  placeholder="14 Rajab 1448 AH"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-brand-gold" /> Location
                </label>
                <input
                  type="text"
                  value={form.locationEn}
                  onChange={(e) => setForm({ ...form, locationEn: e.target.value })}
                  placeholder="Melmuri, Malappuram"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                  <Camera className="w-3 h-3 text-brand-gold" /> Photographer
                </label>
                <input
                  type="text"
                  value={form.photographer}
                  onChange={(e) => setForm({ ...form, photographer: e.target.value })}
                  placeholder="ADSA Media"
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1 mb-1">
                <Tag className="w-3 h-3 text-brand-gold" /> Tags (Comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="Camp, Halaqah, Usthad, Night, Dars"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            {/* Feature Flags & Toggles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
                <span className="text-xs font-medium text-neutral-200">Published</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
                <span className="text-xs font-medium text-neutral-200 flex items-center gap-1">
                  <Star className="w-3 h-3 text-brand-gold fill-brand-gold/40" /> Home Bento
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.heroSpotlight}
                  onChange={(e) => setForm({ ...form, heroSpotlight: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
                <span className="text-xs font-medium text-neutral-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Hero Spotlight
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={form.downloadAllowed}
                  onChange={(e) => setForm({ ...form, downloadAllowed: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold"
                />
                <span className="text-xs font-medium text-neutral-200 flex items-center gap-1">
                  <Download className="w-3 h-3 text-emerald-400" /> Downloadable
                </span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-gold text-brand-navy font-semibold text-xs hover:bg-brand-gold-hover transition-all duration-200 disabled:opacity-50 shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Artifact...</span>
                  </>
                ) : (
                  <span>{editingItem ? 'Update Artifact' : 'Save & Publish Artifact'}</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
