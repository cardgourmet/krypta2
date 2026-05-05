import {errorFrom, type GourmetApiResponse, type GourmetError, handleApiCall, handleApiError, handleUncaughtError,} from '@/parcels/api/handleApiCall.ts';
import type {components as c} from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type AuthApiUserResponse = c['schemas']['AuthApiUserResponse'];
export type AuthApiRegisterResponse = c['schemas']['AuthApiRegisterResponse'];
export type DataAuthUser = c['schemas']['DataAuthUser'];
export type AuthApiSessionDetails = c['schemas']['AuthApiSessionDetails'];

export type UserSettings = c['schemas']['UserSettings'];

// /v1/auth/basic/register

export async function registerUsingBasicAuth(
  data: {
    email: string;
    username: string;
    password: string;
    preferredGlobalLanguage?: 'en' | 'de';
  },
  abort?: AbortController,
): Promise<{ data?: AuthApiRegisterResponse; session?: string; error?: GourmetError }> {
  try {
    const res = await umoriClient.POST(`/v1/auth/basic/register`, {
      body: {
        email: data.email,
        username: data.username,
        password: data.password,
        language: data.preferredGlobalLanguage,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      const apiError = handleApiError(res.error);

      if (!apiError) return { error: errorFrom(new Error(res.response.statusText)) };
      return { error: errorFrom(new Error(apiError.error.key), apiError.error.key) };
    }
    if (!res.data) {
      return { error: errorFrom(new Error('Received invalid data')) };
    }
    return { data: res.data.data, session: res.response.headers.get('x-user-session') ?? undefined };
  } catch (error) {
    return handleUncaughtError(error);
  }
}

// /v1/auth/confirm
export async function resendConfirmationMail(
  data: {
    email: string;
  },
  abort?: AbortController,
): Promise<{ error?: Error; statusCode?: number }> {
  try {
    const res = await umoriClient.POST(`/v1/auth/confirm`, {
      body: {
        username: data.email,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { statusCode: res.data.statusCode };
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

// /v1/auth/confirm/token
export async function confirmEmailAddress(
  data: {
    token: string;
  },
  abort?: AbortController,
): Promise<{ error?: Error; statusCode?: number }> {
  try {
    const res = await umoriClient.POST(`/v1/auth/confirm/{token}`, {
      params: {
        path: {
          token: data.token,
        },
      },
      body: undefined,
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { statusCode: res.data.statusCode };
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

// /v1/auth/basic/logout
export async function loginUsingBasicAuth(
  data: {
    usernameOrEmail: string;
    password: string;
  },
  abort?: AbortController,
): Promise<{ data?: AuthApiUserResponse; session?: string; error?: GourmetError }> {
  try {
    const res = await umoriClient.POST(`/v1/auth/basic/login`, {
      body: {
        username: data.usernameOrEmail,
        password: data.password,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      const apiError = handleApiError(res.error);

      if (!apiError) return { error: errorFrom(new Error(res.response.statusText)) };
      return { error: errorFrom(new Error(apiError.error.key), apiError.error.key) };
    }
    if (!res.data) {
      return { error: errorFrom(new Error('Received invalid data')) };
    }
    return { data: res.data.data, session: res.response.headers.get('x-user-session') ?? undefined };
  } catch (error) {
    return handleUncaughtError(error);
  }
}

// /v1/auth/logout
export async function logout(abort?: AbortController): Promise<{ data?: number; error?: Error; statusCode?: number }> {
  try {
    const res = await umoriClient.POST(`/v1/auth/logout`, {
      body: undefined,
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText), statusCode: res.response.status };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { statusCode: res.response.status };
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

// /v1/auth/user
export async function getCurrentLoggedInUser(
  token?: string,
  abort?: AbortController,
): Promise<{ data?: DataAuthUser; error?: Error; statusCode?: number }> {
  try {
    const res = await umoriClient.GET(`/v1/auth/user`, {
      headers: {
        'x-user-session': token,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText), statusCode: res.response.status };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { data: res.data.data, statusCode: res.response.status };
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

// /v1/auth/user/settings
export async function updateUserSettings(
  settings: UserSettings,
  abort?: AbortController,
): Promise<GourmetApiResponse<DataAuthUser>> {
  return handleApiCall(async () => {
    return await umoriClient.PUT(`/v1/auth/user/settings`, {
      body: settings,
      signal: abort?.signal,
    });
  });
}

// /v1/auth/user/displayName
export async function updateUserDisplayName(
  displayName: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<DataAuthUser>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/auth/user/displayName`, {
      body: {
        displayName: displayName,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/auth/user/email
export async function requestUpdateUserEmail(
  email: string,
  password: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<void>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/auth/user/email`, {
      body: {
        email: email,
        password: password,
      },
      signal: abort?.signal,
    });
  });
}

// /v1/auth/user/email/{token}
export async function confirmUpdateUserEmail(
  token: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<void>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/auth/user/email/{token}`, {
      params: {
        path: {
          token: token,
        },
      },
      body: undefined,
      signal: abort?.signal,
    });
  });
}

// /v1/auth/user/password
export async function updateUserPassword(
  currentPassword: string,
  newPassword: string,
  abort?: AbortController,
): Promise<GourmetApiResponse<void>> {
  return handleApiCall(async () => {
    return await umoriClient.POST(`/v1/auth/user/password`, {
      body: {
        previousPassword: currentPassword,
        password: newPassword,
      },
      signal: abort?.signal,
    });
  });
}
