import type {UserListResponse} from '@/parcels/lists/types.ts';
import umoriClient from '@/schema/umoriClient.ts'; // /v1/users/{id}/lists

// /v1/users/{id}/lists
export async function fetchLists(
  userId: string,
  sessionToken?: string,
  abort?: AbortController,
): Promise<{ data?: UserListResponse; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/users/{id}/lists`, {
      headers: {
        'x-user-session': sessionToken ?? undefined,
      },
      params: {
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
