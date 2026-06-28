import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
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

export function shouldBeTransformed(tcg: Tcg, card: TcgDataCard): boolean {
  if (tcg !== 'mtg') return false;
  card = card as MtgDataCard;

  const oneSideLayouts = ['split', 'aftermath'];
  if (oneSideLayouts.includes(card.layout)) return false;

  return card.print.faces.length > 1;
}

export function shouldBeRotated(tcg: Tcg, card: TcgDataCard): number {
  if (tcg === 'mtg') {
    const rotatedTypes = ['battle', 'plane', 'phenomenon'];

    card = card as MtgDataCard;
    const rotateLayouts = ['split', 'aftermath'];
    if (card.layout === 'aftermath') return -90;
    if (rotateLayouts.includes(card.layout)) return 90;
    return card.print.faces.some((f) => {
      return rotatedTypes.some((t) => f.types.includes(t));
    })
      ? 90
      : 0;
  } else if (tcg === 'dlc') {
    const rotatedTypes = ['location'];

    const dlcCard = card as DlcDataCard;
    return rotatedTypes.some((t) => dlcCard.classifications.includes(t)) ? 90 : 0;
  }
  return 0;
}
