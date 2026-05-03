import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

export type SearchQuery = { query: string; isByUser: boolean };

export function useSearchQuery() {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({ query: '', isByUser: false });

  const wrapSetCurrentQuery = useCallback((query: SearchQuery) => {
    setCurrentQuery(query);
  }, []);

  const query = useTcgSpecificQuery();
  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    const isByUser = query.length > 0;

    // user inputted search query already present
    wrapSetCurrentQuery({ query: query, isByUser: isByUser });
  }, [query]);

  return [currentQuery, wrapSetCurrentQuery] as const;
}

function useTcgSpecificQuery() {
  const location = useLocation();

  const search = location.search as { query: string };
  return search?.query ?? '';
}
