'use client';

import React from 'react';
import { usePreferences } from '@/context/PreferencesContext';
import { useAudio } from '@/context/AudioContext';
import {
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Play,
  Pause,
  Sparkles,
  Smartphone,
  Vibrate,
  Radio,
  Sliders,
} from 'lucide-react';
import { soundEngine } from '@/lib/soundEngine';
import { hapticEngine } from '@/lib/hapticEngine';

export default function AudioHapticsTab() {
  const { preferences, updatePreference } = usePreferences();
  const {
    isPlaying,
    togglePlay,
    volume: musicVolume,
    setVolume: setMusicVolume,
    currentTrack,
    isMuted: isMusicMuted,
    toggleMute: toggleMusicMute,
  } = useAudio();

  const handleUiSoundToggle = () => {
    const nextState = !preferences.uiSoundsEnabled;
    updatePreference('uiSoundsEnabled', nextState);
    if (nextState) {
      soundEngine.setEnabled(true);
      soundEngine.playClick();
      hapticEngine.trigger('crisp');
    }
  };

  const handleUiVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    updatePreference('uiSoundsVolume', vol);
    soundEngine.setVolume(vol);
    soundEngine.playSliderTick(vol);
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setMusicVolume(vol);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. PROCEDURAL UI MICRO-SOUNDS (WEB AUDIO) */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Procedural UI Micro-Sounds (Zero Asset)
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Velvet clicks, chimes, and tactile harmonics generated live via Web Audio API
              </p>
            </div>
          </div>
          <button
            onClick={handleUiSoundToggle}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.uiSoundsEnabled ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.uiSoundsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* SFX Volume Slider */}
        {preferences.uiSoundsEnabled && (
          <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600 dark:text-neutral-400">UI Sounds Volume</span>
              <span className="font-mono font-bold text-brand-gold">
                {Math.round(preferences.uiSoundsVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1.0"
              step="0.05"
              value={preferences.uiSoundsVolume}
              onChange={handleUiVolumeChange}
              className="w-full accent-brand-gold h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
            />

            {/* Test SFX Sound Buttons */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                Audition Micro-Sounds
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => soundEngine.playClick()}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 hover:bg-brand-gold/15 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 transition-colors active:scale-95"
                >
                  Bubble Pop
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playSnap()}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 hover:bg-brand-gold/15 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 transition-colors active:scale-95"
                >
                  Metallic Snap
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playChime()}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-white/60 dark:bg-white/5 hover:bg-brand-gold/15 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 transition-colors active:scale-95"
                >
                  Harmony Chime
                </button>
                <button
                  type="button"
                  onClick={() => soundEngine.playSuccess()}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-brand-gold/20 hover:bg-brand-gold/30 border border-brand-gold/30 text-brand-gold font-bold transition-colors active:scale-95"
                >
                  Celestial Chord
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. BACKGROUND AMBIENT SOUNDSCAPE */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Background Ambient Soundscape
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {currentTrack ? currentTrack.title : 'Official UFUQ Camp Theme'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playSnap();
                togglePlay();
              }}
              type="button"
              className="p-2 rounded-full bg-brand-gold text-brand-navy shadow hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                toggleMusicMute();
              }}
              type="button"
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Toggle mute"
            >
              {isMusicMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ambient Volume Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">Music Volume</span>
            <span className="font-mono font-bold text-brand-gold">
              {Math.round(musicVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMusicMuted ? 0 : musicVolume}
            onChange={handleMusicVolumeChange}
            className="w-full accent-brand-gold h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 3. MOBILE HAPTIC VIBRATION FEEDBACK */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
              <Vibrate className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Tactile Haptic Feedback
              </span>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Gentle vibration pulses on mobile devices during toggles & actions
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const next = !preferences.hapticsEnabled;
              updatePreference('hapticsEnabled', next);
              if (next) hapticEngine.trigger('success');
            }}
            type="button"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              preferences.hapticsEnabled ? 'bg-brand-gold' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences.hapticsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {preferences.hapticsEnabled && (
          <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              Test Device Vibration:
            </span>
            <button
              onClick={() => {
                hapticEngine.trigger('success');
                soundEngine.playSnap();
              }}
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 transition-colors active:scale-95"
            >
              Trigger Haptic Pulse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
