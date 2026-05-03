import {useMemo} from 'react';
import type {MtgSearchParams} from '@/parcels/tcg/mtg/types.ts';
import {pcgSearchParamsDefaults} from '@/parcels/tcg/pcg/types.ts';
import {Route} from '@/routes/$tcg/cards';

export function useMtgMemoizedQuerySettings() {
  const searchParams = Route.useSearch() as MtgSearchParams;

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

export function useMtgMemoizedDisplaySettings() {
  const searchParams = Route.useSearch() as MtgSearchParams;

  return useMemo(() => {
    return {
      display: searchParams.display ?? pcgSearchParamsDefaults.display,
    };
  }, [searchParams.display]);
}
