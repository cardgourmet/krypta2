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
