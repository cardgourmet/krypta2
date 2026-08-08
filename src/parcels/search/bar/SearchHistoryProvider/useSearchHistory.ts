import { useContext, useMemo } from 'react';
import {
  SearchHistoryContext,
  type TcgSpecificSearchHistory,
} from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useSearchHistory(tcg?: Tcg) {
  const searchHistory = useContext(SearchHistoryContext);

  const history = tcg ? searchHistory?.pastQueries[tcg] : undefined;
  const tcgSpecificSearchHistory: TcgSpecificSearchHistory = useMemo(() => {
    return {
      pastQueries: history ?? [],
      addQuery: (query: ExplainSearchQuery) => {
        if (!tcg) return;
        searchHistory?.addQuery(tcg, query);
      },
      removeQuery: (index: number) => {
        if (!tcg) return;
        searchHistory?.removeQuery(tcg, index);
      },
      markQueries: (rawQuery: string, saved: string | undefined) => {
        if (!tcg) return;
        searchHistory?.markQueries(tcg, rawQuery, saved);
      },
    };
  }, [tcg, history, searchHistory?.addQuery, searchHistory?.removeQuery, searchHistory?.markQueries]);

  return tcgSpecificSearchHistory;
}
