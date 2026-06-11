import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type PostType = c['schemas']['PostType'];
export type PostTranslation = c['schemas']['PostTranslation'];
export type DataPost = c['schemas']['DataPost'];
export type DataPostResponse = c['schemas']['DataApiResponse-DataPost'];
export type DataPosts = c['schemas']['DataApiResponse-Map-String-List-DataPost']['data'];

// /v1/posts
export async function getPosts(
  types: PostType[],
  limit: number,
  abort?: AbortController,
): Promise<GourmetApiResponse<DataPosts>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/posts`, {
      params: {
        query: {
          types: types.length === 0 ? undefined : types.join(','),
          limit: limit,
        },
      },
      signal: abort?.signal,
    });
  });
}

// /v1/posts/{id}
export async function getPost(id: string, abort?: AbortController): Promise<GourmetApiResponse<DataPostResponse>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/posts/{id}`, {
      params: {
        path: {
          id: id,
        },
      },
      signal: abort?.signal,
    });
  });
}
