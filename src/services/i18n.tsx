import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LANGUAGES, store } from 'mydatashare-core';
import { ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import resources from '../locales';

const supportedLngs = Object.keys(resources) as Array<keyof typeof resources>;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs,
    cleanCode: true,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
    },
  });

if (!(i18n.language in resources)) {
  i18n.changeLanguage('en');
}

document.documentElement.setAttribute('lang', i18n.language);
i18n.on('languageChanged', lng => {
  if (!(lng in resources)) {
    i18n.changeLanguage('en');
    return;
  }
  document.documentElement.setAttribute('lang', lng);
  store.setLanguage(LANGUAGES[lng]);
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
