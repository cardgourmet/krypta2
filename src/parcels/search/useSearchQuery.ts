import { getRouteApi, type RouteApi } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTcg } from '@/parcels/tcg/useTcg.ts';

export type SearchQuery = { query: string; isByUser: boolean };

export function useSearchQuery() {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({ query: '', isByUser: false });

  const query = useTcgSpecificQuery();
  const wrapSetCurrentQuery = useCallback((query: SearchQuery) => {
    setCurrentQuery(query);
  }, []);

  useEffect(() => {
    const searchParamsQuery = query ?? '';
    if (searchParamsQuery.length === 0) return;

    // user inputted search query already present
    wrapSetCurrentQuery({ query: query ?? '', isByUser: true });
  }, [query, wrapSetCurrentQuery]);

  return [currentQuery, wrapSetCurrentQuery] as const;
}

function useTcgSpecificQuery() {
  // ugly
  const tcg = useTcg();
  let routeApi: RouteApi<unknown> | undefined;
  switch (tcg) {
    case 'dlc':
      routeApi = getRouteApi('/dlc/cards/');
      break;
    case 'pcg':
      break;
    case 'mtg':
      break;
  }

  const search = routeApi?.useSearch() as { query: string };
  return search.query;
}
