// Platform and device detection utility for smart calendar & reminder workflows

export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isSamsung: boolean;
  isMac: boolean;
  isWindows: boolean;
  isMobile: boolean;
  recommendedCalendar: 'apple' | 'google' | 'samsung' | 'outlook' | 'ics';
}

export function detectPlatform(): PlatformInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isSamsung: false,
      isMac: false,
      isWindows: false,
      isMobile: false,
      recommendedCalendar: 'google',
    };
  }

  const userAgent = navigator.userAgent || '';

  const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(userAgent);
  const isSamsung = /SamsungBrowser|SM-|GT-|SCH-|SGH-|SPH-/i.test(userAgent);
  const isMac = /Macintosh|Mac OS X/i.test(userAgent) && !isIOS;
  const isWindows = /Windows/i.test(userAgent);
  const isMobile = isIOS || isAndroid || /Mobi/i.test(userAgent);

  let recommendedCalendar: 'apple' | 'google' | 'samsung' | 'outlook' | 'ics' = 'google';

  if (isSamsung) {
    recommendedCalendar = 'samsung';
  } else if (isIOS || isMac) {
    recommendedCalendar = 'apple';
  } else if (isAndroid) {
    recommendedCalendar = 'google';
  } else if (isWindows) {
    recommendedCalendar = 'outlook';
  }

  return {
    isIOS,
    isAndroid,
    isSamsung,
    isMac,
    isWindows,
    isMobile,
    recommendedCalendar,
  };
}
