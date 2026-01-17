import { useMemo } from 'react';
import { cardDisplayModeDefault } from '@/parcels/overview/types.ts';
import { Route } from '@/routes/pcg/cards';

export function usePcgMemoizedQuerySettings() {
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

export function usePcgMemoizedDisplaySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? cardDisplayModeDefault,
    };
  }, [searchParams.cardDisplayMode]);
}
