import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx';
import type { ResolvedUserListResource, UserList, UserListResource, UserListResponse } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts'; // /v1/users/{id}/lists
import umoriClient from '@/schema/umoriClient.ts'; // /v1/users/{id}/lists

// /v1/users/{id}/lists
export async function fetchLists(
  userId: string,
  sortBy?: 'name' | 'updatedAt' | 'size',
  sortOrder?: 'asc' | 'desc',
  game?: Tcg,
  withResources?: boolean,
  resources?: number,
  reduced?: boolean,
  abort?: AbortController,
): Promise<GourmetApiResponse<UserListResponse>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/lists`, {
      params: {
        query: {
          game: game,
          createSystem: 'true',
          withSize: 'true',
          sortBy: sortBy ?? 'name',
          sortOrder: sortOrder ?? undefined,
          withResources: withResources ? 'true' : 'false',
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
  });
}

// /v1/users/{id}/lists
export async function fetchListsPreview(
  userId: string,
  listIds?: string[],
  game?: Tcg,
  amount?: number,
  abort?: AbortController,
): Promise<GourmetApiResponse<UserListResponse>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/lists`, {
      params: {
        query: {
          game: game,
          listIds: listIds ? listIds.join(',') : undefined,
          createSystem: 'true',
          withSize: 'true',
          withResources: 'true',
          resourcesPerType: amount ?? 5,
          pageSize: 1_000,
        },
        path: {
          id: userId,
        },
      },
      signal: abort?.signal,
    });
  });
}

export async function getList(
  userId: string,
  listId: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<UserList>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/lists/{listId}`, {
      params: {
        path: {
          id: userId,
          listId: listId,
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/users/{id}/lists
export async function createList(
  userId: string,
  list: Partial<UserList> & { name: string },
  abort?: AbortController,
): Promise<GourmetApiResponse<UserList>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/users/{id}/lists`, {
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
  });
}

// /v1/users/{id}/lists
export async function updateList(
  userId: string,
  list: Partial<UserList> & { name: string },
  abort?: AbortController,
): Promise<GourmetApiResponse<Record<string, UserList>>> {
  return handleApiCall(async () => {
    return await umoriClient.PUT(`/v1/users/{id}/lists`, {
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
  });
}

// /v1/users/{id}/lists
export async function deleteLists(
  userId: string,
  listIds: string[],
  abort?: AbortController,
): Promise<GourmetApiResponse<unknown>> {
  return handleApiCall(async () => {
    return await umoriClient.DELETE(`/v1/users/{id}/lists`, {
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
  });
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
): Promise<GourmetApiResponse<UserListResource[]>> {
  const mustType = type ?? 'card';

  return handleApiCall<UserListResource[]>(async () => {
    return await umoriClient.POST(`/v1/users/{id}/lists/{listId}/resources/${mustType}`, {
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
  });
}

// /v1/users/{id}/lists/{listId}/resources/card
export async function removeResourcesFromList(
  userId: string,
  listId: string,
  game: Tcg,
  resourceIds: string[],
  type?: 'card' | 'search',
  abort?: AbortController,
): Promise<GourmetApiResponse<unknown>> {
  const mustType = type ?? 'card';

  return handleApiCall(async () => {
    return await umoriClient.DELETE(`/v1/users/{id}/lists/{listId}/resources/${mustType}`, {
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
  });
}

// /v1/users/{id}/lists/{listId}/all
export async function getAllResourcesFromList(
  userId: string,
  listId: string,
  game?: Tcg,
  size?: number,
  abort?: AbortController,
): Promise<GourmetApiResponse<Record<string, ResolvedUserListResource[]>>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{id}/lists/{listId}/all`, {
      params: {
        path: {
          id: userId,
          listId: listId,
        },
        query: {
          game: game,
          size,
        },
      },
      signal: abort?.signal,
    });
  });
}
