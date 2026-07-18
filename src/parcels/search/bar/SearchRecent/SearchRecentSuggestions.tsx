import { IconBook2, IconClockHour8 } from '@tabler/icons-react';
import { type RefObject, useEffect, useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { CONTEXT_LIST_NAV, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import type { HistoryEntry } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import SearchRecent from '@/parcels/search/bar/SearchRecent/SearchRecent.tsx';
import type { SearchQuery } from '@/parcels/search/useSearchQuery.ts';
import { useUserRecentSavedSearches } from '@/parcels/search/useUserRecentSavedSearches.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function SearchRecentSuggestions({
  setIsOpened,
  selectionIndex,
  setSelectionIndex,
  setQueryWrapper,
  registerRef,
  searchInputRef,
  searchContainerRef,
  maxEntries,
}: {
  setIsOpened: (setIsOpened: boolean) => void;
  selectionIndex: number;
  setSelectionIndex: (index: number) => void;
  setQueryWrapper: (query: SearchQuery) => void;
  maxEntries: { history: number; saved: number };
} & {
  registerRef?: (el: HTMLElement | null) => void;
  searchContainerRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
}) {
  const { tcg } = useTcg();
  const { user } = useAuth();
  const history = useSearchHistory(tcg);
  const recentQueries = history?.pastQueries ?? [];

  const { savedSearches, refetchSavedSearches } = useUserRecentSavedSearches((s) => s);
  const listResources = useMemo(() => {
    return Object.keys(savedSearches).flatMap((key) => {
      return savedSearches[key as Tcg]?.flatMap((e) => e.listResources ?? []) ?? [];
    });
  }, [savedSearches]);
  useActiveLists(CONTEXT_LIST_NAV, listResources);
  useEffect(() => {
    if (!user?.id) return;

    refetchSavedSearches(user.id, tcg);
  }, [user?.id, tcg, refetchSavedSearches]);
  const recentSavedSearches: HistoryEntry[] = useMemo(() => {
    return (
      savedSearches[tcg]?.map((s) => ({
        id: s.lastSearch?.id ?? s.firstSearch.id,
        rawQuery: s.firstSearch.rawQuery,
        count: s.firstSearch.results,
        saved: s.savedSearch.id,
        at: s.lastSearch?.createdAt ?? s.firstSearch.createdAt,
        executionTime: s.lastSearch?.executionTime ?? s.firstSearch.executionTime,
      })) ?? []
    );
  }, [savedSearches, tcg]);

  const allSuggestions = useMemo(() => {
    const saved = recentSavedSearches.slice(0, maxEntries.saved ?? 5);
    const recent = [...recentQueries].reverse().slice(0, maxEntries.history ?? 5);

    const suggs = [...saved, ...recent];
    suggs.unshift({} as HistoryEntry);
    return suggs;
  }, [recentQueries, recentSavedSearches, maxEntries.history, maxEntries.saved]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!searchContainerRef.current) return;
    // const focusableElements = getFocusableElements(searchContainerRef.current);

    const handle = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (document.activeElement !== searchInputRef.current) return event.preventDefault();

        if (allSuggestions.length === 0) return;
        const arrowUp = event.key === 'ArrowUp';

        let newIndex = arrowUp ? selectionIndex - 1 : selectionIndex + 1;
        if (newIndex < 0) newIndex = allSuggestions.length - 1;
        if (newIndex >= allSuggestions.length) newIndex = 0;
        setSelectionIndex(newIndex);

        return event.preventDefault();
      }
    };

    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, [selectionIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    let currentSugg = { rawQuery: '' } as HistoryEntry;
    if (selectionIndex > 0) {
      // we are selecting entries from saved
      currentSugg = allSuggestions[selectionIndex];
    }
    setQueryWrapper({ query: currentSugg.rawQuery, isByUser: false });
  }, [selectionIndex]);
  const selectionIndexes = useMemo(() => {
    const normalizedSelectionIndex = selectionIndex - 1;
    if (normalizedSelectionIndex < 0) {
      return {
        saved: -1,
        history: -1,
      };
    }

    const savedFrom = 0;
    const savedTo = savedFrom + Math.min(recentSavedSearches.length, maxEntries.saved) - 1;
    const recentFrom = savedTo + 1;
    const recentTo = recentFrom + Math.min(recentQueries.length, maxEntries.history) - 1;

    let savedSelectionIndex = -1;
    if (normalizedSelectionIndex >= savedFrom && normalizedSelectionIndex <= savedTo) {
      savedSelectionIndex = normalizedSelectionIndex; // denormalize (since empty element always in the beginning)
    }

    let recentSelectionIndex = -1;
    if (normalizedSelectionIndex >= recentFrom && normalizedSelectionIndex <= recentTo) {
      recentSelectionIndex = normalizedSelectionIndex - recentFrom;
    }

    return {
      saved: savedSelectionIndex,
      history: recentSelectionIndex,
    };
  }, [maxEntries, recentQueries.length, recentSavedSearches.length, selectionIndex]);

  return (
    <>
      {recentSavedSearches.length > 0 && (
        <SearchRecent
          submenuRef={registerRef}
          recentQueries={recentSavedSearches}
          tPrefix={'saved'}
          icon={<IconBook2 size={16} color={'var(--gourmet-blue-1)'} />}
          maxPerPage={maxEntries.saved}
          tcg={tcg}
          close={() => {
            setIsOpened(false);
          }}
          selectedIndex={selectionIndexes.saved}
          forwardLink={'/me/saved-searches'}
        />
      )}

      {recentQueries.length > 0 && (
        <SearchRecent
          submenuRef={registerRef}
          recentQueries={recentQueries}
          tPrefix={'history'}
          icon={<IconClockHour8 size={16} color={'var(--gourmet-blue-1)'} />}
          maxPerPage={maxEntries.history}
          tcg={tcg}
          close={() => {
            setIsOpened(false);
          }}
          selectedIndex={selectionIndexes.history}
          reversed
          forwardLink={'/me/history'}
        />
      )}
    </>
  );
}
