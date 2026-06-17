import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import sk from './locales/sk.json'
import en from './locales/en.json'
import de from './locales/de.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sk: { translation: sk },
      en: { translation: en },
      de: { translation: de },
    },
    fallbackLng: 'sk',
    supportedLngs: ['sk', 'en', 'de'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'reveng_language',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
