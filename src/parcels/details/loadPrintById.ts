import { notFound, redirect } from '@tanstack/react-router';
import { slugify } from '@/parcels/slugify.ts';
import { fetchDlcPrintById } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgPrintById } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgPrintById } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const loadPrintById = async (tcg: Tcg, printId: string) => {
  const res =
    tcg === 'mtg'
      ? await fetchMtgPrintById(printId)
      : tcg === 'dlc'
        ? await fetchDlcPrintById(printId)
        : await fetchPcgPrintById(printId);
  if (!res.data) {
    console.log('Could not fetch print', res);
    throw notFound();
  }

  const cardWithPrints = res.data;
  if (!cardWithPrints) {
    throw notFound();
  }
  const slug = slugify(cardWithPrints.name);
  throw redirect({
    to: `/$tcg/sets/$setCode/$collectorNumber/{-$any}`,
    params: {
      tcg: tcg,
      setCode: cardWithPrints.print.setCode!.toLowerCase(),
      collectorNumber: cardWithPrints.print.collectorNumber.toLowerCase(),
      any: slug,
    },
    replace: true,
  });
};
