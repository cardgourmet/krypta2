import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';

export type SearchHistory = {
  pastQueries: string[];
  addQuery: (query: string) => void;
};

export const SearchHistoryContext = createContext<SearchHistory | null>(null);

const MAX_HISTORY_SIZE = 10;

export default function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [queries, setQueries] = useState<string[]>([]);

  const addQuery = useCallback(
    (query: string) => {
      const lastQuery = queries.length > 0 ? queries[queries.length - 1] : null;
      if (lastQuery !== null && lastQuery === query) return;

      const newQueries = [...queries];
      newQueries.push(query);
      if (newQueries.length > MAX_HISTORY_SIZE) {
        newQueries.shift();
      }
      setQueries(newQueries);
    },
    [queries],
  );
  const contextValue: SearchHistory = useMemo(() => {
    return {
      pastQueries: queries,
      addQuery: addQuery,
    };
  }, [queries, addQuery]);

  return <SearchHistoryContext.Provider value={contextValue}>{children}</SearchHistoryContext.Provider>;
}
