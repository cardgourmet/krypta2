import {createContext, type PropsWithChildren, useContext, useEffect, useState} from 'react';
import {type DataAuthUser, getCurrentLoggedInUser} from '@/parcels/auth/api.ts';
import {useUserSession} from '@/parcels/auth/useUserSession.ts';

export const AuthContext = createContext<DataAuthUser | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }: PropsWithChildren) {
  const { session, setSession } = useUserSession();
  const [loggedInUser, setLoggedInUser] = useState<DataAuthUser | null>(null);

  useEffect(() => {
    if (!session?.sessionToken) {
      setLoggedInUser(null);
      return;
    }

    getCurrentLoggedInUser(session?.sessionToken).then((res) => {
      if (res.error) {
        if (res.statusCode === 401) {
          // not logged in anymore
          setSession(undefined);
          return;
        }

        console.error('Could not find logged in user', res.error);
        return;
      }

      setLoggedInUser(res.data ?? null);
    });
  }, [session, setSession]);

  return <AuthContext.Provider value={loggedInUser}>{children}</AuthContext.Provider>;
}
