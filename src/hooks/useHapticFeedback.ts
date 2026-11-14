'use client';

import { useCallback } from 'react';

/**
 * Hook providing lightweight haptic vibrations on supported mobile devices
 */
export function useHapticFeedback() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore devices or browsers with vibration restrictions
      }
    }
  }, []);

  const triggerLight = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const triggerSuccess = useCallback(() => {
    vibrate([15, 30, 20]);
  }, [vibrate]);

  const triggerPop = useCallback(() => {
    vibrate([18, 20]);
  }, [vibrate]);

  return {
    triggerLight,
    triggerSuccess,
    triggerPop,
  };
}
