import en from '@/locales/en.json';
import ml from '@/locales/ml.json';
import ar from '@/locales/ar.json';
import { Language, LocalizedString } from '@/types';

export const locales = { en, ml, ar };

export function getTranslation(lang: Language, path: string): string {
  const keys = path.split('.');
  let current: any = locales[lang] || locales.en;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English
      let fallback: any = locales.en;
      for (const fKey of keys) {
        if (fallback && typeof fallback === 'object' && fKey in fallback) {
          fallback = fallback[fKey];
        } else {
          return path;
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}

export function resolveLocalized(text: LocalizedString | undefined, lang: Language): string {
  if (!text) return '';
  if (lang === 'ar' && text.ar) return text.ar;
  if (lang === 'ml' && text.ml) return text.ml;
  return text.en || text.ml || text.ar || '';
}
