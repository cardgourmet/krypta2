import { getRouteApi, type RouteApi, useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

function useTcgSpecificQuery() {
  // ugly
  const location = useLocation();
  let tcg: 'dlc' | 'pcg' | 'mtg' | 'none' = 'none';
  if (location.pathname.startsWith('/dlc/')) {
    tcg = 'dlc';
  } else if (location.pathname.startsWith('/pcg/')) {
    tcg = 'pcg';
  } else if (location.pathname.startsWith('/mtg/')) {
    tcg = 'mtg';
  }

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
