import type { TcgCardQuery } from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type PcgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];

export type PcgCardSortBy = 'name' | 'set' | 'rarity' | 'type' | 'health' | 'released';
export type PcgCardQuery = TcgCardQuery & {
  sortBy?: PcgCardSortBy;
};

export function isPcgCardSortBy(s: string): s is PcgCardSortBy {
  return s === 'name' || s === 'set' || s === 'rarity' || s === 'type' || s === 'health' || s === 'released';
}

export const pcgSortByElements: Record<PcgCardSortBy, string> = {
  name: 'Name',
  set: 'Set',
  rarity: 'Seltenheit',
  type: 'Typ',
  health: 'Leben',
  released: 'Veröffentlichkeitsdatum',
};
export const pcgSortByDefault = 'name';

export function fetchPcgCards(
  query: PcgCardQuery,
  abort: AbortController,
  onSuccess: (data: PcgSearchCardsResult) => void,
) {
  umoriClient
    .GET(`/v1/pcg/cards/search`, {
      params: {
        query: query,
      },
      signal: abort.signal,
    })
    .then((res) => {
      if (!res.data) {
        return;
      }

      onSuccess(res.data as PcgSearchCardsResult);
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Just aborted the call, no biggies.');
      } else {
        console.log(`Error: ${error}`);
      }
    });
}
