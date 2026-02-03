import { useMemo } from 'react';
import { pcgSearchParamsDefaults } from '@/parcels/tcg/pcg/types.ts';
import { Route } from '@/routes/mtg/cards';

export function useMtgMemoizedQuerySettings() {
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

export function useMtgMemoizedDisplaySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? pcgSearchParamsDefaults.cardDisplayMode,
    };
  }, [searchParams.cardDisplayMode]);
}
