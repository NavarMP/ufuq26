// Web Notification & Audio Chime Manager for UFUQ '26 Reminders

/**
 * Play a delicate, pleasant acoustic golden chime using Web Audio API
 */
export function playHarmonicChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Harmonic bell frequencies (F major / Golden triad: F5 698.46Hz, A5 880Hz, C6 1046.5Hz)
    const frequencies = [698.46, 880.0, 1046.5];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
}

/**
 * Check browser notification permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
}

/**
 * Dispatch an in-browser notification
 */
export function dispatchBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const notif = new Notification(title, {
      icon: '/images/UFUQ-Logo.svg',
      badge: '/images/UFUQ-Logo.svg',
      silent: false,
      ...options,
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    // Play pleasant local chime
    playHarmonicChime();
    return true;
  } catch (err) {
    console.warn('Notification dispatch error:', err);
    return false;
  }
}

/**
 * Test notification helper that fires immediately
 */
export async function testReminderNotification(): Promise<boolean> {
  const permitted = await requestNotificationPermission();
  if (!permitted) {
    return false;
  }

  return dispatchBrowserNotification('🔔 UFUQ ’26 Reminder Test', {
    body: 'Your reminder system is active! You will receive alerts for your scheduled camp sessions.',
    tag: 'ufuq-test-notification',
  });
}
