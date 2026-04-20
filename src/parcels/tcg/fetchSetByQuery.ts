import type {GourmetApiResponse} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {getSetSpecificQuery} from '@/parcels/overview/getSetSpecificQuery.ts';
import {fetchDlcCards, fetchDlcSet, searchDlcSets} from '@/parcels/tcg/dlc/api.ts';
import type {DlcSearchQuerySettings} from '@/parcels/tcg/dlc/types.ts';
import {fetchMtgCards, fetchMtgSet, searchMtgSets} from '@/parcels/tcg/mtg/api.ts';
import type {MtgSearchQuerySettings} from '@/parcels/tcg/mtg/types.ts';
import {fetchPcgCards, fetchPcgSet, searchPcgSets} from '@/parcels/tcg/pcg/api.ts';
import type {PcgSearchQuerySettings} from '@/parcels/tcg/pcg/types.ts';
import type {TcgSearchCards} from '@/parcels/tcg/types.ts'; // makes a normal query request and get the first set id

// makes a normal query request and get the first set id
export async function fetchSetByQuery(tcg: string, query: string): Promise<GourmetApiResponse<TcgDataSet> | null> {
  const setFilter = getSetSpecificQuery(query);
  if (!setFilter) return null;

  const searchQuerySettings = {
    query: query,
    page: 1,
    sortDirection: 'desc',
    uniqueBy: 'cards',
    sortBy: 'name',
  };
  let data: GourmetApiResponse<TcgSearchCards>;
  if (tcg === 'mtg') {
    data = await fetchMtgCards(searchQuerySettings as MtgSearchQuerySettings, undefined, 1);
  } else if (tcg === 'pcg') {
    data = await fetchPcgCards(searchQuerySettings as PcgSearchQuerySettings, undefined, 1);
  } else {
    data = await fetchDlcCards(searchQuerySettings as DlcSearchQuerySettings, undefined, 1);
  }

  const setId = data?.data?.items[0]?.card?.print?.setId;
  if (!setId) return null;

  let set: GourmetApiResponse<TcgDataSet> | null = null;
  if (tcg === 'mtg') {
    set = await fetchMtgSet(setId);
  } else if (tcg === 'pcg') {
    set = await fetchPcgSet(setId);
  } else if (tcg === 'dlc') {
    set = await fetchDlcSet(setId);
  }

  return set;
}

export async function fetchSetByQuery2(tcg: string, query: string): Promise<GourmetApiResponse<TcgDataSet> | null> {
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
