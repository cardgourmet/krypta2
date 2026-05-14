import { useEffect } from 'react';
import { useFilterCacheStore } from '@/parcels/search/filter/FilterCacheStore.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useFilters(tcg: Tcg) {
  const filters = useFilterCacheStore((state) => state.filters[tcg]);
  const loadFilters = useFilterCacheStore((state) => state.loadFilters);

  useEffect(() => {
    loadFilters(tcg);
  }, [tcg, loadFilters]);

  return filters;
}
