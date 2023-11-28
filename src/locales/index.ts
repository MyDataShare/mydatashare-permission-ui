import en from './en.json';
import fi from './fi.json';
import sv from './sv.json';

export const appLngAlpha2Codes = ['en', 'fi', 'sv'] as const;
export const appLngAlpha3Codes = {
  en: 'eng',
  fi: 'fin',
  sv: 'swe',
} as const;

export type LocaleAlpha2 = (typeof appLngAlpha2Codes)[number];
export type LocaleAlpha3 =
  (typeof appLngAlpha3Codes)[keyof typeof appLngAlpha3Codes];

const translations = {
  en: {
    translation: en,
  },
  fi: {
    translation: fi,
  },
  sv: {
    translation: sv,
  },
};

export default translations;
