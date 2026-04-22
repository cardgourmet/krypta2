import {type GourmetApiResponse, handleApiCall} from '@/parcels/api/handleApiCall.ts';
import type {DlcSearchQuerySettings, DlcSortBy, DlcUniqueBy} from '@/parcels/tcg/dlc/types.ts';
import type {SearchQueryExecutorFilter, SearchQueryExecutorFilterValues, TcgCardQuery, TcgFilterOperator,} from '@/parcels/tcg/types.ts';
import type {components as c} from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type DlcCardQuery = TcgCardQuery & {
  sortBy?: DlcSortBy;
};

export type DlcSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'];
export type DlcSearchCards = c['schemas']['DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'];
export type DlcSearchDataCard = c['schemas']['CardSearchResult-DlcDataCard'];
export type DlcSearchFilter = c['schemas']['SearchQueryExecutorSearchQueryFilter'];
export type DlcSearchFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];
export type DlcDataSetSummary = c['schemas']['DlcDataSetSummary'];

export type DlcDataCard = c['schemas']['DlcDataCard'];
export type DlcDataPrint = c['schemas']['DlcDataPrint'];
export type DlcDataSet = c['schemas']['DlcDataSet'];

// /v1/dlc/sets/search
export async function searchDlcSets(query: string, abort?: AbortController): Promise<GourmetApiResponse<DlcDataSet[]>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/sets/search`, {
      params: {
        query: {
          query: query,
        },
      },
      signal: abort?.signal,
    });
  });
}

// v1/dlc/sets/{setId}/summary
export async function fetchDlcSetSummary(
  setId: string,
  query: string,
  mode?: DlcUniqueBy,
  sortBy?: DlcSortBy,
  sortDirection?: 'asc' | 'desc',
  abort?: AbortController,
): Promise<GourmetApiResponse<DlcDataSetSummary>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/sets/{setId}/summary`, {
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

// v1/dlc/sets/{setId}
export async function fetchDlcSet(setId: string, abort?: AbortController): Promise<GourmetApiResponse<DlcDataSet>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/sets/{setId}`, {
      params: {
        path: {
          setId: setId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/dlc/prints/{setCode}/{collectorNumber}
export async function fetchDlcPrint(
  setCode: string,
  collectorNumber: string,
  abort?: AbortController,
): Promise<{ data?: DlcDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/dlc/prints/{setCode}/{collectorNumber}`, {
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

export async function fetchDlcCards(
  settings: DlcSearchQuerySettings,
  abort?: AbortController,
  pageSize?: number,
): Promise<GourmetApiResponse<DlcSearchCards>> {
  const query: DlcCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: pageSize ?? 60,
    mode: `unique:${settings.uniqueBy}`,
    sortBy: settings.sortBy,
  };
  if (settings.sortDirection !== 'auto') {
    query.sortDirection = settings.sortDirection;
  }

  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/cards/search`, {
      params: {
        query: query,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/dlc/cards/search/filters
export async function fetchDlcFilters(
  abort?: AbortController,
): Promise<GourmetApiResponse<SearchQueryExecutorFilter[]>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/cards/search/filters`, {
      signal: abort?.signal,
    });
  });
}

// /v1/dlc/cards/search/filters/values
export async function fetchDlcFiltersValues(
  filters: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<Record<string, SearchQueryExecutorFilterValues>>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/dlc/cards/search/filters/values`, {
      params: {
        query: {
          filters: filters.join(','),
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/dlc/cards/search/filters/{filter}/values
export async function fetchDlcFilterValues(
  filter: string,
  abort?: AbortController,
  operator?: TcgFilterOperator,
  query?: string,
  amount?: number,
): Promise<{ data?: DlcSearchFilterValues; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/dlc/cards/search/filters/{filter}/values`, {
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

// /v1/dlc/cards/search/explain
export async function fetchDlcQueryExplain(query: string, abort?: AbortController) {
  try {
    const res = await umoriClient.GET(`/v1/dlc/cards/search/explain`, {
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

// /v1/dlc/prints/{id}
export async function fetchDlcPrintById(
  printId: string,
  abort?: AbortController,
): Promise<{ data?: DlcDataCard; error?: Error }> {
  try {
    const res = await umoriClient.GET('/v1/dlc/prints/{id}', {
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
