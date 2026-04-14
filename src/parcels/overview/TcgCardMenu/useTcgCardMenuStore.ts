import {create} from 'zustand/react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type {MenuControls} from '@/parcels/overview/TcgCardMenu/useTcgCardMenuControls.ts';

export const useCardMenuStore = create<MenuControls<TcgDataCard>>((set) => ({
  opened: false,
  data: null,
  target: null,

  openMenu: (data, target) =>
    set({
      opened: true,
      data,
      target,
    }),

  closeMenu: () =>
    set({
      opened: false,
      data: null,
      target: null,
    }),
}));
