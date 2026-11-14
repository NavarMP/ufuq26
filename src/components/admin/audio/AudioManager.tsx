'use client';

import React, { useState, useRef } from 'react';
import {
  Music,
  Upload,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { AudioTrack } from '@/types';
import { uploadMediaToSupabase } from '@/lib/supabase';
import ConfirmDialog from '../shared/ConfirmDialog';

interface AudioManagerProps {
  audioTracks: AudioTrack[];
  addAudioTrack: (track: Omit<AudioTrack, 'id'>) => Promise<void>;
  updateAudioTrack: (id: string, track: Partial<AudioTrack>) => Promise<void>;
  deleteAudioTrack: (id: string) => Promise<void>;
  reorderAudioTracks: (tracks: AudioTrack[]) => Promise<void>;
}

export default function AudioManager({
  audioTracks,
  addAudioTrack,
  updateAudioTrack,
  deleteAudioTrack,
  reorderAudioTracks,
}: AudioManagerProps) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioArtist, setAudioArtist] = useState('');
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioIsDefault, setAudioIsDefault] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null);

  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleAudioFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 35 * 1024 * 1024) {
      alert('Audio file size exceeds 35MB limit.');
      return;
    }

    setAudioFile(file);
    setAudioUploadError(null);

    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setAudioTitle((prev) => prev.trim() || rawName);
    setAudioArtist((prev) => prev.trim() || 'UFUQ ’26');

    if (typeof window !== 'undefined') {
      const url = URL.createObjectURL(file);
      const audio = new window.Audio(url);
      audio.onloadedmetadata = () => {
        if (isFinite(audio.duration)) {
          setAudioDuration(Math.round(audio.duration));
        }
        URL.revokeObjectURL(url);
      };
    }
  };

  const handleUploadAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      alert('Please select an audio file to upload.');
      return;
    }

    setIsUploadingAudio(true);
    setAudioUploadError(null);

    try {
      const publicUrl = await uploadMediaToSupabase(audioFile, 'audio');
      await addAudioTrack({
        title: audioTitle.trim() || 'Background Audio Track',
        artist: audioArtist.trim() || 'UFUQ ’26',
        src: publicUrl,
        duration: audioDuration || 0,
        order: audioTracks.length + 1,
        enabled: true,
        isDefault: audioIsDefault || audioTracks.length === 0,
      });

      setAudioFile(null);
      setAudioTitle('');
      setAudioArtist('');
      setAudioDuration(0);
      setAudioIsDefault(false);
      alert('Audio track successfully uploaded and added to the playlist!');
    } catch (err: any) {
      console.error('Audio upload error:', err);
      const msg = err.message || 'Audio upload failed';
      setAudioUploadError(msg);
      alert(msg);
    } finally {
      setIsUploadingAudio(false);
    }
  };

  const toggleTrackPreview = (track: AudioTrack) => {
    if (!previewAudioRef.current) return;
    const audio = previewAudioRef.current;

    if (previewingTrackId === track.id) {
      audio.pause();
      setPreviewingTrackId(null);
    } else {
      audio.src = track.src;
      audio.play().catch(() => {});
      setPreviewingTrackId(track.id);
    }
  };

  const handleMoveTrack = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= audioTracks.length) return;

    const copy = [...audioTracks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    await reorderAudioTracks(copy);
  };

  const handleSetDefaultTrack = async (trackId: string) => {
    for (const t of audioTracks) {
      await updateAudioTrack(t.id, { isDefault: t.id === trackId });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hidden Audio Player for previewing */}
      <audio
        ref={previewAudioRef}
        onEnded={() => setPreviewingTrackId(null)}
        className="hidden"
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-clash text-lg font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
            <Music className="w-5 h-5 text-brand-gold" />
            <span>Background Music & Soundscapes ({audioTracks.length})</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Upload audio files (.mp3, .wav, .ogg, .m4a) to Supabase Storage CDN, arrange playback order, and set default launching soundscape.
          </p>
        </div>
        <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-brand-gold/15 text-brand-gold border border-brand-gold/30 shrink-0">
          Supabase CDN: ufuq-media/audio
        </div>
      </div>

      {/* Upload New Track Form */}
      <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-4">
        <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-gold" />
          <span>Upload Audio Track</span>
        </h4>

        <form onSubmit={handleUploadAudio} className="space-y-4 text-xs">
          {/* Dropzone */}
          <div className="p-6 rounded-2xl border-2 border-dashed border-brand-gold/30 bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-gold/60 transition-colors">
            <label className="cursor-pointer flex flex-col items-center w-full">
              <Upload className="w-8 h-8 text-brand-gold mb-2" />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {audioFile ? audioFile.name : 'Choose or drag & drop audio track (.mp3, .wav, .ogg, .m4a)'}
              </span>
              <span className="text-[11px] text-neutral-400 mt-1">
                {audioFile
                  ? `${(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Detected Duration: ${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, '0')}`
                  : 'Max file size 35MB. Direct upload to high-speed Supabase CDN.'}
              </span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                onChange={handleAudioFileSelect}
                className="hidden"
                disabled={isUploadingAudio}
              />
            </label>
          </div>

          {audioUploadError && (
            <p className="text-xs text-rose-500 font-medium">{audioUploadError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Track Title *
              </label>
              <input
                type="text"
                required
                value={audioTitle}
                onChange={(e) => setAudioTitle(e.target.value)}
                placeholder="e.g. UFUQ ’26 — Ambient Theme"
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Artist / Source
              </label>
              <input
                type="text"
                value={audioArtist}
                onChange={(e) => setAudioArtist(e.target.value)}
                placeholder="e.g. Alathurpadi Dars / ADSA"
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-gold/20 text-neutral-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-700 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={audioIsDefault}
                onChange={(e) => setAudioIsDefault(e.target.checked)}
                className="rounded border-brand-gold text-brand-gold focus:ring-brand-gold"
              />
              <span className="font-semibold">Set as Default Starting Track on Launch</span>
            </label>

            <button
              type="submit"
              disabled={!audioFile || isUploadingAudio}
              className="px-5 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isUploadingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to CDN...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Add to Playlist</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Playlist Table */}
      <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-[#141c2c]/70 border border-brand-gold/20 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-clash font-bold text-sm text-neutral-900 dark:text-white">
            Current Playlist ({audioTracks.length})
          </h4>
          <span className="text-[11px] font-mono text-neutral-400">
            Use arrows to reorder • Auto-plays next track
          </span>
        </div>

        {audioTracks.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-xs">
            No audio tracks configured. Choose an audio file above to upload to CDN.
          </div>
        ) : (
          <div className="divide-y divide-brand-gold/15">
            {audioTracks.map((track, idx) => {
              const isPreviewing = previewingTrackId === track.id;
              const mins = Math.floor((track.duration || 0) / 60);
              const secs = ((track.duration || 0) % 60).toString().padStart(2, '0');

              return (
                <div
                  key={track.id || idx}
                  className={`py-3.5 flex items-center justify-between gap-3 text-xs transition-opacity ${
                    !track.enabled ? 'opacity-40' : ''
                  }`}
                >
                  {/* Order Buttons & Play Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveTrack(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-neutral-400 hover:text-brand-gold disabled:opacity-20"
                        title="Move Up"
                        aria-label="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTrack(idx, 'down')}
                        disabled={idx === audioTracks.length - 1}
                        className="p-1 rounded text-neutral-400 hover:text-brand-gold disabled:opacity-20"
                        title="Move Down"
                        aria-label="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTrackPreview(track)}
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
                        isPreviewing
                          ? 'bg-brand-gold text-brand-navy shadow-md scale-105'
                          : 'glass-panel bg-black/5 dark:bg-white/10 hover:bg-brand-gold/20 text-neutral-700 dark:text-neutral-200'
                      }`}
                      title={isPreviewing ? 'Pause Preview' : 'Play Preview'}
                    >
                      {isPreviewing ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-neutral-900 dark:text-white truncate">
                        {track.title}
                      </h5>
                      {track.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-brand-gold text-brand-navy font-bold flex items-center gap-1 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-current" /> Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500 font-mono">
                      <span>{track.artist || 'ADSA Soundscape'}</span>
                      <span>•</span>
                      <span>
                        {mins}:{secs}
                      </span>
                      <span>•</span>
                      <a
                        href={track.src}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-gold hover:underline flex items-center gap-0.5"
                      >
                        <span>CDN Source</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!track.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultTrack(track.id)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-semibold text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title="Set as Default Launch Track"
                      >
                        Make Default
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => updateAudioTrack(track.id, { enabled: !track.enabled })}
                      className={`p-1.5 rounded-xl transition-colors ${
                        track.enabled
                          ? 'text-emerald-500 hover:bg-emerald-500/10'
                          : 'text-neutral-400 hover:bg-neutral-500/10'
                      }`}
                      title={track.enabled ? 'Enabled in public playlist' : 'Disabled (hidden)'}
                    >
                      {track.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDialog({
                          isOpen: true,
                          title: 'Delete Audio Track',
                          description: `Are you sure you want to delete "${track.title}" from the playlist?`,
                          onConfirm: async () => {
                            if (previewingTrackId === track.id && previewAudioRef.current) {
                              previewAudioRef.current.pause();
                              setPreviewingTrackId(null);
                            }
                            await deleteAudioTrack(track.id);
                            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
