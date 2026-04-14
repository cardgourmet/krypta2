import {useCallback, useMemo, useRef, useState} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';

export function useTcgCardMenuControls() {
  const compare = useCallback((a: TcgDataCard, b: TcgDataCard) => {
    return a.print.id === b.print.id;
  }, []);
  return useMenuControls(compare);
}

export type MenuControls<T> = {
  opened: boolean;
  data: T | null;
  target: HTMLButtonElement | null;

  openMenu: (data: T, target: HTMLButtonElement) => void;
  closeMenu: () => void;
};

export function useMenuControls<T>(compare?: (a: T, b: T) => boolean) {
  const [opened, setOpened] = useState(false);

  const menuRef = useRef<{
    data: T | null;
    target: HTMLButtonElement | null;
    opened: boolean | null;
  }>({
    data: null,
    target: null,
    opened: null,
  });
  const closeMenu = useCallback(() => {
    menuRef.current = {
      data: null,
      opened: false,
      target: null,
    };
    setOpened(false);
  }, []);
  const openMenu = useCallback(
    (data: T, target: HTMLButtonElement) => {
      let isEquals = false;
      if (menuRef.current.data !== null) {
        if (compare !== undefined) {
          isEquals = compare(data, menuRef.current.data);
        } else {
          isEquals = data === menuRef.current.data;
        }
      }
      if (menuRef.current.opened && isEquals) {
        closeMenu();
        return;
      }

      menuRef.current = {
        data: data,
        target: target,
        opened: true,
      };
      setOpened(true);
    },
    [closeMenu, compare],
  );

  return useMemo(() => {
    return {
      opened,
      data: menuRef.current.data,
      target: menuRef.current.target,
      openMenu,
      closeMenu,
    } as MenuControls<T>;
  }, [opened, openMenu, closeMenu]);
}
