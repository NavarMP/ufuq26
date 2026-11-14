'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useEvent } from './EventContext';
import { AudioTrack } from '@/types';

interface AudioContextType {
  // Playback state
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  isAutoplayBlocked: boolean;
  hasInteracted: boolean;

  // Track management
  tracks: AudioTrack[];
  currentTrackIndex: number;
  currentTrack: AudioTrack | null;
  selectTrack: (index: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  skipTime: (deltaSeconds: number) => void;

  // Progress & Seeking
  currentTime: number;
  duration: number;
  seek: (seconds: number) => void;

  // Repeat & Mode
  repeatMode: 'all' | 'one' | 'none';
  toggleRepeat: () => void;

  // Actions
  togglePlay: () => void;
  play: () => Promise<void>;
  pause: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  getFrequencyData: (dataArray: Uint8Array) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const { audioTracks } = useEvent();

  // Filter only enabled tracks
  const activeTracks = useMemo(() => {
    return (audioTracks || []).filter((t) => t.enabled !== false);
  }, [audioTracks]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4); // 40% default ambient volume
  const [isMuted, setIsMuted] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Active track index (default to track marked isDefault or index 0)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const defaultIdx = activeTracks.findIndex((t) => t.isDefault);
    return defaultIdx >= 0 ? defaultIdx : 0;
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'all' | 'one' | 'none'>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Keep ref to current active track
  const currentTrack = activeTracks[currentTrackIndex] || null;
  const currentTrackRef = useRef<AudioTrack | null>(currentTrack);
  currentTrackRef.current = currentTrack;

  // Initialize Web Audio graph (Only runs once per audio element)
  const initAudioGraph = useCallback(() => {
    if (typeof window === 'undefined' || !audioRef.current) return null;

    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;
      audioCtxRef.current = new AudioCtxClass();
    }
    const ctx = audioCtxRef.current;

    // Create GainNode if not exists
    if (!gainNodeRef.current) {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;
    }

    // Create AnalyserNode if not exists
    if (!analyserNodeRef.current) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // 32 frequency bins
      analyser.smoothingTimeConstant = 0.82;
      analyser.connect(gainNodeRef.current);
      analyserNodeRef.current = analyser;
    }

    // Connect HTMLAudioElement once
    if (!sourceNodeRef.current && audioRef.current) {
      try {
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyserNodeRef.current);
        sourceNodeRef.current = source;
      } catch (err) {
        console.warn('Audio node connection error (safely handled):', err);
      }
    }

