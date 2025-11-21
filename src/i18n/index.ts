import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './en/common.json';
import deCommon from './de/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enCommon },
    de: { translation: deCommon },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
