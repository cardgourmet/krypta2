import type { ReactElement } from 'react';
import type { TcgDetailParams } from '@/parcels/details/loadTcgPrintAndSet.ts';
import type { TcgDataCard, TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { DlcDataCard, DlcDataSet } from '@/parcels/tcg/dlc/api.ts';
import { DlcPrintContentRenderer } from '@/parcels/tcg/dlc/details/DlcPrintContentRenderer/DlcPrintContentRenderer.tsx';
import { DlcPrintMetaRenderer } from '@/parcels/tcg/dlc/details/DlcPrintMetaRenderer/DlcPrintMetaRenderer.tsx';

export function findDlcParamsByLanguage(cardWithPrints: TcgDataCard, lang: string): TcgDetailParams {
  const card = cardWithPrints as DlcDataCard;

  const specificPrint = card.allPrints.find((print) => print.supportedLanguages.includes(lang)) ?? card.print;
  return {
    setCode: specificPrint.setCode.toLowerCase(),
    collectorNumber: specificPrint.collectorNumber.toLowerCase(),
    any: slugify(cardWithPrints.name),
  };
}

export function constructDlcPageTitle(c: TcgDataCard, s: TcgDataSet) {
  const cardWithPrints = c as DlcDataCard;
  const set = s as DlcDataSet;

  return (
    <title>{`${cardWithPrints.name} (${set.translations?.en?.name} #${cardWithPrints.print.collectorNumber}) – Disney Lorcana – Cardgourmet`}</title>
  );
}

export function constructDlcPrintFaces(c: TcgDataCard, lang: string): ReactElement[] {
  const cardWithPrints = c as DlcDataCard;

  return [<DlcPrintContentRenderer key={c.id} card={cardWithPrints} print={cardWithPrints.print} lang={lang} />];
}

export function constructDlcPrintMeta(
  c: TcgDataCard,
  s: TcgDataSet,
  lang: string,
  setLanguage: (lang: string, _: string) => void,
) {
  const cardWithPrints = c as DlcDataCard;
  const set = s as DlcDataSet;

  return (
    <DlcPrintMetaRenderer
      card={cardWithPrints}
      print={cardWithPrints.print}
      set={set}
      language={lang}
      setLanguage={setLanguage}
    />
  );
}
