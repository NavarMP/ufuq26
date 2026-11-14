/**
 * Zero-latency audio feedback synthesizer using Web Audio API
 * and haptic vibration for gate scanning and validation.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Ascending Major Chord Chime: Valid entry / Granted / Success
 * 523.25Hz (C5) -> 659.25Hz (E5) -> 783.99Hz (G5)
 */
export function playGrantedSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);

    // Haptic vibration (short crisp pulse)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(70);
    }
  } catch (err) {
    console.warn('Audio play failed:', err);
  }
}

/**
 * Double-Pip Warning: Already checked in / duplicate scan within window
 * 440Hz (A4) double beep
 */
export function playWarningSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const playPip = (offset: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now + offset);

      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.25, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.1);
    };

    playPip(0);
    playPip(0.12);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
  } catch (err) {
    console.warn('Warning audio play failed:', err);
  }
}

/**
 * Low Sawtooth Buzz: Access Denied / Invalid Code / Meal Already Redeemed
 * 160Hz low frequency buzz
 */
export function playDeniedSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(164.81, now); // E3
    osc.frequency.linearRampToValueAtTime(130.81, now + 0.28); // C3

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.33);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 60, 150]);
    }
  } catch (err) {
    console.warn('Denied audio play failed:', err);
  }
}
