// Tactile Haptic Feedback Engine for UFUQ '26
// Provides nuanced vibration patterns for mobile devices

export type HapticPattern = 'subtle' | 'crisp' | 'chime' | 'success' | 'warning' | 'selection';

class HapticEngine {
  private isEnabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public trigger(pattern: HapticPattern = 'subtle') {
    if (!this.isEnabled) return;
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

    try {
      switch (pattern) {
        case 'subtle':
          // Featherweight tick for micro-toggles (10ms)
          navigator.vibrate(10);
          break;

        case 'selection':
          // Defined tap for segmented selectors (15ms)
          navigator.vibrate(15);
          break;

        case 'crisp':
          // Double micro-tick for tab transitions
          navigator.vibrate([12, 35, 12]);
          break;

        case 'chime':
          // Ascending dual pulse
          navigator.vibrate([15, 40, 25]);
          break;

        case 'success':
          // Warm confirming pattern (short-medium-long)
          navigator.vibrate([15, 30, 25, 40, 35]);
          break;

        case 'warning':
          // Rapid warning buzz
          navigator.vibrate([40, 50, 40]);
          break;
      }
    } catch {
      // Safe fallback if permission denied or browser restricts vibration
    }
  }
}

export const hapticEngine = new HapticEngine();
