import {useNavigate} from '@tanstack/react-router';
import {useEffect, useMemo} from 'react';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type {TcgSearchDisplaySettings, TcgSearchQuerySettings} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import {Route} from '@/routes/$tcg/cards';

export function useTcgSearchSettings(set?: TcgDataSet) {
  const tcg = useTcgByLocation() as Tcg;
  const search = Route.useSearch();

  const navigate = useNavigate({ from: Route.fullPath });
  useEffect(() => {
    if (!set) return;

    navigate({
      search: (prev) => ({ ...prev, sortBy: 'set', uniqueBy: 'prints' }),
      params: {
        tcg: tcg,
      },
      replace: true,
    });
  }, [set, navigate, tcg]);

  const searchQuerySettings = useMemo(() => {
    return {
      query: search.query,
      sortBy: search.sortBy,
      sortDirection: search.sortDirection,
      uniqueBy: search.uniqueBy,
    } as TcgSearchQuerySettings;
  }, [search.query, search.sortBy, search.sortDirection, search.uniqueBy]);
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
