import type {UserList, UserListResponse} from '@/parcels/lists/types.ts';
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
        query: {
          createSystem: 'true',
          withSize: 'true',
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

// /v1/users/{id}/lists
export async function createList(
  userId: string,
  list: Partial<UserList> & { name: string },
  sessionToken?: string,
  abort?: AbortController,
): Promise<{ data?: UserList; error?: Error }> {
  try {
    const res = await umoriClient.POST(`/v1/users/{id}/lists`, {
      headers: {
        'x-user-session': sessionToken ?? undefined,
      },
      params: {
        path: {
          id: userId,
        },
      },
      body: {
        name: list.name,
        description: list.description,
        allowedTcgs: list.allowedTcgs,
        visibility: list.visibility,
        color: list.color,
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

// /v1/users/{id}/lists
export async function updateList(
  userId: string,
  list: Partial<UserList> & { name: string },
  sessionToken?: string,
  abort?: AbortController,
): Promise<{ error?: Error }> {
  try {
    const res = await umoriClient.PUT(`/v1/users/{id}/lists`, {
      headers: {
        'x-user-session': sessionToken ?? undefined,
      },
      params: {
        path: {
          id: userId,
        },
      },
      body: {
        listUpdates: [
          {
            id: list.id as string,
            name: list.name,
            description: list.description,
            allowedTcgs: list.allowedTcgs,
            resetAllowedTcg: (list.allowedTcgs?.length ?? 0) === 0,
            visibility: list.visibility,
            color: list.color,
          },
        ],
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

// /v1/users/{id}/lists
export async function deleteLists(
  userId: string,
  listIds: string[],
  sessionToken?: string,
  abort?: AbortController,
): Promise<{ error?: Error }> {
  try {
    const res = await umoriClient.DELETE(`/v1/users/{id}/lists`, {
      headers: {
        'x-user-session': sessionToken ?? undefined,
      },
      params: {
        path: {
          id: userId,
        },
      },
      // @ts-expect-error
      body: {
        listIds: listIds,
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
