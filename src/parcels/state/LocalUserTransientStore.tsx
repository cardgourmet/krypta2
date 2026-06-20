import { create } from 'zustand/react';

export type LocalUserTransientStore = {
  manualQuery: boolean;
  setManualQuery(manualQuery: boolean): void;
};

export const useLocalUserTransientStore = create<LocalUserTransientStore>((set) => ({
  manualQuery: false,
  setManualQuery(manualQuery: boolean) {
    set({ manualQuery: manualQuery });
  },
}));
