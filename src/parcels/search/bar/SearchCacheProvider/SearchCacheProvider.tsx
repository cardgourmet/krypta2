import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import type {
  SearchFilterStore,
  SearchFilterValueStore,
} from '@/parcels/search/bar/SearchCompletion/generateCompletions.ts';
import { fetchDlcFilters } from '@/parcels/tcg/dlc/api.ts';
import { fetchPcgFilters } from '@/parcels/tcg/pcg/api.ts';
import { useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

export const SearchCacheContext = createContext<SearchCache | null>(null);

type SearchCache = {
  filter: SearchFilterStore;
  values: SearchFilterValueStore;
};

export default function SearchCacheProvider({ children }: { children: ReactNode }) {
  const tcg = useTcgByLocation() || 'dlc';
  const filterStore = useRef<SearchFilterStore>({} as SearchFilterStore);
  const filterValueStore = useRef<SearchFilterValueStore>({} as SearchFilterValueStore);

  useEffect(() => {
    const controller = new AbortController();
    if (filterStore.current[tcg]?.length > 0) return;

    if (tcg === 'pcg') {
      fetchPcgFilters(controller).then(({ data, error }) => {
        if (error !== undefined) {
          // non 200 status basically
          return;
        }
        filterStore.current[tcg] = data ?? [];
      });
    } else if (tcg === 'dlc') {
      fetchDlcFilters(controller).then(({ data, error }) => {
        if (error !== undefined) {
          // non 200 status basically
          return;
        }
        filterStore.current[tcg] = data ?? [];
      });
    } else if (tcg === 'mtg') {
    }

    return () => {
      controller.abort();
    };
  }, [tcg]);

  const cache: SearchCache = useMemo(() => {
    return { filter: filterStore.current, values: filterValueStore.current };
  }, []);
  return <SearchCacheContext.Provider value={cache}>{children}</SearchCacheContext.Provider>;
}

export function useSearchCache() {
  const context = useContext(SearchCacheContext);
  if (!context) throw new Error('useSearchCache must be used within <SearchCacheProvider>');

  return { filter: context.filter, values: context.values };
}
