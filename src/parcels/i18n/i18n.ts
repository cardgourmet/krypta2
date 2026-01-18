import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cardsDE from '@/../locales/cards/de.json';
import cardsEN from '@/../locales/cards/en.json';

const resources = {
  en: {
    cards: cardsEN,
  },
  de: {
    cards: cardsDE,
  },
};

// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['cards'],
  defaultNS: 'cards',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
