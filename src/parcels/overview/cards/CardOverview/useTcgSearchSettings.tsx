import { useMemo } from 'react';
import type { TcgSearchDisplaySettings, TcgSearchParams, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';

export function useTcgSearchSettings(search: TcgSearchParams) {
  const searchQuerySettings = useMemo(() => {
    const uniqueByFromQuery = search.query?.match(/unique:(\w*?)(\s|$)/)?.[1];
    const sortByFromQuery = search.query?.match(/order:(\w*?)(\s|$)/)?.[1];
    const sortDirectionFromQuery = search.query?.match(/direction:(\w*?)(\s|$)/)?.[1];

    return {
      page: search.page,
      query: search.query,
      sortBy: sortByFromQuery || search.sortBy,
      sortDirection: sortDirectionFromQuery || search.sortDirection,
      uniqueBy: uniqueByFromQuery || search.uniqueBy,
      random: search.random,
      manual: search.manual,
      subquery: search.subquery,
    } as TcgSearchQuerySettings;
  }, [
    search.query,
    search.sortBy,
    search.sortDirection,
    search.uniqueBy,
    search.page,
    search.random,
    search.manual,
    search.subquery,
  ]);
  const searchDisplaySettings = useMemo(() => {
    return {
      display: search.display,
    } as TcgSearchDisplaySettings;
  }, [search.display]);

  return {
    params: search,
    querySettings: searchQuerySettings,
    displaySettings: searchDisplaySettings,
  };
}
