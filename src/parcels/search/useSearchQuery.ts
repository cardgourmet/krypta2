import { useLocation, useNavigate } from '@tanstack/react-router';
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
import type { TcgSearchParams } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type SearchQuery = { query: string; isByUser: boolean };
export type SearchQueryController = {
  currentQuery: SearchQuery;
  setQueryString: (query: string, byUser?: boolean) => void;
  setQueryWrapper: (query: SearchQuery) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  selectionIndex: number;
  setSelectionIndex: (index: number) => void;
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  startSearch: () => void;
};

export function useSearchQuery(
  triggerEnabled: boolean,
  tcg: Tcg,
  close: () => void,
  randomize?: boolean,
): SearchQueryController {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({ query: '', isByUser: false });
  const isCaptain = currentQuery.isByUser;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const navigate = useNavigate();

  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  const startSearch = useCallback(() => {
    close();
    setManualQuery(true);

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: `/$tcg/cards`,
      params: {
        tcg: tcg,
      },
      search: (prev) => {
        return { ...prev, query: currentQuery.query, page: 1, random: randomize } as Required<TcgSearchParams>;
      },
    });
  }, [close, tcg, currentQuery.query, navigate, setManualQuery, randomize]);

  const setQueryWrapper = useCallback(
    ({ query, isByUser }: SearchQuery) => {
      setCurrentQuery({ query, isByUser });

      if (triggerEnabled && searchInputRef.current) {
        searchInputRef.current.focus();

        const length = query.length;
        searchInputRef.current.setSelectionRange(length, length);

        // hacky, I'm so sorry (LG zurück)
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.scrollLeft = searchInputRef.current.scrollWidth;
          }
        }, 10);
      }
    },
    [triggerEnabled],
  );
  const setQueryString = useCallback(
    (newQuery: string, byUser?: boolean) => {
      if (byUser !== undefined) {
        setCurrentQuery({ query: newQuery, isByUser: byUser });
        return;
      }

      if (isCaptain && newQuery.length === 0) {
        setSelectionIndex(0);
        setCurrentQuery({ query: '', isByUser: false });
      } else if (!isCaptain && newQuery.length === 0) {
        setSelectionIndex(0);
        setCurrentQuery({ query: '', isByUser: false });
      } else if (!isCaptain && newQuery.length > 0) {
        setSuggestionIndex(0);
        setCurrentQuery({ query: newQuery, isByUser: true });
      } else if (isCaptain && newQuery.length > 0) {
        setSuggestionIndex(0);
        setCurrentQuery({ query: newQuery, isByUser: true });
      }
    },
    [isCaptain],
  );

  const query = useQueryFromParams();
  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    const isByUser = query.length > 0;

    // user inputted search query already present
    setQueryWrapper({ query: query, isByUser: isByUser });
  }, [query]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (triggerEnabled && event.key === 'Escape') {
        searchInputRef.current?.focus();
        close();
        return;
      }

      if (event.key === 'Enter') {
        if (document.activeElement !== searchInputRef.current) return;
        if (suggestionIndex > 0) return;
        startSearch();
      }
    };

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [suggestionIndex, startSearch, close, triggerEnabled]);

  return {
    currentQuery: currentQuery,
    setQueryString: setQueryString,
    setQueryWrapper: setQueryWrapper,
    inputRef: searchInputRef,
    selectionIndex: selectionIndex,
    setSelectionIndex: setSelectionIndex,
    suggestionIndex: suggestionIndex,
    setSuggestionIndex: setSuggestionIndex,
    startSearch: startSearch,
  };
}

function useQueryFromParams() {
  const location = useLocation();

  const search = location.search as { query: string };
  return search?.query ?? '';
}
