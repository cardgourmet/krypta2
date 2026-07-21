import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { fetchDlcSetSummary, fetchDlcSetSummaryUser } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSortBy } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgSetSummary, fetchMtgSetSummaryUser } from '@/parcels/tcg/mtg/api.ts';
import type { MtgSortBy } from '@/parcels/tcg/mtg/types.ts';
import { fetchPcgSetSummary, fetchPcgSetSummaryUser } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSortBy } from '@/parcels/tcg/pcg/types.ts';
import type {
  TcgDataSet,
  TcgDataSetSummary,
  TcgDataSetUserSummary,
  TcgSearchQuerySettings,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export async function fetchTcgSetSummary(
  tcg: Tcg,
  setId: string,
  querySettings: TcgSearchQuerySettings,
  controller?: AbortController,
  userId?: string,
): Promise<GourmetApiResponse<TcgDataSetUserSummary> | null> {
  const { query, uniqueBy, sortBy, sortDirection } = querySettings;

  let setSummary: GourmetApiResponse<TcgDataSetSummary | TcgDataSetUserSummary>;

  if (tcg === 'mtg') {
    setSummary = userId
      ? await fetchMtgSetSummaryUser(
          setId,
          querySettings.query,
          uniqueBy,
          sortBy as MtgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        )
      : await fetchMtgSetSummary(
          setId,
          querySettings.query,
          uniqueBy,
          sortBy as MtgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        );
  } else if (tcg === 'pcg') {
    setSummary = userId
      ? await fetchPcgSetSummaryUser(
          setId,
          query,
          uniqueBy,
          sortBy as PcgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        )
      : await fetchPcgSetSummary(
          setId,
          query,
          uniqueBy,
          sortBy as PcgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        );
  } else if (tcg === 'dlc') {
    setSummary = userId
      ? await fetchDlcSetSummaryUser(
          setId,
          querySettings.query,
          uniqueBy,
          sortBy as DlcSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        )
      : await fetchDlcSetSummary(
          setId,
          querySettings.query,
          uniqueBy,
          sortBy as DlcSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          querySettings.trigger,
          controller,
        );
  } else {
    return null;
  }

  if (setSummary.error || !setSummary.data) {
    return { error: setSummary.error };
  }

  if (userId) {
    const data = (setSummary as GourmetApiResponse<TcgDataSetUserSummary>).data!;
    return {
      data: data,
      error: setSummary.error,
    };
  }

  const data = (setSummary as GourmetApiResponse<TcgDataSetSummary>).data!;

  return {
    data: {
      // @ts-expect-error
      items: data.cards,
      currentPage: 1,
      hasNextPage: false,
      pageCount: 1,
      totalItemCount: data.cards.length,
      details: {
        // @ts-expect-error
        set: data.set as TcgDataSet,
        // @ts-expect-error
        subsets: data.subsets as TcgDataSet[],
        categories: data.categories,
        details: {
          explain: data.queryExplanation,
        },
      },
    },
    error: setSummary.error,
  };
}
