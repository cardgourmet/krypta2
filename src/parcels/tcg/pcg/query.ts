import {useMemo} from 'react';
import {pcgSearchParamsDefaults} from '@/parcels/tcg/pcg/types.ts';
import {Route} from '@/routes/pcg/cards';

export function usePcgMemoizedQuerySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      query: searchParams.query,
      page: searchParams.page,
      uniqueBy: searchParams.uniqueBy,
      sortBy: searchParams.sortBy,
      sortDirection: searchParams.sortDirection,
    };
  }, [searchParams.query, searchParams.page, searchParams.uniqueBy, searchParams.sortBy, searchParams.sortDirection]);
}

export function usePcgMemoizedDisplaySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      display: searchParams.display ?? pcgSearchParamsDefaults.display,
    };
  }, [searchParams.display]);
}
