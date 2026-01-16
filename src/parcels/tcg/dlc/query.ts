import { useMemo } from 'react';
import { cardAmountDefault, cardDisplayModeDefault, sortDirectionDefault } from '@/parcels/overview/types.ts';
import { sortByDefault } from '@/parcels/tcg/dlc/types.ts';
import { Route } from '@/routes/dlc/cards';

export function useDlcMemoizedQuerySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      query: searchParams.query ?? '',
      page: searchParams.page ?? 1,
      pageSize: searchParams.pageSize ?? cardAmountDefault,
      sortBy: searchParams.sortBy ?? sortByDefault,
      sortDirection: searchParams.sortDirection ?? sortDirectionDefault,
    };
  }, [searchParams]);
}

export function useDlcMemoizedDisplaySettings() {
  const searchParams = Route.useSearch();

  return useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? cardDisplayModeDefault,
    };
  }, [searchParams]);
}
