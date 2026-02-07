import { useMemo } from 'react';
import { dlcSearchParamsDefaults } from '@/parcels/tcg/dlc/types.ts';
import { Route } from '@/routes/dlc/cards';

export function useDlcMemoizedQuerySettings() {
  const searchParams = Route.useSearch();

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
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? dlcSearchParamsDefaults.cardDisplayMode,
    };
  }, [searchParams.cardDisplayMode]);
}
