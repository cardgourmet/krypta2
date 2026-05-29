import type { TcgDataCard } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type { CursorImage } from '@/parcels/generic/CursorImageHover/CursorImageHover.tsx';
import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
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
