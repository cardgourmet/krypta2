import type {DlcSearchQuerySettings, DlcSortBy} from '@/parcels/tcg/dlc/types.ts';
import type {TcgCardQuery, TcgFilterOperator} from '@/parcels/tcg/types.ts';
import type {components as c} from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type DlcCardQuery = TcgCardQuery & {
  sortBy?: DlcSortBy;
};

export type DlcSearchCardsResult =
  c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'];
export type DlcSearchDataCard = c['schemas']['CardSearchResult-DlcDataCard'];
export type DlcSearchFilter = c['schemas']['SearchQueryExecutorSearchQueryFilter'];
export type DlcSearchFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];

export type DlcDataCard = c['schemas']['DlcDataCard'];
export type DlcDataPrint = c['schemas']['DlcDataPrint'];
export type DlcDataSet = c['schemas']['DlcDataSet'];

// v1/mtg/sets/{setId}
export async function fetchDlcSet(
  setId: string,
  abort?: AbortController,
): Promise<{ data?: DlcDataSet; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/dlc/sets/{setId}`, {
      params: {
        path: {
          setId: setId,
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

// /v1/mtg/prints/{setCode}/{collectorNumber}
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
  abort: AbortController,
): Promise<{ query: DlcCardQuery; data?: DlcSearchCardsResult; error?: Error }> {
  const query: DlcCardQuery = {
    query: settings.query,
    page: settings.page,
    pageSize: 60,
    mode: `unique:${settings.uniqueBy}`,
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

// /v1/dlc/cards/search/filters
export async function fetchDlcFilters(abort: AbortController): Promise<{ data?: DlcSearchFilter[]; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/dlc/cards/search/filters`, {
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
