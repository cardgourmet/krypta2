import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { fetchDlcCards, fetchRandomDlcCards } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgCards, fetchRandomMtgCards } from '@/parcels/tcg/mtg/api.ts';
import type { MtgSearchQuerySettings } from '@/parcels/tcg/mtg/types.ts';
import { fetchPcgCards, fetchRandomPcgCards } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSearchQuerySettings } from '@/parcels/tcg/pcg/types.ts';
import type { TcgSearchCards, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function fetchTcgCards(
  tcg: Tcg,
  querySettings: TcgSearchQuerySettings,
  controller?: AbortController,
): Promise<GourmetApiResponse<TcgSearchCards>> | null {
  if (tcg === 'mtg') {
    if (querySettings.random) return fetchRandomMtgCards(querySettings as MtgSearchQuerySettings, controller);
    return fetchMtgCards(querySettings as MtgSearchQuerySettings, controller);
  } else if (tcg === 'pcg') {
    if (querySettings.random) return fetchRandomPcgCards(querySettings as PcgSearchQuerySettings, controller);
    return fetchPcgCards(querySettings as PcgSearchQuerySettings, controller);
  } else if (tcg === 'dlc') {
    if (querySettings.random) return fetchRandomDlcCards(querySettings as DlcSearchQuerySettings, controller);
    return fetchDlcCards(querySettings as DlcSearchQuerySettings, controller);
  } else {
    return null;
  }
}
