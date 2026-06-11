import { persist } from 'zustand/middleware';
import { create } from 'zustand/react';

export const CGM_USER_STATE_STORE = 'cgm-user-state';
export type LocalUserStateStore = {
  wasVerified?: boolean;
  verify: () => void;
  removeVerified: () => void;

  emailWasChanged?: boolean;
  setEmailHasChanged: () => void;
  removeEmailWasChanged: () => void;

  wasDetailsForwarded?: boolean;
  setDetailsForwarded: () => void;
  removeDetailsForwarded: () => void;
};
export const useLocalUserStateStore = create<LocalUserStateStore>()(
  persist(
    (set) => ({
      wasVerified: undefined,
      verify: () => {
        set({ wasVerified: true });
      },
      removeVerified: () => {
        set({ wasVerified: undefined });
      },

      emailWasChanged: undefined,
      setEmailHasChanged: () => {
        set({ emailWasChanged: true });
      },
      removeEmailWasChanged: () => {
        set({ emailWasChanged: undefined });
      },

      wasDetailsForwarded: undefined,
      setDetailsForwarded: () => {
        set({ wasDetailsForwarded: true });
      },
      removeDetailsForwarded: () => {
        set({ wasDetailsForwarded: undefined });
      },
    }),
    {
      name: CGM_USER_STATE_STORE,
    },
  ),
);
