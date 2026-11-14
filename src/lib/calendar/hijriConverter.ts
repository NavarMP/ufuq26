// Islamic (Hijri) calendar converter & helpers for UFUQ '26
// Aligned with Kerala / Indian subcontinent moon sighting & Umm al-Qura standard for 1448 AH

import { Language } from '@/types';

export interface HijriDate {
  day: number;
  month: number; // 1-12
  monthNameEn: string;
  monthNameMl: string;
  monthNameAr: string;
  year: number;
  formatted: string;
}

const HIJRI_MONTHS = [
  { en: 'Muharram', ml: 'മുഹറം', ar: 'محرم' },
  { en: 'Safar', ml: 'സഫർ', ar: 'صفر' },
  { en: 'Rabi al-Awwal', ml: 'റബീഉൽ അവ്വൽ', ar: 'ربيع الأول' },
  { en: 'Rabi al-Thani', ml: 'റബീഉൽ ആഖിർ', ar: 'ربيع الثاني' },
  { en: 'Jumada al-Awwal', ml: 'ജമാദുൽ അവ്വൽ', ar: 'جمادى الأولى' },
  { en: 'Jumada al-Thani', ml: 'ജമാദുൽ ആഖിർ', ar: 'جمادى الثانية' },
  { en: 'Rajab', ml: 'റജബ്', ar: 'رجب' },
  { en: 'Sha\'ban', ml: 'ശഅ്ബാൻ', ar: 'شعبان' },
  { en: 'Ramadan', ml: 'റമദാൻ', ar: 'رمضان' },
  { en: 'Shawwal', ml: 'ശവ്വാൽ', ar: 'شوال' },
  { en: 'Dhu al-Qi\'dah', ml: 'ദുൽഖഅദ്', ar: 'ذو القعدة' },
  { en: 'Dhu al-Hijjah', ml: 'ദുൽഹിജ്ജ', ar: 'ذو الحجة' },
];

/**
 * Convert Gregorian date to Hijri date
 * Using Julian day calculation with offset calibrated for 2026/1448 AH
 */
export function getHijriDate(date: Date): HijriDate {
  // If the date is in December 2026, calibration is exact:
  // Dec 24, 2026 is 14 Rajab 1448 AH
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();

  if (y === 2026 && m === 11) { // December 2026
    // Dec 1 = 21 Jumada al-Thani 1448
    // Dec 10 = 30 Jumada al-Thani / 1 Rajab 1448
    // Dec 11 = 1 Rajab 1448
    // Dec 24 = 14 Rajab 1448
    // Dec 30 = 20 Rajab 1448
    let hDay: number;
    let hMonthIdx: number;

    if (d <= 10) {
      hDay = 20 + d;
      hMonthIdx = 5; // Jumada al-Thani (0-indexed 5)
    } else {
      hDay = d - 10;
      hMonthIdx = 6; // Rajab (0-indexed 6)
    }

    const monthInfo = HIJRI_MONTHS[hMonthIdx];
    return {
      day: hDay,
      month: hMonthIdx + 1,
      monthNameEn: monthInfo.en,
      monthNameMl: monthInfo.ml,
      monthNameAr: monthInfo.ar,
      year: 1448,
      formatted: `${hDay} ${monthInfo.en} 1448 AH`,
    };
  }

  // General algorithmic calculation for other months
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l1 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l1) / 5316)) * (Math.floor((50 * l1) / 17719)) + (Math.floor(l1 / 5670)) * (Math.floor((43 * l1) / 15238));
  const l2 = l1 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const month = Math.floor((24 * l2) / 709);
  const day = l2 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  const monthIdx = Math.max(0, Math.min(11, month - 1));
  const monthInfo = HIJRI_MONTHS[monthIdx];

  return {
    day,
    month,
    monthNameEn: monthInfo.en,
    monthNameMl: monthInfo.ml,
    monthNameAr: monthInfo.ar,
    year,
    formatted: `${day} ${monthInfo.en} ${year} AH`,
  };
}

export function formatHijriLocalized(hijri: HijriDate, lang: Language): string {
  if (lang === 'ar') {
    return `${hijri.day} ${hijri.monthNameAr} ${hijri.year} هـ`;
  }
  if (lang === 'ml') {
    return `${hijri.day} ${hijri.monthNameMl} ${hijri.year} AH`;
  }
  return `${hijri.day} ${hijri.monthNameEn} ${hijri.year} AH`;
}
