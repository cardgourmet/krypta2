import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.ts';
import { getSetSpecificQuery } from '@/parcels/overview/cards/getSetSpecificQuery.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { searchDlcSets } from '@/parcels/tcg/dlc/api.ts';
import { searchMtgSets } from '@/parcels/tcg/mtg/api.ts';
import { searchPcgSets } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataSet, TcgSetSearchResult } from '@/parcels/tcg/types.ts';

export async function fetchSetByQuery(
  tcg: string,
  query: string,
): Promise<GourmetApiResponse<{ set: TcgDataSet; explain?: ExplainSearchQuery }> | null> {
  const setFilter = getSetSpecificQuery(query);
  if (!setFilter) return null;

  let res: GourmetApiResponse<TcgSetSearchResult> | null = null;
  if (tcg === 'mtg') {
    res = await searchMtgSets(query);
  } else if (tcg === 'pcg') {
    res = await searchPcgSets(query);
  } else if (tcg === 'dlc') {
    res = await searchDlcSets(query);
  }
  if (!res || !res.data)
    return {
      data: undefined,
      error: res?.error,
    };
  const { sets, parsedQuery } = res.data;

  if (sets.length === 0 || sets.length > 1) return null;
  return {
    data: { set: sets[0], explain: parsedQuery ?? undefined },
  };
}
