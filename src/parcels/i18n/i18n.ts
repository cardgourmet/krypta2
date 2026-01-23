import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import cardsDE from '@/../locales/cards/de.json';
import cardsEN from '@/../locales/cards/en.json';
import searchDE from '@/../locales/search/de.json';
import searchEN from '@/../locales/search/en.json';

const resources = {
  en: {
    cards: cardsEN,
    search: searchEN,
  },
  de: {
    cards: cardsDE,
    search: searchDE,
  },
};

// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['cards', 'search'],
  defaultNS: 'cards',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
