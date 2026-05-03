// @ts-expect-error
import type {FetchResponse} from "openapi-fetch/src";

export async function handleApiCall<R>(
  call: () => Promise<FetchResponse<unknown, unknown, unknown>>,
): Promise<GourmetApiResponse<R>> {
  try {
    const res = await call();

    if (!res.response.ok) {
      const apiError = handleApiError(res.error);

      if (!apiError) return { error: errorFrom(new Error(res.response.statusText)) };
      return { error: errorFrom(new Error(apiError.error.key)) };
    }
    if (!res.data) {
      return { error: errorFrom(new Error('Received invalid data')) };
    }
    return res.data ?? {};
  } catch (error) {
    return handleUncaughtError(error);
  }
}

function handleUncaughtError<T>(error: unknown): GourmetApiResponse<T> {
  if (!(error instanceof Error)) throw error;

  if (error.name === 'AbortError') {
    console.log('Just aborted the call, no biggies.');
  } else {
    console.log(`Error: ${error}`);
  }
  return { error: { error: error, key: 'unknown' } };
}

function handleApiError(error: Error | undefined): ApiError | undefined {
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

function errorFrom(error: Error, key?: string): GourmetError {
  return { key: key ?? 'unknown', error };
}

export type ApiError = { error: { key: string; message: string }; statusCode: number };
