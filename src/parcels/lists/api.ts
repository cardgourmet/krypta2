import type {UserList, UserListResource, UserListResponse} from '@/parcels/lists/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts'; // /v1/users/{id}/lists
import umoriClient from '@/schema/umoriClient.ts'; // /v1/users/{id}/lists

// /v1/users/{id}/lists
export async function fetchLists(
  userId: string,
  sortBy?: 'name' | 'updatedAt' | 'size',
  sortOrder?: 'asc' | 'desc',
  game?: Tcg,
  resources?: number,
  reduced?: boolean,
  abort?: AbortController,
): Promise<{ data?: UserListResponse; error?: Error }> {
  try {
    const res = await umoriClient.GET(`/v1/users/{id}/lists`, {
      params: {
        query: {
          game: game,
          createSystem: 'true',
          withSize: 'true',
          sortBy: sortBy ?? 'name',
          sortOrder: sortOrder ?? undefined,
          withResources: 'true',
          resourcesPerType: resources ?? 5,
          reduced: `${reduced ?? false}`,
          pageSize: 1_000,
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
  abort?: AbortController,
): Promise<{ data?: UserList; error?: Error }> {
  try {
    const res = await umoriClient.POST(`/v1/users/{id}/lists`, {
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
      // TODO: parse body to error body and try it that way ...

      console.log(res.response);
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
  abort?: AbortController,
): Promise<{ error?: Error }> {
  try {
    const res = await umoriClient.PUT(`/v1/users/{id}/lists`, {
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
  abort?: AbortController,
): Promise<{ error?: Error }> {
  try {
    const res = await umoriClient.DELETE(`/v1/users/{id}/lists`, {
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

// /v1/users/{id}/lists/{listId}/resources/card
export async function addResourcesToList(
  userId: string,
  listId: string,
  game: Tcg,
  resources: { id: string }[],
  type?: 'card' | 'search',
  raw?: boolean,
  abort?: AbortController,
): Promise<{ data?: UserListResource[]; error?: Error }> {
  const mustType = type ?? 'card';

  try {
    const res = await umoriClient.POST(`/v1/users/{id}/lists/{listId}/resources/${mustType}`, {
      params: {
        path: {
          id: userId,
          listId: listId,
        },
      },
      body: {
        game: game,
        resourceIds: resources,
        isRaw: raw,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { data: res.data?.data as UserListResource[] };
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

// /v1/users/{id}/lists/{listId}/resources/card
export async function removeResourcesFromList(
  userId: string,
  listId: string,
  game: Tcg,
  resourceIds: string[],
  type?: 'card' | 'search',
  abort?: AbortController,
): Promise<{ error?: Error }> {
  const mustType = type ?? 'card';

  try {
    const res = await umoriClient.DELETE(`/v1/users/{id}/lists/{listId}/resources/${mustType}`, {
      params: {
        path: {
          id: userId,
          listId: listId,
        },
      },
      // @ts-expect-error
      body: {
        game: game,
        resourceIds: resourceIds,
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
