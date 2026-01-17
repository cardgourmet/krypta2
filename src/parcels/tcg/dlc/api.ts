import type { DlcSearchQuerySettings, DlcSortBy } from '@/parcels/tcg/dlc/types.ts';
import type { TcgCardQuery } from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type DlcCardQuery = TcgCardQuery & {
  sortBy?: DlcSortBy;
};

export type DlcSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'];

export async function fetchDlcCards(
  settings: DlcSearchQuerySettings,
  abort: AbortController,
): Promise<{ query: DlcCardQuery; data?: DlcSearchCardsResult; error?: Error }> {
  const query: DlcCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: Number(settings.pageSize),
    sortBy: settings.sortBy,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  try {
    const res = await umoriClient.GET(`/v1/dlc/cards/search`, {
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
