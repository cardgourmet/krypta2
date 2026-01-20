import type { UseNavigateResult } from '@tanstack/react-router';
import type { RefObject } from 'react';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function handleKeydown({
  tcg,
  searchInputRef,
  isOpened,
  setIsOpened,
  focusableElements,
  currentQuery,
  navigate,
}: {
  tcg: Tcg;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
  focusableElements: Array<HTMLElement | null>;
  currentQuery: string;
  navigate: UseNavigateResult<string>;
}) {
  return (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      searchInputRef.current?.focus();
      setIsOpened(false);
      return;
    }

    if (event.key === 'Tab') {
      const total = focusableElements.length;
      const shift = event.shiftKey;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[total - 1];
      if (firstElement === null || lastElement === null) return;

      if (shift && document.activeElement === firstElement) {
        lastElement.focus();
        return event.preventDefault();
      }
      if (!shift && document.activeElement === lastElement) {
        firstElement.focus();
        return event.preventDefault();
      }
    }

    if (event.key === 'Enter') {
      if (!isOpened && document.activeElement === searchInputRef.current) {
        setIsOpened(true);
      }
      if (isOpened && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setIsOpened(false);

        // noinspection JSIgnoredPromiseFromCall
        navigate({
          to: `/${tcg}/cards`,
          search: (prev) => {
            return { ...prev, query: currentQuery } as Required<DlcSearchParams>;
          },
        });
      }
    }
  };
}
