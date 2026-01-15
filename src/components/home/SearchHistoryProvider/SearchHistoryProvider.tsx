import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export const SearchHistoryContext = createContext<SearchHistory | null>(null);

const MAX_HISTORY_SIZE = 10;
const HISTORY_STORAGE_KEY = 'search-history';

function fetchHistoryFromStorage(): string[] {
  const storage = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (storage == null) return [];

  return JSON.parse(storage) as string[];
}

export function useSearchHistory() {
  return useContext(SearchHistoryContext);
}

export type SearchHistory = {
  pastQueries: string[];
  addQuery: (query: string) => void;
  removeQuery: (index: number) => void;
};

export default function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<string[]>(fetchHistoryFromStorage());

  const setQueriesWrapper = useCallback((queries: string[]) => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(queries));

    setQueries(queries);
  }, []);

  const addQuery = useCallback(
    (query: string) => {
      const lastQuery = queries.length > 0 ? queries[queries.length - 1] : null;
      if (lastQuery !== null && lastQuery === query) return;

      const newQueries = [...queries];
      newQueries.push(query);
      if (newQueries.length > MAX_HISTORY_SIZE) {
        newQueries.shift();
      }
      setQueriesWrapper(newQueries);
    },
    [queries, setQueriesWrapper],
  );
  const removeQuery = useCallback(
    (index: number) => {
      if (queries.length === 0) return;
      if (index < 0 || index >= queries.length) return;

      const newQueries = [...queries];
      newQueries.splice(index, 1);
      setQueriesWrapper(newQueries);
    },
    [queries, setQueriesWrapper],
  );

  const contextValue: SearchHistory = useMemo(() => {
    return {
      pastQueries: queries,
      addQuery: addQuery,
      removeQuery: removeQuery,
    };
  }, [queries, addQuery, removeQuery]);

  return <SearchHistoryContext.Provider value={contextValue}>{children}</SearchHistoryContext.Provider>;
}
