import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const SearchHistoryContext = createContext<SearchHistory | null>(null);

const MAX_HISTORY_SIZE = 10;
const HISTORY_STORAGE_KEY = 'search-history';

type HistoryByTcg = Record<Tcg, string[]>;

export type SearchHistory = {
  pastQueries: HistoryByTcg;
  addQuery: (tcg: Tcg, query: string) => void;
  removeQuery: (tcg: Tcg, index: number) => void;
};

export type TcgSpecificSearchHistory = {
  pastQueries: string[];
  addQuery: (query: string) => void;
  removeQuery: (index: number) => void;
};

export default function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [queriesByTcg, setQueriesByTcg] = useState<HistoryByTcg>(fetchHistoryFromStorage());

  const setQueriesWrapper = useCallback((queries: HistoryByTcg) => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(queries));
    setQueriesByTcg(queries);
  }, []);

  const addQuery = useCallback(
    (tcg: Tcg, query: string) => {
      // don't allow empty queries in the history
      if (query.length === 0) return;
      const queries = queriesByTcg[tcg] ?? [];

      const lastQuery = queries.length > 0 ? queries[queries.length - 1] : null;
      if (lastQuery !== null && lastQuery === query) return;

      const newQueries = [...queries];
      newQueries.push(query);
      if (newQueries.length > MAX_HISTORY_SIZE) {
        newQueries.shift();
      }

      const newQueriesByTcg = { ...queriesByTcg };
      newQueriesByTcg[tcg] = newQueries;
      setQueriesWrapper(newQueriesByTcg);
    },
    [queriesByTcg, setQueriesWrapper],
  );
  const removeQuery = useCallback(
    (tcg: Tcg, index: number) => {
      const queries = queriesByTcg[tcg] ?? [];

      if (queries.length === 0) return;
      if (index < 0 || index >= queries.length) return;

      const newQueries = [...queries];
      newQueries.splice(index, 1);

      const newQueriesByTcg = { ...queriesByTcg };
      newQueriesByTcg[tcg] = newQueries;
      setQueriesWrapper(newQueriesByTcg);
    },
    [queriesByTcg, setQueriesWrapper],
  );

  const contextValue: SearchHistory = useMemo(() => {
    return {
      pastQueries: queriesByTcg,
      addQuery: addQuery,
      removeQuery: removeQuery,
    };
  }, [queriesByTcg, addQuery, removeQuery]);

  return <SearchHistoryContext.Provider value={contextValue}>{children}</SearchHistoryContext.Provider>;
}

function fetchHistoryFromStorage(): HistoryByTcg {
  const storage = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (storage == null) return {} as HistoryByTcg;

  return JSON.parse(storage) as HistoryByTcg;
}

export function useSearchHistory(tcg: Tcg) {
  const searchHistory = useContext(SearchHistoryContext);

  const history = searchHistory?.pastQueries[tcg];
  const tcgSpecificSearchHistory: TcgSpecificSearchHistory = useMemo(() => {
    return {
      pastQueries: history ?? [],
      addQuery: (query: string) => {
        searchHistory?.addQuery(tcg, query);
      },
      removeQuery: (index: number) => {
        searchHistory?.removeQuery(tcg, index);
      },
    };
  }, [tcg, history, searchHistory?.addQuery, searchHistory?.removeQuery]);

  return tcgSpecificSearchHistory;
}
