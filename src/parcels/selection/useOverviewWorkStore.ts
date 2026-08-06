import { create } from 'zustand/react';
import { createTcgWorkStore } from '@/parcels/selection/createTcgWorkStore.tsx';
import type { TcgDataSet, TcgSearchDataCard, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const useOverviewWorkStore = createTcgWorkStore<
  TcgSearchDataCard,
  { tcg: Tcg; querySettings: TcgSearchQuerySettings; set?: TcgDataSet; maxPage: number }
>({
  shouldResetData: (meta0, meta1) => {
    return meta0.other.querySettings.query !== meta1.other.querySettings.query;
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
