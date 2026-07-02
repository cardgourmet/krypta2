import type { components } from '@/schema/api';
import { maybe } from '@/utils/maybe';
import { transform } from '@/utils/transform';
import type { MtgDataPrintFace } from '../tcg/mtg/api';
import type { AnyPrint } from './types';

type Translation<P extends AnyPrint> = P extends { faces: infer F extends Array<MtgDataPrintFace> }
  ? F[number]['translations'][string]
  : P extends { translations: infer T extends Record<string, unknown> }
    ? T[string]
    : never;

function getEnglishOrFirst(locales: string[]) {
  return locales.includes('en') ? 'en' : locales[0];
}

function getLocalesWithImages<
  T extends Record<string, { imageUrls?: components['schemas']['DataCardImageUrls'] | null }>,
>(translations: T) {
  const locales = Object.keys(translations);
  const withImages = locales.filter((locale) => translations[locale].imageUrls?.full);

  return [...maybe('en', withImages.includes('en')), ...withImages.filter((l) => l !== 'en')];
}

function getPhysicalFront<T extends AnyPrint = AnyPrint>(
  print: T,
  options: {
    allowImagesFromOtherLocale?: boolean;
    locale?: string;
  } = {},
) {
  const { allowImagesFromOtherLocale = true, locale = 'en' } = options;
  const translations = 'faces' in print ? print.faces[0].translations : print.translations;

  const idealTextLocale = transform(Object.keys(translations), (it) =>
    it.includes(locale) ? locale : getEnglishOrFirst(it),
  );

  const idealImageLocale =
    !allowImagesFromOtherLocale || translations[idealTextLocale].imageUrls?.full
      ? idealTextLocale
      : (getLocalesWithImages(translations).at(0) ?? idealTextLocale);

  return {
    ...(translations[idealTextLocale] as Translation<T>),
    imageUrls: translations[idealImageLocale].imageUrls,
    imagesFromOtherLocale: idealImageLocale !== idealTextLocale,
  };
}

export const Print = {
  getPhysicalFront,
};
