import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.ts';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { getSetSpecificQuery } from '@/parcels/overview/cards/getSetSpecificQuery.ts';
import { searchDlcSets } from '@/parcels/tcg/dlc/api.ts';
import { searchMtgSets } from '@/parcels/tcg/mtg/api.ts';
import { searchPcgSets } from '@/parcels/tcg/pcg/api.ts';

export async function fetchSetByQuery(tcg: string, query: string): Promise<GourmetApiResponse<TcgDataSet> | null> {
  const setFilter = getSetSpecificQuery(query);
  if (!setFilter) return null;

  let sets: GourmetApiResponse<TcgDataSet[]> | null = null;
  if (tcg === 'mtg') {
    sets = await searchMtgSets(query);
  } else if (tcg === 'pcg') {
    sets = await searchPcgSets(query);
  } else if (tcg === 'dlc') {
    sets = await searchDlcSets(query);
  }

  if (!sets || !sets.data)
    return {
      data: undefined,
      error: sets?.error,
    };
  if (sets.data.length === 0 || sets.data.length > 1) return null;
  return {
    data: sets.data[0],
  };
}
