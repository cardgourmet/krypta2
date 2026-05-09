import {useLocalStorage} from '@mantine/hooks';
import {type PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {AuthContext, type UserSession} from '@/parcels/auth/AuthContext.ts';
import {type DataAuthUser, getCurrentLoggedInUser, logout as doLogout} from '@/parcels/auth/api.ts';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';

export const CGM_USER_SESSION = 'cgm-user-session';
export const CGM_USER = 'cgm-user';
export const CGM_WAS_VERIFIED = 'cgm-was-verified';
export const CGM_EMAIL_PENDING = 'cgm-email-pending';
export const CGM_EMAIL_WAS_CHANGED = 'cgm-email-was-changed';

export function AuthContextProvider({ children }: PropsWithChildren) {
  const noti = useGourmetNotification();

  const [session, setSession, removeSession] = useLocalStorage<UserSession | null>({
    key: CGM_USER_SESSION,
    getInitialValueInEffect: false,
  });
  const [user, setUser, removeUser] = useLocalStorage<DataAuthUser | null>({
    key: CGM_USER,
    getInitialValueInEffect: false,
  });
  const [wasVerified, setWasVerified, removeWasVerified] = useLocalStorage<boolean | null>({
    key: CGM_WAS_VERIFIED,
  });

  // specific to email update in settings
  const [emailWasChanged, setEmailWasChanged, removeEmailWasChanged] = useLocalStorage<boolean | null>({
    key: CGM_EMAIL_WAS_CHANGED,
  });

  const login = useCallback(
    ({ token, expiresAt, user }: Partial<UserSession> & { user?: DataAuthUser }) => {
      if (!token) {
        // user can't be verified without a token.
        if (user?.state === 'unverified') {
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
    [removeSession, setSession, removeUser, setUser, removeWasVerified, noti.show, removeEmailWasChanged],
  );
  const logout = useCallback(() => {
    // noinspection JSIgnoredPromiseFromCall
    doLogout();

    removeSession();
    removeUser();
  }, [removeSession, removeUser]);
  const verify = useCallback(() => {
    setWasVerified(true);
  }, [setWasVerified]);

  const setEmailHasChanged = useCallback(() => {
    setEmailWasChanged(true);
  }, [setEmailWasChanged]);

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
      wasVerified: wasVerified ?? false,
      verify,
      removeVerified: removeWasVerified,

      removeEmailWasChanged,
      emailWasChanged: emailWasChanged ?? false,
      setEmailHasChanged,
      updateUser,
    };
  }, [
    user,
    session,
    login,
    logout,
    verify,
    wasVerified,
    removeWasVerified,
    emailWasChanged,
    setEmailHasChanged,
    removeEmailWasChanged,
    updateUser,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!session) return;
    login(session);
  }, []);

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
