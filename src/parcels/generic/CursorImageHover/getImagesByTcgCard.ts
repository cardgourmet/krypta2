import type { CursorImage } from '@/parcels/generic/CursorImageHover/CursorImageHover.tsx';
import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataCard, TcgDataPrintReference } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function getImagesByTcgCard(tcg: Tcg, c: TcgDataCard): CursorImage[] {
  const images: CursorImage[] = [];
  if (tcg === 'mtg') {
    const card = c as MtgDataCard;

    images.push({
      imageUrl: card.print.faces[0].translations.en.imageUrls?.full ?? '',
      alt: card.print.faces[0].translations.en.name ?? '',
    });
    if (card.print.faces[0].propertyTags?.includes('double_faced_card')) {
      images.push({
        imageUrl: card.print.faces[1].translations.en.imageUrls?.thumbnail ?? '',
        alt: card.print.faces[1].translations.en.name ?? '',
      });
    }
  } else if (tcg === 'pcg') {
    const card = c as PcgDataCard;

    images.push({
      imageUrl: card.print.translations.en.imageUrls?.thumbnail ?? '',
      alt: card.print.translations.en.name ?? '',
    });
  } else if (tcg === 'dlc') {
    const card = c as DlcDataCard;

    images.push({
      imageUrl: card.print.translations.en.imageUrls?.thumbnail ?? '',
      alt: card.print.translations.en.name ?? '',
    });
  }

  return images;
}

export function getImagesByTcgPrintRef(c: TcgDataPrintReference, name?: string): CursorImage[] {
  const images: CursorImage[] = [];
  images.push({
    imageUrl: c.imageUrls?.full ?? '',
    alt: name ?? '',
  });

  return images;
}

export function getImagesByTcgCardRelated(_: Tcg, relatedCard: MtgDataCard['relatedCards'][0], lang: string) {
  const images: CursorImage[] = [];
  const translations = relatedCard.translations[lang];

  images.push({
    imageUrl: translations[0].imageUrls?.full ?? translations[0].imageUrls?.thumbnail ?? '',
    alt: translations[0].name ?? '',
  });
  if (translations.length > 1) {
    images.push({
      imageUrl: translations[1].imageUrls?.full ?? translations[1].imageUrls?.thumbnail ?? '',
      alt: translations[1].name ?? '',
    });
  }

  return images;
}
