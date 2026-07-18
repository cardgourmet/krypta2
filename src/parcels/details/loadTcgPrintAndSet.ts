import { notFound, redirect } from '@tanstack/react-router';
import { slugify } from '@/parcels/slugify.ts';
import { fetchTcgPrint } from '@/parcels/tcg/fetchTcgPrint.tsx';
import { fetchTcgSet } from '@/parcels/tcg/fetchTcgSet.tsx';
import type { MtgDataCard, MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type TcgDetailParams = {
  setCode: string;
  collectorNumber: string;
  any?: string | undefined;
};

export const loadTcgPrintAndSet = async (tcg: Tcg, params: TcgDetailParams, userId?: string) => {
  const res = await fetchTcgPrint(tcg, params.setCode, params.collectorNumber, userId);
  if (!res?.data) {
    console.log('Could not fetch print', res);
    throw notFound();
  }
  const { card: cardWithPrints, listResources } = res.data;
  if (!cardWithPrints) {
    throw notFound();
  }
  const slug = slugify(cardWithPrints.name);
  if (params.any !== slug) {
    throw redirect({
      to: `/$tcg/sets/$setCode/$collectorNumber/{-$any}`,
      params: {
        tcg: tcg,
        setCode: params.setCode.toLowerCase(),
        collectorNumber: params.collectorNumber.toLowerCase(),
        any: slug,
      },
      replace: true,
    });
  }

  const res2 = await fetchTcgSet(tcg, cardWithPrints.print.setId);
  if (!res2.data) {
    console.log('Could not fetch set', res2);
    throw notFound();
  }
  const printSet = res2.data;
  if (!printSet) {
    throw notFound();
  }

  return {
    print: cardWithPrints as MtgDataCard,
    set: printSet as MtgDataSet,
    listResources,
  };
};
