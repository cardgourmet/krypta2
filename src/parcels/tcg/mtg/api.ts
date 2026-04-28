import {type GourmetApiResponse, handleApiCall} from '@/parcels/api/handleApiCall.ts';
import type {MtgSearchQuerySettings, MtgSortBy, MtgUniqueBy} from '@/parcels/tcg/mtg/types.ts';
import type {SearchQueryExecutorFilter, SearchQueryExecutorFilterValues, TcgCardQuery, TcgFilterOperator,} from '@/parcels/tcg/types.ts';
import type {components as c} from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type MtgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-MtgDataCard-ExplainSearchQueryResponse'];
export type MtgSearchCards = c['schemas']['DetailedPage-CardSearchResult-MtgDataCard-ExplainSearchQueryResponse'];

export type MtgSearchDataCard = c['schemas']['CardSearchResult-MtgDataCard'];
export type MtgSearchFilter = c['schemas']['SearchQueryExecutorSearchQueryFilter'];
export type MtgSearchFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];
export type MtgDataCard = c['schemas']['MtgDataCard'];
export type MtgDataPrintFace = c['schemas']['MtgDataPrintFace'];
export type MtgDataPrint = c['schemas']['MtgDataPrint'];
export type MtgDataPrintReference = c['schemas']['MtgDataPrintReference'];
export type MtgDataSet = c['schemas']['MtgDataSet'];
export type MtgDataSets = c['schemas']['Page-MtgDataSet'];
export type MtgDataSetSummary = c['schemas']['MtgDataSetSummary'];

export type MtgCardQuery = TcgCardQuery & {
  sortBy?: MtgSortBy;
};

// /v1/mtg/sets/search
export async function searchMtgSets(query: string, abort?: AbortController): Promise<GourmetApiResponse<MtgDataSet[]>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/sets/search`, {
      params: {
        query: {
          query: query,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/mtg/sets/{setId}/summary
export async function fetchMtgSetSummary(
  setId: string,
  query: string,
  mode?: MtgUniqueBy,
  sortBy?: MtgSortBy,
  sortDirection?: 'asc' | 'desc',
  abort?: AbortController,
): Promise<GourmetApiResponse<MtgDataSetSummary>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/sets/{setId}/summary`, {
      params: {
        query: {
          query: query,
          mode: `unique:${mode}`,
          sortBy: sortBy,
          sortDirection: sortDirection,
        },
        path: {
          setId: setId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/mtg/sets/{setId}
export async function fetchMtgSet(setId: string, abort?: AbortController): Promise<GourmetApiResponse<MtgDataSet>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/sets/{setId}`, {
      params: {
        path: {
          setId: setId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/mtg/sets
export async function fetchMtgSets(abort?: AbortController): Promise<GourmetApiResponse<MtgDataSets>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/sets`, {
      signal: abort?.signal,
    });
  });
}

// /v1/mtg/prints/{setCode}/{collectorNumber}
export async function fetchMtgPrint(
  setCode: string,
  collectorNumber: string,
  abort?: AbortController,
): Promise<{ data?: MtgDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/mtg/prints/{setCode}/{collectorNumber}`, {
      params: {
        path: {
          setCode: setCode,
          collectorNumber: collectorNumber,
        },
      },
      signal: abort?.signal,
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

// /v1/mtg/cards/search
export async function fetchMtgCards(
  settings: MtgSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<MtgSearchCards>> {
  const query: MtgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    sortBy: settings.sortBy,
    mode: `unique:${settings.uniqueBy}`,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/cards/search`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/mtg/cards/search/filters
export async function fetchMtgFilters(
  abort?: AbortController,
): Promise<GourmetApiResponse<SearchQueryExecutorFilter[]>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/cards/search/filters`, {
      signal: abort?.signal,
    });
  });
}

// /v1/mtg/cards/search/filters/values
export async function fetchMtgFiltersValues(
  filters: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<Record<string, SearchQueryExecutorFilterValues>>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/mtg/cards/search/filters/values`, {
      params: {
        query: {
          filters: filters.join(','),
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/mtg/cards/search/filters/{filter}/values
export async function fetchMtgFilterValues(
  filter: string,
  abort?: AbortController,
  operator?: TcgFilterOperator,
  query?: string,
  amount?: number,
): Promise<{ data?: MtgSearchFilterValues; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/mtg/cards/search/filters/{filter}/values`, {
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
      signal: abort?.signal,
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

// /v1/mtg/cards/search/explain
export async function fetchMtgQueryExplain(query: string, abort?: AbortController) {
  try {
    const res = await umoriClient.GET(`/v1/mtg/cards/search/explain`, {
      params: {
        query: {
          query: query,
        },
      },
      signal: abort?.signal,
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

// /v1/mtg/prints/{id}
export async function fetchMtgPrintById(
  printId: string,
  abort?: AbortController,
): Promise<{ data?: MtgDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET('/v1/mtg/prints/{id}', {
      params: {
        path: {
          id: printId,
        },
      },
      signal: abort?.signal,
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
