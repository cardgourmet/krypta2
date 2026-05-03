import type {UseNavigateResult} from '@tanstack/react-router';
import type {RefObject} from 'react';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function handleKeydown({
  tcg,
  searchInputRef,
  isOpened,
  setIsOpened,
  currentQuery,
  navigate,
  hasActiveSuggestion,
}: {
  tcg: Tcg;
  searchInputRef: RefObject<HTMLInputElement | null>;
  isOpened: boolean;
  setIsOpened: (isOpened: boolean) => void;
  currentQuery: string;
  navigate: UseNavigateResult<string>;
  hasActiveSuggestion: boolean;
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
            return { ...prev, query: currentQuery, page: 1 } as Required<TcgSearchParams>;
          },
        });
      }
    }
  };
}
