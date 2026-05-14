import type {
  PagedUserSavedSearch,
  PagedUserSearchHistoryEntry,
  UserResolvedSavedSearch,
} from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import umoriClient from '@/schema/umoriClient.ts'; // /v1/users/:id/searches/history

// /v1/users/:id/searches/history
export async function fetchSearchHistory(
  userId: string,
  game: Tcg,
  search?: string,
  sortOrder?: 'asc' | 'desc',
  page?: number,
  pageSize?: number,
  abort?: AbortController,
): Promise<{ data?: PagedUserSearchHistoryEntry; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/users/{id}/searches/history`, {
      params: {
        query: {
          game: game,
          search: search,
          sortOrder: sortOrder,
          page: page,
          pageSize: pageSize,
        },
        path: {
          id: userId,
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

// /v1/users/:id/searches
export async function fetchSavedSearches(
  userId: string,
  game?: Tcg,
  search?: string,
  sortOrder?: 'asc' | 'desc',
  abort?: AbortController,
): Promise<{ data?: PagedUserSavedSearch; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/users/{id}/searches`, {
      params: {
        query: {
          game: game,
          search: search,
          sortOrder: sortOrder,
          pageSize: 10_000,
        },
        path: {
          id: userId,
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

// /v1/users/:id/searches
export async function saveSearches(
  userId: string,
  game: Tcg,
  searchStatisticIds: string[],
  abort?: AbortController,
): Promise<{ data?: UserResolvedSavedSearch[]; error?: Error }> {
  try {
    const res = await umoriClient.POST(`/v1/users/{id}/searches`, {
      params: {
        query: {
          game: game,
        },
        path: {
          id: userId,
        },
      },
      body: {
        queryStatisticIds: searchStatisticIds,
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

// /v1/users/:id/searches
export async function deleteSavedSearches(
  userId: string,
  game: Tcg,
  savedSearchesIds: string[],
  abort?: AbortController,
): Promise<{ error?: Error }> {
  try {
    const res = await umoriClient.DELETE(`/v1/users/{id}/searches`, {
      params: {
        query: {
          game: game,
        },
        path: {
          id: userId,
        },
      },
      // @ts-expect-error
      body: {
        savedSearchIds: savedSearchesIds,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }

    return {};
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
