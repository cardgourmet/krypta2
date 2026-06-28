import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import {
  fetchDlcCards,
  fetchDlcCardsUser,
  fetchRandomDlcCards,
  fetchRandomDlcCardsUser,
} from '@/parcels/tcg/dlc/api.ts';
import type { DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import {
  fetchMtgCards,
  fetchMtgCardsUser,
  fetchRandomMtgCards,
  fetchRandomMtgCardsUser,
} from '@/parcels/tcg/mtg/api.ts';
import type { MtgSearchQuerySettings } from '@/parcels/tcg/mtg/types.ts';
import {
  fetchPcgCards,
  fetchPcgCardsUser,
  fetchRandomPcgCards,
  fetchRandomPcgCardsUser,
} from '@/parcels/tcg/pcg/api.ts';
import type { PcgSearchQuerySettings } from '@/parcels/tcg/pcg/types.ts';
import type { TcgSearchCards, TcgSearchCardsUser, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export async function fetchTcgCards(
  tcg: Tcg,
  querySettings: TcgSearchQuerySettings,
  controller?: AbortController,
  userId?: string,
): Promise<GourmetApiResponse<TcgSearchCardsUser> | null> {
  let searchCards: GourmetApiResponse<TcgSearchCards | TcgSearchCardsUser>;

  if (tcg === 'mtg') {
    if (querySettings.random) {
      searchCards = userId
        ? await fetchRandomMtgCardsUser(querySettings as MtgSearchQuerySettings, controller)
        : await fetchRandomMtgCards(querySettings as MtgSearchQuerySettings, controller);
    } else {
      searchCards = userId
        ? await fetchMtgCardsUser(querySettings as MtgSearchQuerySettings, controller)
        : await fetchMtgCards(querySettings as MtgSearchQuerySettings, controller);
    }
  } else if (tcg === 'pcg') {
    if (querySettings.random) {
      searchCards = userId
        ? await fetchRandomPcgCardsUser(querySettings as PcgSearchQuerySettings, controller)
        : await fetchRandomPcgCards(querySettings as PcgSearchQuerySettings, controller);
    } else {
      searchCards = userId
        ? await fetchPcgCardsUser(querySettings as PcgSearchQuerySettings, controller)
        : await fetchPcgCards(querySettings as PcgSearchQuerySettings, controller);
    }
  } else if (tcg === 'dlc') {
    if (querySettings.random) {
      searchCards = userId
        ? await fetchRandomDlcCardsUser(querySettings as DlcSearchQuerySettings, controller)
        : await fetchRandomDlcCards(querySettings as DlcSearchQuerySettings, controller);
    } else {
      searchCards = userId
        ? await fetchDlcCardsUser(querySettings as DlcSearchQuerySettings, controller)
        : await fetchDlcCards(querySettings as DlcSearchQuerySettings, controller);
    }
  } else {
    return null;
  }

  if (searchCards.error || !searchCards.data) {
    return { error: searchCards.error };
  }
  if (userId) {
    const data = (searchCards as GourmetApiResponse<TcgSearchCardsUser>).data!;
    return {
      data: data,
      error: searchCards.error,
    };
  }

  const data = (searchCards as GourmetApiResponse<TcgSearchCards>).data!;

  return {
    data: {
      ...data,
      details: {
        explain: data?.details,
      },
    },
    error: searchCards.error,
  };
}
