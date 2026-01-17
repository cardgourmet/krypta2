import type { PcgSearchQuerySettings, PcgSortBy } from '@/parcels/tcg/pcg/types.ts';
import type { TcgCardQuery } from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type PcgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];
export type PcgSearchDataCard = c['schemas']['CardSearchResult-PcgDataCard'];

export type PcgCardQuery = TcgCardQuery & {
  sortBy?: PcgSortBy;
};

export async function fetchPcgCards(
  settings: PcgSearchQuerySettings,
  abort: AbortController,
): Promise<{ query: PcgCardQuery; data?: PcgSearchCardsResult; error?: Error }> {
  const query: PcgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: Number(settings.pageSize),
    sortBy: settings.sortBy,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  try {
    const res = await umoriClient.GET(`/v1/pcg/cards/search`, {
      params: {
        query: query,
      },
      signal: abort.signal,
    });

    if (!res.response.ok) {
      return { query: query, error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { query: query, error: new Error('Received invalid data') };
    }

    return { query: query, data: res.data };
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    if (error.name === 'AbortError') {
      console.log('Just aborted the call, no biggies.');
    } else {
      console.log(`Error: ${error}`);
    }
    return { query: query, error: error };
  }
}
