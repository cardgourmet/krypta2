import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import authDE from '@/../locales/auth/de.json';
import authEN from '@/../locales/auth/en.json';
import cardsDE from '@/../locales/cards/de.json';
import cardsEN from '@/../locales/cards/en.json';
import navDE from '@/../locales/nav/de.json';
import navEN from '@/../locales/nav/en.json';
import searchDE from '@/../locales/search/de.json';
import searchEN from '@/../locales/search/en.json';

const resources = {
  en: {
    auth: authEN,
    cards: cardsEN,
    nav: navEN,
    search: searchEN,
  },
  de: {
    auth: authDE,
    cards: cardsDE,
    nav: navDE,
    search: searchDE,
  },
};

// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['cards', 'search', 'nav', 'auth'],
  defaultNS: 'cards',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
