import {useLocation, useNavigate} from '@tanstack/react-router';
import {type RefObject, useCallback, useEffect, useRef, useState} from 'react';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export type SearchQuery = { query: string; isByUser: boolean };
export type SearchQueryController = {
  currentQuery: SearchQuery;
  setCurrentQuery: (query: string, byUser?: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  suggestionIndex: number;
  setSuggestionIndex: (index: number) => void;
  startSearch: () => void;
};

export function useSearchQueryV2(triggerEnabled: boolean, tcg: Tcg, close: () => void): SearchQueryController {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({ query: '', isByUser: false });
  const isCaptain = currentQuery.isByUser;
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const navigate = useNavigate();

  const startSearch = useCallback(() => {
    close();

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: `/$tcg/cards`,
      params: {
        tcg: tcg,
      },
      search: (prev) => {
        return { ...prev, query: currentQuery.query, page: 1 } as Required<TcgSearchParams>;
      },
    });
  }, [
    close,
    tcg,
    currentQuery.query, // noinspection JSIgnoredPromiseFromCall
    navigate,
  ]);

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
        setHistoryIndex(0);
        setCurrentQuery({ query: '', isByUser: false });
      } else if (!isCaptain && newQuery.length === 0) {
        setHistoryIndex(0);
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
  }, [suggestionIndex, startSearch]);

  return {
    currentQuery: currentQuery,
    setCurrentQuery: setQueryString,
    inputRef: searchInputRef,
    historyIndex: historyIndex,
    setHistoryIndex: setHistoryIndex,
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
