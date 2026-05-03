import type {ReactElement} from 'react';
import type {TcgDetailParams} from '@/parcels/details/loadTcgPrintAndSet.ts';
import type {TcgDataCard, TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {MtgDataCard, MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import {MtgPrintFaceContentRenderer} from '@/parcels/tcg/mtg/details/MtgPrintFaceContentRenderer.tsx';
import {MtgPrintMetaRenderer} from '@/parcels/tcg/mtg/details/MtgPrintMetaRenderer/MtgPrintMetaRenderer.tsx';

export function findMtgParamsByLanguage(cardWithPrints: TcgDataCard, lang: string): TcgDetailParams {
  const card = cardWithPrints as MtgDataCard;

  const specificPrint = card.allPrints.find((print) => print.supportedLanguages.includes(lang)) ?? card.print;
  return {
    setCode: specificPrint.setCode.toLowerCase(),
    collectorNumber: specificPrint.collectorNumber.toLowerCase(),
    any: slugify(card.name),
  };
}

export function constructMtgPageTitle(c: TcgDataCard, s: TcgDataSet, _: string) {
  const cardWithPrints = c as MtgDataCard;
  const set = s as MtgDataSet;

  return (
    <title>{`${cardWithPrints.name} (${set.translations?.en?.name} #${cardWithPrints.print.collectorNumber}) – Magic: The Gathering – Cardgourmet`}</title>
  );
}

export function constructMtgPrintFaces(c: TcgDataCard, _: string): ReactElement[] {
  const cardWithPrints = c as MtgDataCard;
  const frontFace = cardWithPrints.print.faces[0];
  const backFace = cardWithPrints.print.faces[1];

  const elements = [];
  elements.push(
    <MtgPrintFaceContentRenderer print={frontFace} maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'} />,
  );
  if (backFace) {
    elements.push(
      <MtgPrintFaceContentRenderer print={backFace} maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'} />,
    );
  }
  return elements;
}

export function constructMtgPrintMeta(
  c: TcgDataCard,
  s: TcgDataSet,
  lang: string,
  setLanguage: (lang: string, _: string) => void,
) {
  const cardWithPrints = c as MtgDataCard;
  const set = s as MtgDataSet;

  return (
    <MtgPrintMetaRenderer
      card={cardWithPrints}
      print={cardWithPrints.print}
      set={set}
      language={lang}
      setLanguage={setLanguage}
    />
  );
}
