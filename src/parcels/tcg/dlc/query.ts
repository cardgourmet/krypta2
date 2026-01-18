import { useMemo } from 'react';
import { dlcSearchParamsDefaults } from '@/parcels/tcg/dlc/types.ts';
import { Route } from '@/routes/dlc/cards';

export function useDlcMemoizedQuerySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      query: searchParams.query,
      page: searchParams.page,
      pageSize: searchParams.pageSize,
      sortBy: searchParams.sortBy,
      sortDirection: searchParams.sortDirection,
    };
  }, [searchParams.query, searchParams.page, searchParams.pageSize, searchParams.sortBy, searchParams.sortDirection]);
}

export function useDlcMemoizedDisplaySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? dlcSearchParamsDefaults.cardDisplayMode,
    };
  }, [searchParams.cardDisplayMode]);
}
