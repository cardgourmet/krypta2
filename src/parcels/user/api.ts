import { type GourmetApiResponse, handleApiCall } from '@/parcels/api/handleApiCall.tsx';
import type { components as c } from '@/schema/api';
import umoriClient from '@/schema/umoriClient.ts';

export type DataUser = c['schemas']['DataUser'];

// /v1/users/{identifier}
export async function findUser(identifier: string, abort?: AbortController): Promise<GourmetApiResponse<DataUser>> {
  return handleApiCall(async () => {
    return await umoriClient.GET(`/v1/users/{identifier}`, {
      params: {
        path: {
          identifier: identifier,
        },
      },
      signal: abort?.signal,
    });
  });
}
