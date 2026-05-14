import { useMemo } from 'react';
import { type DlcSearchParams, dlcSearchParamsDefaults } from '@/parcels/tcg/dlc/types.ts';
import { Route } from '@/routes/$tcg/cards';

export function useDlcMemoizedQuerySettings() {
  const searchParams = Route.useSearch() as DlcSearchParams;

  return useMemo(() => {
    return {
      query: searchParams.query,
      page: searchParams.page,
      sortBy: searchParams.sortBy,
      uniqueBy: searchParams.uniqueBy,
      sortDirection: searchParams.sortDirection,
    };
  }, [searchParams.query, searchParams.page, searchParams.uniqueBy, searchParams.sortBy, searchParams.sortDirection]);
}

export function useDlcMemoizedDisplaySettings() {
  const searchParams = Route.useSearch() as DlcSearchParams;

  return useMemo(() => {
    return {
      display: searchParams.display ?? dlcSearchParamsDefaults.display,
    };
  }, [searchParams.display]);
}
