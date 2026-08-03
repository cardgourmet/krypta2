import { create } from 'zustand/react';
import { createTcgWorkStore } from '@/parcels/selection/createTcgWorkStore.tsx';
import type { TcgDataSet, TcgSearchDataCard } from '@/parcels/tcg/types.ts';

export const useOverviewWorkStore = createTcgWorkStore<TcgSearchDataCard, { query: string; set?: TcgDataSet }>({
  shouldResetData: (meta0, meta1) => {
    return meta0.other.query !== meta1.other.query;
  },
  selectionLimit: 60,
});

export type OverviewWorkMenuStore = {
  menuOpened: boolean;
  setMenuOpened: (menuOpened: boolean) => void;

  printDetailsId?: string;
  setPrintDetailsId: (id?: string) => void;
};

export const useOverviewWorkMenuStore = create<OverviewWorkMenuStore>((set) => ({
  menuOpened: false,
  setMenuOpened(menuOpened: boolean): void {
    set({ menuOpened: menuOpened });
  },
  printDetailsId: undefined,
  setPrintDetailsId(id?: string) {
    set({ printDetailsId: id });
  },
}));
