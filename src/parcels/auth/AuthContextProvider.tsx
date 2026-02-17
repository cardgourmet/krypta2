import {useLocalStorage} from '@mantine/hooks';
import {type PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {AuthContext, type UserSession} from '@/parcels/auth/AuthContext.ts';
import {type DataAuthUser, getCurrentLoggedInUser, logout as doLogout} from '@/parcels/auth/api.ts';

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession, removeSession] = useLocalStorage<UserSession | null>({
    key: 'cgm-user-session',
    getInitialValueInEffect: false,
  });
  const [user, setUser, removeUser] = useLocalStorage<DataAuthUser | null>({
    key: 'cgm-user',
    getInitialValueInEffect: false,
  });
  const [wasVerified, setWasVerified, removeWasVerified] = useLocalStorage<boolean | null>({
    key: 'cgm-was-verified',
  });

  const login = useCallback(
    ({ token, expiresAt, user }: Partial<UserSession> & { user?: DataAuthUser }) => {
      if (!token) {
        // user can't be verified without a token.
        if (user?.state === 'unverified') {
          console.log('Log in with unverified!');

          // we log him in with the data given (no data fetching)
          removeSession();
          setUser(user);
          return;
        }

        removeSession();
        removeUser();
        return;
      }
      if (expiresAt) {
        const expiresAtTimestamp = Date.parse(expiresAt);
        if (expiresAtTimestamp < Date.now()) {
          // already expired
          removeSession();
          removeUser();
          return;
        }
      }

      getCurrentLoggedInUser(token).then((res) => {
        if (res.error) {
          if (res.statusCode === 401) {
            // not logged in anymore
            removeSession();
            removeUser();
            return;
          }

          console.error('Could not find logged in user', res.error);
          return;
        }
        if (!res.data) return;

        removeWasVerified();
        setSession({ token: token, expiresAt: expiresAt });
        setUser(res.data);
      });
    },
    [removeSession, setSession, removeUser, setUser, removeWasVerified],
  );
  const logout = useCallback(() => {
    // noinspection JSIgnoredPromiseFromCall
    doLogout(session?.token);

    removeSession();
    removeUser();
  }, [removeSession, removeUser, session]);
  const verify = useCallback(() => {
    setWasVerified(true);
  }, [setWasVerified]);

  const authData = useMemo(() => {
    return {
      user: user ?? undefined,
      token: session?.token,
      login: login,
      logout: logout,
      wasVerified: wasVerified ?? false,
      verify: verify,
      removeVerified: removeWasVerified,
    };
  }, [user, session, login, logout, verify, wasVerified, removeWasVerified]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!session) return;
    login(session);
  }, []);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
