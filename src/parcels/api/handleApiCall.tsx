import { Group, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
// @ts-expect-error
import type { FetchResponse } from 'openapi-fetch/src';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';

export async function handleApiCall<R>(
  call: () => Promise<FetchResponse<unknown, unknown, unknown>>,
): Promise<GourmetApiResponse<R>> {
  try {
    const res = await call();

    if (!res.response.ok) {
      const apiError = handleApiError(res.error);

      if (!apiError) return { error: errorFrom(new Error(res.response.statusText)) };
      return { error: errorFrom(new Error(apiError.error.key), apiError.error.key) };
    }
    if (!res.data) {
      return { error: errorFrom(new Error('Received invalid data')) };
    }
    return res.data ?? {};
  } catch (error) {
    return handleUncaughtError(error);
  }
}

export function handleUncaughtError<T>(error: unknown): GourmetApiResponse<T> {
  if (!(error instanceof Error)) throw error;

  if (error.name === 'AbortError') {
    console.log('Just aborted the call, no biggies.');
  } else {
    console.log(`Error: ${error}`);
  }
  return { error: { error: error, key: 'unknown' } };
}

export function handleApiError(error: Error | undefined): ApiError | undefined {
  const errorBody = error as unknown as ApiError;
  if (!errorBody?.error?.key) return undefined;
  return errorBody;
}

export type GourmetApiResponse<T> = {
  data?: T;
  error?: GourmetError;
};

export type GourmetError = {
  key: string;
  error?: Error;
};

export function sendErrorNotification(error: GourmetError) {
  notifications.show({
    autoClose: 5_000,
    color: 'var(--gourmet-red-01)',
    message: (
      <Group wrap={'nowrap'} align={'stretch'}>
        <Stack justify={'start'} gap={'0.25rem'}>
          <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
            Unexpected Error
          </GourmetText>
          <GourmetText fz={'0.9rem'}>
            An unexpected error has occured, please try again later and report it to us if it happens again.
          </GourmetText>
          <GourmetText fz={'0.9rem'}>
            Code: <code>{error.key}</code>
          </GourmetText>
        </Stack>
      </Group>
    ),
  });
}

export function errorFrom(error: Error, key?: string): GourmetError {
  return { key: key ?? 'unknown', error };
}

export type ApiError = { error: { key: string; message: string }; statusCode: number };
