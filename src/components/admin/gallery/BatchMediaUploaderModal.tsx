'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GalleryCategory, GalleryItem } from '@/types/gallery';
import { uploadMediaToSupabase } from '@/lib/supabase';

interface BatchMediaUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalExistingCount: number;
  onBatchCreated: (items: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
}

interface QueuedFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  uploadedUrl?: string;
}

export default function BatchMediaUploaderModal({
  isOpen,
  onClose,
  totalExistingCount,
  onBatchCreated,
}: BatchMediaUploaderModalProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [defaultCategory, setDefaultCategory] = useState<GalleryCategory>('camp_moments');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;
    const newItems: QueuedFile[] = Array.from(files).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: 'pending',
      progress: 0,
    }));
    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFilesSelect(e.dataTransfer.files);
  };

  const removeQueuedFile = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const startBatchUpload = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);

    const createdItems: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [];

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === 'completed') continue;

      // Mark as uploading
      setQueue((prev) =>
        prev.map((q, idx) => (idx === i ? { ...q, status: 'uploading' } : q))
      );

      try {
        const publicUrl = await uploadMediaToSupabase(item.file, 'gallery');

        // Clean filename for friendly title
        const cleanName = item.file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        createdItems.push({
          title: {
            en: cleanName,
          },
          caption: {
            en: `Visual moment from UFUQ '26 — ${cleanName}`,
          },
          category: defaultCategory,
          mediaType: item.file.type.startsWith('video/') ? 'video' : 'image',
          aspectRatio: 'landscape',
          url: publicUrl,
          thumbnailUrl: publicUrl,
          date: '2026-12-24',
          hijriDate: '14 Rajab 1448 AH',
          location: {
            en: 'Alathurpadi Dars Campus',
            ml: 'അലത്തൂർപടി ദർസ് കാമ്പസ്',
            ar: 'حرم دار ألاذوربادي',
          },
          photographer: 'ADSA Media Wing',
          tags: ['Camp', 'UFUQ26', 'Moments'],
          featured: false,
          heroSpotlight: false,
          downloadAllowed: true,
          published: true,
          order: totalExistingCount + createdItems.length + 1,
        });

        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: 'completed', uploadedUrl: publicUrl, progress: 100 } : q
          )
        );
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: 'error', error: err.message || 'Upload failed' } : q
          )
        );
      }
    }

    if (createdItems.length > 0) {
      await onBatchCreated(createdItems);
    }

    setIsProcessing(false);
  };

  if (!isOpen) return null;

  const completedCount = queue.filter((q) => q.status === 'completed').length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl my-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl bg-brand-navy-dark/95 text-neutral-100 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold border border-brand-gold/40">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-clash text-lg font-bold text-white">Batch Media Uploader</h3>
                <p className="text-xs text-neutral-400">
                  Upload multiple photos & videos directly to Supabase Storage
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

          <div className="p-6 space-y-5">
            {/* Target Category Selector */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div>
                <span className="text-xs font-semibold text-neutral-200 block">
                  Assign Default Pillar Category
                </span>
                <span className="text-[11px] text-neutral-400">
                  Applied to all files in this batch (can be modified later)
                </span>
              </div>
              <select
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value as GalleryCategory)}
                className="px-3 py-1.5 rounded-xl bg-brand-navy border border-brand-gold/40 text-xs text-white focus:outline-none focus:border-brand-gold"
              >
                <option value="camp_moments">Camp UFUQ ’26</option>
                <option value="dars_heritage">Alathurpadi Dars Heritage</option>
                <option value="ustad_scholars">The Respected Ustads</option>
                <option value="adsa_initiatives">ADSA & Alumni Council</option>
                <option value="suffa_fraternity">39+ SUFFA Dars Network</option>
                <option value="suhba_life">The Philosophy of SUHBA</option>
                <option value="digital_craft">Digital Craft & Innovation</option>
              </select>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative p-8 rounded-2xl border-2 border-dashed border-brand-gold/40 hover:border-brand-gold bg-black/30 hover:bg-black/40 transition-all flex flex-col items-center justify-center cursor-pointer group text-center"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/mp4"
                onChange={(e) => handleFilesSelect(e.target.files)}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 flex items-center justify-center text-brand-gold mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-white">
                Drag and drop multiple media files here
              </span>
              <span className="text-xs text-neutral-400 mt-1">
                or click to browse from device (JPEG, PNG, WebP, MP4)
              </span>
            </div>

            {/* Queue List */}
            {queue.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span>Queued Media ({queue.length} files)</span>
                  <span>{completedCount} of {queue.length} uploaded</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {queue.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.previewUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-white font-medium truncate block max-w-[280px]">
                            {item.file.name}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {(item.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'uploading' && (
                          <span className="flex items-center gap-1 text-[11px] text-brand-gold">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </span>
                        )}
                        {item.status === 'completed' && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Ready
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-400" title={item.error}>
                            <AlertCircle className="w-4 h-4" /> Failed
                          </span>
                        )}
                        {item.status === 'pending' && !isProcessing && (
                          <button
                            onClick={() => removeQueuedFile(item.id)}
                            className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-white/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setQueue([])}
                disabled={isProcessing || queue.length === 0}
                className="text-xs text-neutral-400 hover:text-neutral-200 disabled:opacity-30"
              >
                Clear Queue
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={startBatchUpload}
                  disabled={isProcessing || queue.length === 0 || completedCount === queue.length}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-brand-gold text-brand-navy font-semibold text-xs hover:bg-brand-gold-hover transition-all duration-200 disabled:opacity-50 shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Files...</span>
                    </>
                  ) : (
                    <span>Upload & Create ({queue.length - completedCount}) Artifacts</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
