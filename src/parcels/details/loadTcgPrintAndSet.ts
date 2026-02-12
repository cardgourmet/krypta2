import {notFound, redirect} from '@tanstack/react-router';
import {slugify} from '@/parcels/slugify.ts';
import {fetchDlcPrint, fetchDlcSet} from '@/parcels/tcg/dlc/api.ts';
import {fetchMtgPrint, fetchMtgSet, type MtgDataCard, type MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import {fetchPcgPrint, fetchPcgSet} from '@/parcels/tcg/pcg/api.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

type Params = {
  setCode: string;
  collectorNumber: string;
  any?: string | undefined;
};

export const loadTcgPrintAndSet = async (tcg: Tcg, params: Params) => {
  const res =
    tcg === 'mtg'
      ? await fetchMtgPrint(params.setCode, params.collectorNumber)
      : tcg === 'dlc'
        ? await fetchDlcPrint(params.setCode, params.collectorNumber)
        : await fetchPcgPrint(params.setCode, params.collectorNumber);
  if (!res.data) {
    console.log('Could not fetch print', res);
    throw notFound();
  }
  const cardWithPrints = res.data;
  if (!cardWithPrints) {
    throw notFound();
  }
  const slug = slugify(cardWithPrints.name);
  if (params.any !== slug) {
    throw redirect({
      to: `/${tcg}/sets/$setCode/$collectorNumber/{-$any}`,
      params: {
        setCode: params.setCode.toLowerCase(),
        collectorNumber: params.collectorNumber.toLowerCase(),
        any: slug,
      },
      replace: true,
    });
  }

  const res2 =
    tcg === 'mtg'
      ? await fetchMtgSet(cardWithPrints.print.setId)
      : tcg === 'dlc'
        ? await fetchDlcSet(cardWithPrints.print.setId)
        : await fetchPcgSet(cardWithPrints.print.setId);
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
  };
};
