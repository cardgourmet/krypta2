import type {UserSearchQueryStatistics} from '@/parcels/search/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import umoriClient from '@/schema/umoriClient.ts';

// /v1/users/:id/searches/history
export async function fetchSearchHistory(
  userId: string,
  game: Tcg,
  abort?: AbortController,
): Promise<{ data?: UserSearchQueryStatistics[]; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/users/{id}/searches/history`, {
      params: {
        query: {
          game: game,
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

// /v1/users/:id/searches

// /v1/users/:id/searches

// /v1/users/:id/searches/:savedSearchId
