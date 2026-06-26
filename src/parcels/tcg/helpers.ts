import type { DlcDataCard, DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgDataCard, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataCard, TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function getTranslatedName(tcg: Tcg, card: TcgDataCard, lang: string): string {
  if (tcg === 'mtg') {
    const c = card as MtgDataCard;

    return c.print.faces
      .map((f) => {
        return f.translations[lang]?.name ?? f.translations.en.name;
      })
      .join(' // ');
  } else if (tcg === 'pcg') {
    const c = card as PcgDataCard;

    return c.print.translations[lang]?.name ?? c.print.translations.en.name;
  } else if (tcg === 'dlc') {
    const c = card as DlcDataCard;

    return c.print.translations[lang]?.name ?? c.print.translations.en.name;
  }

  return card.name;
}

export function shouldBeRotated(tcg: Tcg, card: TcgSearchDataCard): boolean {
  if (tcg === 'mtg') {
    const rotatedTypes = ['battle', 'plane', 'phenomenon'];

    card = card as MtgSearchDataCard;
    return card.card.print.faces.some((f) => {
      return rotatedTypes.some((t) => f.types.includes(t));
    });
  } else if (tcg === 'dlc') {
    const rotatedTypes = ['location'];

    const dlcCard = card as DlcSearchDataCard;
    return rotatedTypes.some((t) => dlcCard.card.classifications.includes(t));
  }

  return false;
}
