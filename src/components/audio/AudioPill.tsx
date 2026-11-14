'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAudio } from '@/context/AudioContext';
import { useApp } from '@/context/AppContext';
import MiniSpectrumBars from './MiniSpectrumBars';
import AudioSpectrumCanvas from './AudioSpectrumCanvas';
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  Music,
  X,
  Sparkles,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Repeat,
  Repeat1,
  ListMusic,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AudioPillProps {
  compact?: boolean;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AudioPill({ compact = false }: AudioPillProps) {
  const {
    isPlaying,
    volume,
    isMuted,
    isAutoplayBlocked,
    tracks,
    currentTrackIndex,
    currentTrack,
    selectTrack,
    nextTrack,
    prevTrack,
    skipTime,
    currentTime,
    duration,
    seek,
    repeatMode,
    toggleRepeat,
    togglePlay,
    play,
    setVolume,
    toggleMute,
  } = useAudio();
  const { t, isRtl } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAutoplayBlocked) {
      play();
    } else {
      togglePlay();
    }
  };

  const volumePercent = isMuted ? 0 : Math.round(volume * 100);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* NAVIGATION PILL */}
      <div
        className={`flex items-center rounded-full transition-all duration-300 border ${
          isPlaying
            ? 'bg-brand-gold/15 border-brand-gold/40 shadow-[0_0_15px_rgba(201,164,92,0.2)]'
            : isAutoplayBlocked
            ? 'bg-brand-gold/10 border-brand-gold/30 animate-pulse'
            : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-brand-gold/25'
        }`}
      >
        {/* Quick Play/Pause Action */}
        <button
          onClick={handlePlayToggle}
          className="p-2 text-neutral-700 dark:text-neutral-200 hover:text-brand-gold dark:hover:text-brand-gold focus:outline-none transition-colors"
          aria-label={
            isPlaying
              ? t('audio.pause') || 'Pause background music'
              : t('audio.play') || 'Play background music'
          }
          title={
            isPlaying
              ? t('audio.pause') || 'Pause background music'
              : t('audio.play') || 'Play background music'
          }
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
        </button>

        {/* Spectrum & Popover Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 pr-2.5 pl-0.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:text-brand-gold transition-colors focus:outline-none"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={t('audio.title') || 'Background music controls'}
          title={
            currentTrack
              ? `${currentTrack.title} — ${formatTime(currentTime)} / ${formatTime(duration)}`
              : t('audio.title') || 'Background music controls'
          }
        >
          <MiniSpectrumBars barCount={4} />
          {!compact && (
            <span className="hidden xl:inline text-[11px] font-medium font-mono text-neutral-600 dark:text-neutral-400 max-w-[120px] truncate">
              {currentTrack?.title || `${volumePercent}%`}
            </span>
          )}
        </button>
      </div>

      {/* AUTOPLAY HINT BADGE */}
      {isAutoplayBlocked && !isPlaying && !isOpen && (
        <button
          onClick={handlePlayToggle}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] bg-brand-gold text-brand-navy font-semibold shadow-md border border-brand-gold-light/40 flex items-center gap-1 animate-bounce z-50"
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>{t('audio.autoplayHint') || 'Tap to play music'}</span>
        </button>
      )}

      {/* EXPANDABLE AUDIO CONTROLLER POPOVER */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Audio Controls, Spectrum & Playlist"
          className={`absolute top-full mt-2.5 ${
            isRtl ? 'left-0' : 'right-0'
          } w-[340px] max-w-[92vw] p-4 rounded-3xl glass-panel shadow-2xl border border-brand-gold/30 z-50 text-neutral-800 dark:text-neutral-100 animate-scale-in`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-brand-gold/15">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold font-clash leading-tight truncate">
                  {currentTrack ? currentTrack.title : t('audio.title') || 'Ambient Soundscape'}
                </h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono truncate">
                  {currentTrack?.artist || 'UFUQ ’26 Theme'} • Track {tracks.length > 0 ? currentTrackIndex + 1 : 0} of {tracks.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  showPlaylist
                    ? 'bg-brand-gold text-brand-navy font-bold'
                    : 'text-neutral-500 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title="Toggle Playlist"
                aria-label="Toggle Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Close audio controls"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Spectrum Canvas */}
          <div className="mb-3 p-2 rounded-xl bg-black/10 dark:bg-black/30 border border-brand-gold/15 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-1 px-1">
              <span className="text-[9px] uppercase tracking-wider font-mono text-brand-gold">
                {isPlaying && !isMuted ? 'LIVE SPECTRUM' : 'RESTING STATE'}
              </span>
              <span className="text-[9px] font-mono text-neutral-400">FFT 64</span>
            </div>
            <AudioSpectrumCanvas width={290} height={46} />
          </div>

          {/* SEEKABLE PROGRESS BAR */}
          <div className="mb-3 px-1 space-y-1">
            <div className="relative flex items-center group">
              <input
                type="range"
                min="0"
                max={duration > 0 ? duration : 100}
                step="0.5"
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
                aria-label="Audio scrubber"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* ADVANCED PLAYBACK CONTROLS */}
          <div className="flex items-center justify-between py-1 mb-3">
            {/* Repeat Mode */}
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-xl text-neutral-500 hover:text-brand-gold transition-colors ${
                repeatMode === 'one'
                  ? 'text-brand-gold bg-brand-gold/15'
                  : repeatMode === 'all'
                  ? 'text-brand-gold'
                  : 'text-neutral-400 opacity-60'
              }`}
              title={`Repeat: ${repeatMode === 'one' ? 'Repeat Current' : repeatMode === 'all' ? 'Loop All' : 'Off'}`}
              aria-label="Toggle repeat mode"
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>

            {/* Jump to Previous */}
            <button
              onClick={prevTrack}
              disabled={tracks.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
              title="Previous Track (Double-click or <3s)"
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Rewind 10 seconds"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Main Hero Play/Pause Button */}
            <button
              onClick={handlePlayToggle}
              className="w-11 h-11 rounded-2xl bg-brand-gold hover:bg-brand-gold-hover text-brand-navy shadow-lg shadow-brand-gold/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Forward 10 seconds"
              aria-label="Forward 10 seconds"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Jump to Next */}
            <button
              onClick={nextTrack}
              disabled={tracks.length === 0}
              className="p-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
              title="Next Track"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Playlist Drawer Toggle */}
            <button
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 rounded-xl text-neutral-500 hover:text-brand-gold transition-colors ${
                showPlaylist ? 'text-brand-gold bg-brand-gold/15' : ''
              }`}
              title="View Playlist"
              aria-label="View Playlist"
            >
              {showPlaylist ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* INLINE PLAYLIST DRAWER */}
          {showPlaylist && (
            <div className="mb-3 max-h-40 overflow-y-auto rounded-xl bg-black/5 dark:bg-black/30 border border-brand-gold/15 p-1.5 space-y-1 text-xs no-scrollbar animate-fade-in">
              <div className="px-2 py-1 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase">
                <span>Playlist ({tracks.length})</span>
                <span>Auto-advance: Next</span>
              </div>
              {tracks.length === 0 ? (
                <div className="p-3 text-center text-neutral-400 text-xs">
                  No tracks available.
                </div>
              ) : (
                tracks.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex;
                  return (
                    <button
                      key={track.id || idx}
                      onClick={() => selectTrack(idx)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-brand-gold/20 text-brand-gold font-bold border border-brand-gold/30'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-4 font-mono text-[10px] text-neutral-400 text-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs truncate">{track.title}</p>
                          {track.artist && (
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                              {track.artist}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isCurrent && isPlaying && !isMuted ? (
                          <MiniSpectrumBars barCount={3} />
                        ) : (
                          <span className="font-mono text-[10px] text-neutral-400">
                            {formatTime(track.duration || 0)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* VOLUME SLIDER */}
          <div className="flex items-center gap-2.5 pt-1 border-t border-brand-gold/15">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-brand-gold hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-brand-gold" />
              ) : (
                <Volume2 className="w-4 h-4 text-brand-gold" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-brand-gold focus:outline-none"
              aria-label={t('audio.volume') || 'Volume slider'}
            />

            <span className="w-8 text-right font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
              {volumePercent}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
