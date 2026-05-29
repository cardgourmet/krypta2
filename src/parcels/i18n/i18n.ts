import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import authDE from '@/../locales/auth/de.json';
import authEN from '@/../locales/auth/en.json';
import cardsDE from '@/../locales/cards/de.json';
import cardsEN from '@/../locales/cards/en.json';
import historyDE from '@/../locales/history/de.json';
import historyEN from '@/../locales/history/en.json';
import homeDE from '@/../locales/home/de.json';
import homeEN from '@/../locales/home/en.json';
import listsDE from '@/../locales/lists/de.json';
import listsEN from '@/../locales/lists/en.json';
import navDE from '@/../locales/nav/de.json';
import navEN from '@/../locales/nav/en.json';
import savedDE from '@/../locales/saved/de.json';
import savedEN from '@/../locales/saved/en.json';
import searchDE from '@/../locales/search/de.json';
import searchEN from '@/../locales/search/en.json';
import selectionDE from '@/../locales/selection/de.json';
import selectionEN from '@/../locales/selection/en.json';
import setsDE from '@/../locales/sets/de.json';
import setsEN from '@/../locales/sets/en.json';
import cuisineDE from '../../../locales/cuisine/de.json';
import cuisineEN from '../../../locales/cuisine/en.json';
import detailsDE from '../../../locales/details/de.json';
import detailsEN from '../../../locales/details/en.json';

const resources = {
  en: {
    auth: authEN,
    cards: cardsEN,
    nav: navEN,
    search: searchEN,
    selection: selectionEN,
    lists: listsEN,
    history: historyEN,
    saved: savedEN,
    cuisine: cuisineEN,
    sets: setsEN,
    home: homeEN,
    details: detailsEN,
  },
  de: {
    auth: authDE,
    cards: cardsDE,
    nav: navDE,
    search: searchDE,
    selection: selectionDE,
    lists: listsDE,
    history: historyDE,
    saved: savedDE,
    cuisine: cuisineDE,
    sets: setsDE,
    home: homeDE,
    details: detailsDE,
  },
};

// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  ns: ['auth', 'cards', 'nav', 'search', 'selection', 'lists', 'history', 'saved', 'cuisine', 'sets', 'home'],
  defaultNS: 'cards',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
