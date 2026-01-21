import type { PcgSearchQuerySettings, PcgSortBy } from '@/parcels/tcg/pcg/types.ts';
import type { TcgCardQuery, TcgFilterOperator } from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type PcgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];
export type PcgSearchDataCard = c['schemas']['CardSearchResult-PcgDataCard'];
export type PcgSearchFilter = c['schemas']['SearchQueryExecutorSearchQueryFilter'];
export type PcgSearchFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];

export type PcgCardQuery = TcgCardQuery & {
  sortBy?: PcgSortBy;
};

// /v1/pcg/cards/search
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

// /v1/pcg/cards/search/filters
export async function fetchPcgFilters(abort: AbortController): Promise<{ data?: PcgSearchFilter[]; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/pcg/cards/search/filters`, {
      signal: abort.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }

    return { data: res.data.data };
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    if (error.name === 'AbortError') {
      console.log('Just aborted the call, no biggies.');
    } else {
      console.log(`Error: ${error}`);
    }
    return { error: error };
  }
}

// /v1/pcg/cards/search/filters/{filter}/values
export async function fetchPcgFilterValues(
  filter: string,
  abort: AbortController,
  operator?: TcgFilterOperator,
  query?: string,
  amount?: number,
): Promise<{ data?: PcgSearchFilterValues; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/pcg/cards/search/filters/{filter}/values`, {
      params: {
        query: {
          operator: operator,
          query: query,
          amount: amount,
        },
        path: {
          filter: filter,
        },
      },
      signal: abort.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }

    return { data: res.data.data };
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    if (error.name === 'AbortError') {
      console.log('Just aborted the call, no biggies.');
    } else {
      console.log(`Error: ${error}`);
    }
    return { error: error };
  }
}
