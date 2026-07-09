import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx'; // /v1/users/:id/searches/history
import type {
  PagedUserSavedSearch,
  PagedUserSearchHistoryEntry,
  UserResolvedSavedSearch,
} from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import umoriClient from '@/schema/umoriClient.ts';

// /v1/users/:id/searches/history
export async function fetchSearchHistory(
  userId: string,
  game: Tcg,
  search?: string,
  sortOrder?: 'asc' | 'desc',
  page?: number,
  pageSize?: number,
  abort?: AbortController,
): Promise<GourmetApiResponse<PagedUserSearchHistoryEntry>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/searches/history`, {
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
  });
}

// /v1/users/:id/searches
export async function fetchSavedSearches(
  userId: string,
  game?: Tcg,
  search?: string,
  sortOrder?: 'asc' | 'desc',
  pageSize?: number,
  abort?: AbortController,
): Promise<GourmetApiResponse<PagedUserSavedSearch>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/searches`, {
      params: {
        query: {
          game: game,
          search: search,
          sortBy: 'savedAt',
          sortOrder: sortOrder,
          pageSize: pageSize ?? 10_000,
        },
        path: {
          id: userId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/users/:id/searches
export async function saveSearches(
  userId: string,
  game: Tcg,
  searchStatisticIds: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<UserResolvedSavedSearch[]>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/users/{id}/searches`, {
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
  });
}

// /v1/users/:id/searches
export async function deleteSavedSearches(
  userId: string,
  game: Tcg,
  savedSearchesIds: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<void>> {
  return handleApiCall(async () => {
    return await umoriClient.DELETE(`/v1/users/{id}/searches`, {
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
  });
}
