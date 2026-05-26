import { fetchDlcSetSummary } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSortBy } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgSetSummary } from '@/parcels/tcg/mtg/api.ts';
import type { MtgSortBy } from '@/parcels/tcg/mtg/types.ts';
import { fetchPcgSetSummary } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSortBy } from '@/parcels/tcg/pcg/types.ts';
import type { TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function fetchTcgSetSummary(
  tcg: Tcg,
  setId: string,
  querySettings: TcgSearchQuerySettings,
  controller?: AbortController,
) {
  const { query, uniqueBy, sortBy, sortDirection } = querySettings;

  if (tcg === 'mtg') {
    return fetchMtgSetSummary(
      setId,
      querySettings.query,
      uniqueBy,
      sortBy as MtgSortBy,
      sortDirection === 'auto' ? 'asc' : sortDirection,
      controller,
    );
  } else if (tcg === 'pcg') {
    return fetchPcgSetSummary(
      setId,
      query,
      uniqueBy,
      sortBy as PcgSortBy,
      sortDirection === 'auto' ? 'asc' : sortDirection,
      controller,
    );
  } else if (tcg === 'dlc') {
    return fetchDlcSetSummary(
      setId,
      querySettings.query,
      uniqueBy,
      sortBy as DlcSortBy,
      sortDirection === 'auto' ? 'asc' : sortDirection,
      controller,
    );
  } else {
    return null;
  }
}