    return ctx;
  }, []);

  // Smooth gain ramping helper
  const rampGain = useCallback((target: number, rampDuration: number = 1.0) => {
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;
    if (!ctx || !gain) return;

    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);

    if (target <= 0.001) {
      gain.gain.setValueAtTime(Math.max(0.001, gain.gain.value), now);
      gain.gain.linearRampToValueAtTime(0, now + Math.min(rampDuration, 0.25));
    } else {
      const currentVal = Math.max(0.001, gain.gain.value);
      gain.gain.setValueAtTime(currentVal, now);
      gain.gain.exponentialRampToValueAtTime(target, now + rampDuration);
    }
  }, []);

  // Play audio
  const play = useCallback(async () => {
    if (!currentTrackRef.current) return;
    const ctx = initAudioGraph();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn('Failed to resume AudioContext:', e);
      }
    }

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
        setHasInteracted(true);
        if (!isMuted) {
          rampGain(volume, 1.0);
        }
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ufuq_bg_music_user_paused');
        }
      } catch (err) {
        console.warn('Playback request error:', err);
      }
    }
  }, [initAudioGraph, isMuted, rampGain, volume]);

  // Pause audio
  const pause = useCallback(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      rampGain(0, 0.25);
    }
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ufuq_bg_music_user_paused', 'true');
      }
    }, 250);
  }, [rampGain]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Switch to a specific track index
  const selectTrack = useCallback(
    (index: number) => {
      if (index < 0 || index >= activeTracks.length) return;
      const targetTrack = activeTracks[index];
      if (!targetTrack || !audioRef.current) return;

      const wasPlaying = isPlaying;
      setCurrentTrackIndex(index);
      setCurrentTime(0);

      const audio = audioRef.current;
      if (wasPlaying && gainNodeRef.current && audioCtxRef.current) {
        rampGain(0, 0.2);
        setTimeout(async () => {
          audio.src = targetTrack.src;
          audio.load();
          try {
            await audio.play();
            setIsPlaying(true);
            rampGain(volume, 0.8);
          } catch (e) {
            console.warn('Failed to auto-play after track switch:', e);
          }
        }, 220);
      } else {
        audio.src = targetTrack.src;
        audio.load();
      }
    },
    [activeTracks, isPlaying, rampGain, volume]
  );

  // Jump to Next Track
  const nextTrack = useCallback(() => {
    if (activeTracks.length === 0) return;
    const nextIdx = (currentTrackIndex + 1) % activeTracks.length;
    selectTrack(nextIdx);
  }, [activeTracks.length, currentTrackIndex, selectTrack]);

  // Jump to Previous Track
  const prevTrack = useCallback(() => {
    if (activeTracks.length === 0) return;
    // If currentTime > 3s, restart current track from beginning
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prevIdx = (currentTrackIndex - 1 + activeTracks.length) % activeTracks.length;
    selectTrack(prevIdx);
  }, [activeTracks.length, currentTrackIndex, selectTrack]);

  // Skip time forward or backward by seconds (e.g. +10s / -10s)
  const skipTime = useCallback(
    (deltaSeconds: number) => {
      if (!audioRef.current) return;
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + deltaSeconds, duration || 0));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  // Seek to specific timestamp
  const seek = useCallback(
    (seconds: number) => {
      if (!audioRef.current || !isFinite(seconds)) return;
      const clamped = Math.max(0, Math.min(seconds, duration || 0));
      audioRef.current.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [duration]
  );

  // Toggle repeat mode: all -> one -> none -> all
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => (prev === 'all' ? 'one' : prev === 'one' ? 'none' : 'all'));
  }, []);

  // Set volume
  const setVolume = useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(1, val));
      setVolumeState(clamped);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ufuq_bg_music_volume', String(clamped));
      }
      if (isMuted) {
        setIsMuted(false);
      }
      if (isPlaying && gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.setValueAtTime(clamped, audioCtxRef.current.currentTime);
      }
    },
    [isMuted, isPlaying]
  );

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!gainNodeRef.current || !audioCtxRef.current) return;
    if (isMuted) {
      setIsMuted(false);
      rampGain(volume, 0.3);
    } else {
      setIsMuted(true);
      rampGain(0, 0.3);
    }
  }, [isMuted, rampGain, volume]);

  // Frequency data query for spectrum visualizer
  const getFrequencyData = useCallback(
    (dataArray: Uint8Array) => {
      if (analyserNodeRef.current && isPlaying && !isMuted) {
        analyserNodeRef.current.getByteFrequencyData(dataArray as any);
      } else {
        dataArray.fill(0);
      }
    },
    [isMuted, isPlaying]
  );

  // Attach audio element event listeners (timeupdate, duration, ended)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else if (currentTrackRef.current?.duration) {
        setDuration(currentTrackRef.current.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (repeatMode === 'all') {
        nextTrack();
      } else {
        // 'none'
        if (currentTrackIndex < activeTracks.length - 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeTracks.length, currentTrackIndex, nextTrack, repeatMode]);

  // Initialize from localStorage and handle Autoplay on Launch
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load saved volume
    const savedVol = localStorage.getItem('ufuq_bg_music_volume');
    let targetVolume = 0.4;
    if (savedVol !== null) {
      const parsed = parseFloat(savedVol);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        targetVolume = parsed;
        setVolumeState(parsed);
      }
    }

    const wasUserPaused = localStorage.getItem('ufuq_bg_music_user_paused') === 'true';

    // If user explicitly paused before, respect it
    if (wasUserPaused) {
      return;
    }

    if (activeTracks.length === 0) return;

    // Set initial track source if not yet loaded
    const initialTrack = activeTracks[currentTrackIndex] || activeTracks[0];
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.src || !audio.src.endsWith(initialTrack.src)) {
      audio.src = initialTrack.src;
    }

    const ctx = initAudioGraph();
    let unlocked = false;

    const unlockAndPlay = async () => {
      if (unlocked) return;
      unlocked = true;

      ['click', 'pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, unlockAndPlay);
      });

      try {
        const activeCtx = audioCtxRef.current || initAudioGraph();
        if (activeCtx && activeCtx.state === 'suspended') {
          await activeCtx.resume();
        }
        if (audioRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
          setHasInteracted(true);
          rampGain(targetVolume, 1.5);
        }
      } catch (err) {
        console.warn('Unlock on interaction failed:', err);
      }
    };

    // Try autoplay on launch
    audio
      .play()
      .then(async () => {
        if (ctx && ctx.state === 'suspended') {
          try {
            await ctx.resume();
          } catch (e) {}
        }
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
        rampGain(targetVolume, 1.5);
      })
      .catch(() => {
        setIsAutoplayBlocked(true);
        ['click', 'pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
          window.addEventListener(evt, unlockAndPlay, { once: true, passive: true });
        });
      });

    return () => {
      ['click', 'pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((evt) => {
        window.removeEventListener(evt, unlockAndPlay);
      });
    };
  }, [activeTracks, currentTrackIndex, initAudioGraph, rampGain]);

  const initialSrc = activeTracks[currentTrackIndex]?.src || '';

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        isMuted,
        isAutoplayBlocked,
        hasInteracted,
        tracks: activeTracks,
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
        pause,
        setVolume,
        toggleMute,
        getFrequencyData,
      }}
    >
      {/* Persistent HTML5 Audio element for progressive streaming */}
      <audio
        ref={audioRef}
        src={initialSrc}
        preload="auto"
        playsInline
      />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
