import { persist } from 'zustand/middleware';
import { create } from 'zustand/react';
import type { UserSession } from '@/parcels/auth/AuthContext.ts';
import type { AuthApiUserIntegration, DataAuthUser } from '@/parcels/auth/api.ts';

export const CGM_USER_STORE = 'cgm-user';
export type LocalUserStore = {
  user?: DataAuthUser;
  setUser: (user?: DataAuthUser) => void;

  session?: UserSession;
  setSession: (session?: UserSession) => void;

  token?: string;
  setToken: (token?: string) => void;

  integrations?: AuthApiUserIntegration[];
  setIntegrations: (integrations?: AuthApiUserIntegration[]) => void;
};
export const useLocalUserStore = create<LocalUserStore>()(
  persist(
    (set) => ({
      setUser: (user?: DataAuthUser) => {
        set({ user: user });
      },
      setSession: (session?: UserSession) => {
        set({ session: session });
      },
      setToken: (token?: string) => {
        set({ token: token });
      },
      setIntegrations: (integrations?: AuthApiUserIntegration[]) => {
        set({ integrations });
      },
    }),
    {
      name: CGM_USER_STORE,
    },
  ),
);
