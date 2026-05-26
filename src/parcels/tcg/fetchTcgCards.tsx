import { fetchDlcCards } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgCards } from '@/parcels/tcg/mtg/api.ts';
import type { MtgSearchQuerySettings } from '@/parcels/tcg/mtg/types.ts';
import { fetchPcgCards } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSearchQuerySettings } from '@/parcels/tcg/pcg/types.ts';
import type { TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function fetchTcgCards(tcg: Tcg, querySettings: TcgSearchQuerySettings, controller?: AbortController) {
  if (tcg === 'mtg') {
    return fetchMtgCards(querySettings as MtgSearchQuerySettings, controller);
  } else if (tcg === 'pcg') {
    return fetchPcgCards(querySettings as PcgSearchQuerySettings, controller);
  } else if (tcg === 'dlc') {
    return fetchDlcCards(querySettings as DlcSearchQuerySettings, controller);
  } else {
    return null;
  }
}
