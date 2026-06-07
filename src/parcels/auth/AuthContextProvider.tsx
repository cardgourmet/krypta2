import { type PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { AuthContext, type UserSession } from '@/parcels/auth/AuthContext.ts';
import {
  type DataAuthUser,
  logout as doLogout,
  getCurrentLoggedInUser,
  listUserIntegrations,
} from '@/parcels/auth/api.ts';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import { useLocalUserStore } from '@/parcels/state/LocalUserStore.tsx';

export function AuthContextProvider({ children }: PropsWithChildren) {
  const noti = useGourmetNotification();

  const session = useLocalUserStore((state) => state.session);
  const setSession = useLocalUserStore((state) => state.setSession);

  const user = useLocalUserStore((state) => state.user);
  const setUser = useLocalUserStore((state) => state.setUser);

  const removeWasVerified = useLocalUserStateStore((state) => state.removeVerified);
  const removeEmailWasChanged = useLocalUserStateStore((state) => state.removeEmailWasChanged);

  const integrations = useLocalUserStore((state) => state.integrations);
  const setIntegrations = useLocalUserStore((state) => state.setIntegrations);

  const loadIntegrations = useCallback(async () => {
    if (user?.state !== 'verified') return;

    const res = await listUserIntegrations();
    if (res.error) {
      setIntegrations(undefined);
    }
    setIntegrations(res.data ?? []);
  }, [user?.state, setIntegrations]);
  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    loadIntegrations();
  }, [loadIntegrations]);

  const login = useCallback(
    ({ token, expiresAt, user }: Partial<UserSession> & { user?: DataAuthUser }) => {
      if (!token) {
        // user can't be verified without a token.
        if (user?.state === 'unverified') {
          // we log him in with the data given (no data fetching)
          setSession(undefined);
          setUser(user);
          return;
        }

        setSession(undefined);
        setUser(undefined);
        return;
      }
      if (expiresAt) {
        const expiresAtTimestamp = Date.parse(expiresAt);
        if (expiresAtTimestamp < Date.now()) {
          // already expired
          setSession(undefined);
          setUser(undefined);
          return;
        }
      }

      getCurrentLoggedInUser(token).then((res) => {
        if (res.error) {
          if (res.statusCode === 401) {
            // not logged in anymore
            setSession(undefined);
            setUser(undefined);
            return;
          }

          noti.show('Unknown error', `${res.error}`, 'error');
          return;
        }
        if (!res.data) return;

        removeEmailWasChanged();
        removeWasVerified();
        setSession({ token: token, expiresAt: expiresAt });
        setUser(res.data);
      });
    },
    [setSession, setUser, removeWasVerified, noti.show, removeEmailWasChanged],
  );
  const logout = useCallback(() => {
    // noinspection JSIgnoredPromiseFromCall
    doLogout();

    setSession(undefined);
    setUser(undefined);
  }, [setSession, setUser]);

  const updateUser = useCallback(
    (user: DataAuthUser) => {
      setUser(user);
    },
    [setUser],
  );

  const authData = useMemo(() => {
    return {
      user: user ?? undefined,
      token: session?.token,
      login,
      logout,
      updateUser,
      integrations,
      loadIntegrations,
    };
  }, [user, session, login, logout, updateUser, integrations, loadIntegrations]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!session) return;
    login(session);
  }, []);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
