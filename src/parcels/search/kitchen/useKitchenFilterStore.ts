import { create } from 'zustand/react';

export type KitchenFilterStore = {
  constructedQueryFilters: string[];
  setConstructedQueryFilters: (filters: string[]) => void;
};
export const useKitchenFilterStore = create<KitchenFilterStore>((set) => ({
  constructedQueryFilters: [],
  setConstructedQueryFilters: (filters: string[]) => {
    set((state) => {
      return { ...state, constructedQueryFilters: filters };
    });
  },
}));
