import type {components as c} from '@/schema/api.d.ts';
import umoriClient from '@/schema/umoriClient.ts';

export type AuthApiUserResponse = c['schemas']['AuthApiUserResponse'];
export type AuthApiRegisterResponse = c['schemas']['AuthApiRegisterResponse'];
export type DataAuthUser = c['schemas']['DataAuthUser'];
export type AuthApiSessionDetails = c['schemas']['AuthApiSessionDetails'];

// /v1/auth/basic/register
export async function registerUsingBasicAuth(
  data: {
    email: string;
    username: string;
    password: string;
    preferredGlobalLanguage?: 'en' | 'de';
  },
  abort?: AbortController,
): Promise<{ data?: AuthApiRegisterResponse; session?: string; error?: Error }> {
  const currentSession = JSON.parse(localStorage.getItem('session') ?? '{}') as {
    sessionToken?: string;
    expiresAt?: string;
  };

  try {
    const res = await umoriClient.POST(`/v1/auth/basic/register`, {
      headers: {
        'x-user-session': currentSession.sessionToken ?? undefined,
      },
      body: {
        email: data.email,
        username: data.username,
        password: data.password,
        language: data.preferredGlobalLanguage,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { data: res.data.data, session: res.response.headers.get('x-user-session') ?? undefined };
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
): Promise<{ data?: AuthApiUserResponse; session?: string; error?: Error }> {
  const currentSession = JSON.parse(localStorage.getItem('session') ?? '{}') as {
    sessionToken?: string;
    expiresAt?: string;
  };

  try {
    const res = await umoriClient.POST(`/v1/auth/basic/login`, {
      headers: {
        'x-user-session': currentSession.sessionToken ?? undefined,
      },
      body: {
        username: data.usernameOrEmail,
        password: data.password,
      },
      signal: abort?.signal,
    });

    if (!res.response.ok) {
      return { error: new Error(res.response.statusText) };
    }
    if (!res.data) {
      return { error: new Error('Received invalid data') };
    }
    return { data: res.data.data, session: res.response.headers.get('x-user-session') ?? undefined };
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

// /v1/auth/logout
export async function logout(abort?: AbortController): Promise<{ data?: number; error?: Error }> {
  const currentSession = JSON.parse(localStorage.getItem('session') ?? '{}') as {
    sessionToken?: string;
    expiresAt?: string;
  };

  try {
    const res = await umoriClient.POST(`/v1/auth/logout`, {
      headers: {
        'x-user-session': currentSession.sessionToken ?? undefined,
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
    return { data: res.data.statusCode };
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
