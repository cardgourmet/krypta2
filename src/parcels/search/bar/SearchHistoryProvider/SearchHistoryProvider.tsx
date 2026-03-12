import {createContext, type ReactNode, useCallback, useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {fetchSearchHistory} from '@/parcels/search/api.ts';
import type {ExplainSearchQuery} from '@/parcels/search/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export const SearchHistoryContext = createContext<SearchHistory | null>(null);

const MAX_HISTORY_SIZE = 10;
const HISTORY_STORAGE_KEY = 'cgm-search-history';

type HistoryByTcg = Record<Tcg, HistoryEntry[]>;
export type HistoryEntry = { id?: string; rawQuery: string; count: number };

export type SearchHistory = {
  pastQueries: HistoryByTcg;
  addQuery: (tcg: Tcg, query: ExplainSearchQuery) => void;
  removeQuery: (tcg: Tcg, index: number) => void;
};

export type TcgSpecificSearchHistory = {
  pastQueries: HistoryEntry[];
  addQuery: (query: ExplainSearchQuery) => void;
  removeQuery: (index: number) => void;
};

export default function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [queriesByTcg, setQueriesByTcg] = useState<HistoryByTcg>(fetchHistoryFromStorage());

  const setQueriesWrapper = useCallback((queries: HistoryByTcg) => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(queries));
    setQueriesByTcg(queries);
  }, []);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!user?.id) return; // e.g., on logout or no user account

    for (const tcg of ['mtg', 'dlc', 'pcg'] as Tcg[]) {
      fetchSearchHistory(user.id, tcg).then(({ data, error }) => {
        if (error) return console.error('error while fetching search history', error);
        if ((data?.length ?? 0) === 0) {
          // we ignore it, maybe the user first created the account now.
          return;
        }

        const entries = [] as HistoryEntry[];
        for (const entry of data?.reverse() ?? []) {
          entries.push({ id: entry.search.id, rawQuery: entry.search.rawQuery, count: entry.totalCount ?? -1 });
        }

        setQueriesWrapper({ ...queriesByTcg, [tcg]: entries });
      });
    }
  }, [user?.id]);

  const addQuery = useCallback(
    (tcg: Tcg, query: ExplainSearchQuery) => {
      // don't allow empty queries in the history
      if (query.originalQuery.length === 0) return;
      const queries = queriesByTcg[tcg] ?? [];

      const lastQuery = queries.length > 0 ? queries[queries.length - 1] : null;
      if (lastQuery !== null && lastQuery.rawQuery === query.originalQuery) return;

      const newQueries = [...queries];
      newQueries.push({ rawQuery: query.originalQuery, count: query.count ?? query.estimatedCount ?? -1 });
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
