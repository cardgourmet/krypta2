import type {ReactElement} from 'react';
import type {TcgDetailParams} from '@/parcels/details/loadTcgPrintAndSet.ts';
import type {TcgDataCard, TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {PcgDataCard, PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import {PcgPrintContentRenderer} from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentRenderer.tsx';
import {PcgPrintMetaRenderer} from '@/parcels/tcg/pcg/details/PcgPrintMetaRenderer/PcgPrintMetaRenderer.tsx';

export function findPcgParamsByLanguage(cardWithPrints: TcgDataCard, lang: string): TcgDetailParams {
  const card = cardWithPrints as PcgDataCard;

  const specificPrint = card.allPrints.find((print) => print.supportedLanguages.includes(lang)) ?? cardWithPrints.print;
  return {
    setCode: specificPrint.setCode?.toLowerCase() ?? '???',
    collectorNumber: specificPrint.collectorNumber.toLowerCase(),
    any: slugify(card.name),
  };
}

export function constructPcgPageTitle(c: TcgDataCard, s: TcgDataSet) {
  const cardWithPrints = c as PcgDataCard;
  const set = s as PcgDataSet;

  return (
    <title>{`${cardWithPrints.name} (${set.translations?.en?.name} #${cardWithPrints.print.collectorNumber}) – Pokémon Card Game – Cardgourmet`}</title>
  );
}

export function constructPcgPrintFaces(c: TcgDataCard, _: string): ReactElement[] {
  const cardWithPrints = c as PcgDataCard;

  return [<PcgPrintContentRenderer key={c.id} card={cardWithPrints} print={cardWithPrints.print} />];
}

export function constructPcgPrintMeta(
  c: TcgDataCard,
  s: TcgDataSet,
  lang: string,
  setLanguage: (lang: string, _: string) => void,
) {
  const cardWithPrints = c as PcgDataCard;
  const set = s as PcgDataSet;

  return (
    <PcgPrintMetaRenderer
      card={cardWithPrints}
      print={cardWithPrints.print}
      set={set}
      language={lang}
      setLanguage={setLanguage}
    />
  );
}
