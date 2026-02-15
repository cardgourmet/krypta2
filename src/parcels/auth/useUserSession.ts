import {useLocalStorage} from '@mantine/hooks';

export type UserSession = {
  sessionToken?: string;
  expiresAt?: string;
};

export function useUserSession() {
  const [session, setSession] = useLocalStorage<UserSession | undefined>({
    key: 'user-session',
  });

  return {
    session: session,
    setSession: setSession,
  };
}
