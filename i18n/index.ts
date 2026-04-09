import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, type Language, type StringKey } from './strings';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'commutepilot-i18n',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/** Get a translated string for the current language */
export function t(key: StringKey): string {
  const lang = useI18nStore.getState().language;
  return translations[lang][key] ?? translations.ru[key] ?? key;
}

/** React hook version — re-renders on language change */
export function useT() {
  const language = useI18nStore((s) => s.language);
  return (key: StringKey): string =>
    translations[language][key] ?? translations.ru[key] ?? key;
}

/** Pluralize for Russian numbers (1 станция, 2 станции, 5 станций) */
export function pluralize(n: number, one: string, few: string, many: string): string {
  const lang = useI18nStore.getState().language;
  if (lang === 'en' || lang === 'ar') {
    return n === 1 ? `${n} ${one}` : `${n} ${many}`;
  }
  // Russian plural rules
  if (n % 10 === 1 && n % 100 !== 11) return `${n} ${one}`;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return `${n} ${few}`;
  return `${n} ${many}`;
}

export function pluralStations(n: number): string {
  const lang = useI18nStore.getState().language;
  if (lang === 'en') return n === 1 ? `${n} station` : `${n} stations`;
  if (lang === 'ar') return n === 1 ? `محطة ${n}` : `${n} محطات`;
  return pluralize(n, 'станция', 'станции', 'станций');
}

export function pluralMinutes(n: number): string {
  const lang = useI18nStore.getState().language;
  if (lang === 'en') return n === 1 ? `${n} minute` : `${n} minutes`;
  if (lang === 'ar') return n === 1 ? `دقيقة ${n}` : `${n} دقائق`;
  return pluralize(n, 'минута', 'минуты', 'минут');
}

export function pluralLegs(n: number): string {
  const lang = useI18nStore.getState().language;
  if (lang === 'en') return n === 1 ? `${n} leg` : `${n} legs`;
  if (lang === 'ar') return n === 1 ? `مرحلة ${n}` : `${n} مراحل`;
  return pluralize(n, 'участок', 'участка', 'участков');
}

export type { Language, StringKey };
