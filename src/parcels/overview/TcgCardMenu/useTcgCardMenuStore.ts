import {create} from 'zustand/react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';

export type MenuControls<T> = {
  opened: boolean;
  data: T | null;
  target: HTMLButtonElement | null;

  openMenu: (data: T, target: HTMLButtonElement) => void;
  closeMenu: () => void;
};

export const useCardMenuStore = create<MenuControls<TcgDataCard>>((set, get) => ({
  opened: false,
  data: null,
  target: null,

  openMenu: (data, target) => {
    const prevData = get().data;
    if (prevData !== null) {
      if (prevData.print.id === data.print.id) {
        return set({
          opened: false,
          data: null,
          target: null,
        });
      }
    }

    return set({
      opened: true,
      data,
      target,
    });
  },

  closeMenu: () =>
    set({
      opened: false,
      data: null,
      target: null,
    }),
}));
