import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

export type SearchQuery = { query: string; isByUser: boolean };

export function useSearchQuery() {
  const [currentQuery, setCurrentQuery] = useState<SearchQuery>({ query: '', isByUser: false });

  const query = useTcgSpecificQuery();
  const wrapSetCurrentQuery = useCallback((query: SearchQuery) => {
    setCurrentQuery(query);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (query.length === 0) return;

    // user inputted search query already present
    wrapSetCurrentQuery({ query: query, isByUser: true });
  }, [query]);

  return [currentQuery, wrapSetCurrentQuery] as const;
}

function useTcgSpecificQuery() {
  const location = useLocation();

  const search = location.search as { query: string };
  return search?.query ?? '';
}
