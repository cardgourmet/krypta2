import type { UseNavigateResult } from '@tanstack/react-router';
import type { RefObject } from 'react';
import { type TcgSearchParams, tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function handleKeydown({
  tcg,
  searchInputRef,
  isOpened,
  setIsOpened,
  currentQuery,
  navigate,
  hasActiveSuggestion,
  locationHref,
}: {
  tcg: Tcg;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
  currentQuery: string;
  navigate: UseNavigateResult<string>;
  hasActiveSuggestion: boolean;
  locationHref: string;
}) {
  return (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      searchInputRef.current?.focus();
      setIsOpened(false);
      return;
    }

    if (event.key === 'Enter') {
      if (!isOpened && document.activeElement === searchInputRef.current) {
        setIsOpened(true);
      }
      if (isOpened && document.activeElement === searchInputRef.current) {
        if (hasActiveSuggestion) return;

        searchInputRef.current?.blur();
        setIsOpened(false);

        // noinspection JSIgnoredPromiseFromCall
        navigate({
          to: `/$tcg/cards`,
          params: {
            tcg: tcg,
          },
          search: (prev) => {
            if (locationHref.startsWith(`/${tcg}/cards`)) {
              return { ...prev, query: currentQuery, page: 1 } as Required<TcgSearchParams>;
            }
            return { ...tcgSearchParamsDefaults, query: currentQuery, page: 1 } as Required<TcgSearchParams>;
          },
        });
      }
    }
  };
}
