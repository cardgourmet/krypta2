import {createContext, useContext} from 'react';
import type {AuthApiUserIntegration, DataAuthUser} from '@/parcels/auth/api.ts';

export const AuthContext = createContext<AuthData | null>(null);

export type UserSession = { token: string; expiresAt?: string };
export type AuthData = {
  user?: DataAuthUser;
  token?: string;
  login: (data: Partial<UserSession> & { user?: DataAuthUser }) => void;
  logout: () => void;
  wasVerified: boolean;
  verify: () => void;
  removeVerified: () => void;

  emailWasChanged: boolean;
  setEmailHasChanged: () => void;
  removeEmailWasChanged: () => void;

  updateUser: (user: DataAuthUser) => void;
  loadIntegrations: () => void;
  integrations: AuthApiUserIntegration[] | null;
};

export function useAuth(): AuthData {
  return useContext(AuthContext) as AuthData;
}
