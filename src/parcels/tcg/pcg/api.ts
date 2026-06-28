import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx';
import type { SearchQueryTrigger } from '@/parcels/overview/cards/types.ts';
import type { PcgSearchQuerySettings, PcgSortBy, PcgUniqueBy } from '@/parcels/tcg/pcg/types.ts';
import type {
  SearchQueryExecutorFilterValues,
  TcgCardQuery,
  TcgFilterOperator,
  TcgStatistics,
  TransSearchQueryExecutorFilter,
} from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type PcgSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];
export type PcgSearchCards = c['schemas']['DetailedPage-CardSearchResult-PcgDataCard-ExplainSearchQueryResponse'];
export type PcgSearchCardsUser = c['schemas']['DetailedPage-CardSearchResult-PcgDataCard-UserSearchCardsResponse'];
export type PcgSearchDataCard = c['schemas']['CardSearchResult-PcgDataCard'];
export type PcgSearchFilter = c['schemas']['TranslatedSearchQueryFilter'];
export type PcgSearchFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];
export type PcgDataSetSummary = c['schemas']['PcgDataSetSummary'];

export type PcgCardQuery = TcgCardQuery & {
  sortBy?: PcgSortBy;
};

export type PcgDataCard = c['schemas']['PcgDataCard'];
export type PcgDataPrint = c['schemas']['PcgDataPrint'];
export type PcgDataSet = c['schemas']['PcgDataSet'];
export type PcgDataSets = c['schemas']['Page-PcgDataSet'];
export type PcgDataEra = c['schemas']['PcgDataEra'];
export type PcgDataEras = c['schemas']['Page-PcgDataEra'];
export type PcgStatistics = TcgStatistics & { lastSet?: PcgDataSet };
export type PcgSetSearchResult = c['schemas']['TcgSetSearchResult-PcgDataSet'];

// /v1/pcg/sets/search
export async function searchPcgSets(
  query: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<PcgSetSearchResult>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/sets/search`, {
      params: {
        query: {
          query: query,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/pcg/sets/{setId}/summary
export async function fetchPcgSetSummary(
  setId: string,
  query: string,
  mode?: PcgUniqueBy,
  sortBy?: PcgSortBy,
  sortDirection?: 'asc' | 'desc',
  trigger?: SearchQueryTrigger,
  abort?: AbortController,
): Promise<GourmetApiResponse<PcgDataSetSummary>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/sets/{setId}/summary`, {
      params: {
        query: {
          query: query,
          mode: `unique:${mode}`,
          sortBy: sortBy,
          sortDirection: sortDirection,
          trigger: trigger,
        },
        path: {
          setId: setId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/pcg/sets/{setId}
export async function fetchPcgSet(setId: string, abort?: AbortController): Promise<GourmetApiResponse<PcgDataSet>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/sets/{setId}`, {
      params: {
        path: {
          setId: setId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/pcg/sets
export async function fetchPcgSets(abort?: AbortController): Promise<GourmetApiResponse<PcgDataSets>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/sets`, {
      params: {
        query: {
          region: 'int',
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/pcg/era
export async function fetchPcgEras(abort?: AbortController): Promise<GourmetApiResponse<PcgDataEras>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/eras`, {
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/prints/{setCode}/{collectorNumber}
export async function fetchPcgPrint(
  setCode: string,
  collectorNumber: string,
  abort?: AbortController,
): Promise<{ data?: PcgDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/pcg/prints/{setCode}/{collectorNumber}`, {
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

// /v1/pcg/cards/search
export async function fetchPcgCards(
  settings: PcgSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<PcgSearchCards>> {
  const query: PcgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    mode: `unique:${settings.uniqueBy}`,
    sortBy: settings.sortBy,
    trigger: settings.trigger,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/search`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/user-search
export async function fetchPcgCardsUser(
  settings: PcgSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<PcgSearchCardsUser>> {
  const query: PcgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    mode: `unique:${settings.uniqueBy}`,
    sortBy: settings.sortBy,
    trigger: settings.trigger,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/user-search`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/random
export async function fetchRandomPcgCards(
  settings: PcgSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<PcgSearchCards>> {
  const query: PcgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    mode: `unique:${settings.uniqueBy}`,
    sortBy: settings.sortBy,
    trigger: settings.trigger,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/random`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/user-random
export async function fetchRandomPcgCardsUser(
  settings: PcgSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<PcgSearchCardsUser>> {
  const query: PcgCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    mode: `unique:${settings.uniqueBy}`,
    sortBy: settings.sortBy,
    trigger: settings.trigger,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/user-random`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/search/filters
export async function fetchPcgFilters(
  abort?: AbortController,
): Promise<GourmetApiResponse<TransSearchQueryExecutorFilter[]>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/search/filters`, {
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/search/filters/values
export async function fetchPcgFiltersValues(
  filters: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<Record<string, SearchQueryExecutorFilterValues>>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/cards/search/filters/values`, {
      params: {
        query: {
          filters: filters.join(','),
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/pcg/cards/search/filters/{filter}/values
export async function fetchPcgFilterValues(
  filter: string,
  abort?: AbortController,
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

// /v1/pcg/cards/search/explain
export async function fetchPcgQueryExplain(query: string, abort?: AbortController) {
  try {
    const res = await umoriClient.GET(`/v1/pcg/cards/search/explain`, {
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

// /v1/pcg/prints/{id}
export async function fetchPcgPrintById(
  printId: string,
  abort?: AbortController,
): Promise<{ data?: PcgDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET('/v1/pcg/prints/{id}', {
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

// /v1/pcg/stats
export async function getPcgStatistics(abort?: AbortController): Promise<GourmetApiResponse<PcgStatistics>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/pcg/stats`, {
      signal: abort?.signal,
    });
  });
}
