import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import type { GourmetError } from '@/parcels/api/handleApiCall.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { fetchTcgCards } from '@/parcels/tcg/fetchTcgCards.tsx';
import { fetchTcgSetSummary } from '@/parcels/tcg/fetchTcgSetSummary.tsx';
import type {
  TcgDataSet,
  TcgDataSetSummary,
  TcgSearchCards,
  TcgSearchCardsResult,
  TcgSearchQuerySettings,
} from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

function useCardOverviewData(querySettings: TcgSearchQuerySettings, set?: TcgDataSet | null) {
  const tcg = useTcgByLocation() as Tcg;
  const prevQuerySettings = usePrevious(querySettings);

  const [cards, setCards] = useState<null | TcgSearchCardsResult>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  const history = useSearchHistory(tcg);
  const onQueryChange = useEffectEvent((query: ExplainSearchQuery) => {
    history?.addQuery(query);
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const onCardsCallback = useCallback(({ data, error }: { data?: TcgSearchCards; error?: GourmetError }) => {
    if (error !== undefined) {
      return;
    }

    // write to history
    const explainedQuery = data?.details as ExplainSearchQuery | undefined;
    if (explainedQuery !== undefined) {
      onQueryChange(explainedQuery);
    }
    setCards({ data: data } as TcgSearchCardsResult);

    setIsLoading(false);
    setIsQueryLoading(false);
  }, []);
  const onSetCardsCallback = useCallback(
    ({ data, error }: { data?: TcgDataSetSummary; error?: GourmetError }) => {
      if (error) return;
      if (!data || !data.queryExplanation) return;

      const searchCards = data.cards;
      const cards = {
        currentPage: 1,
        lastPage: 1,
        hasNextPage: false,
        pageCount: 1,
        totalItemCount: searchCards.length,
        items: searchCards,
        details: data.queryExplanation as ExplainSearchQuery | undefined,
      };
      onCardsCallback({ data: cards as TcgSearchCards, error: error });
    },
    [onCardsCallback],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (querySettings.query !== prevQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    if (set) {
      const setQuerySettings = {
        ...querySettings,
        query: `set="${set.code}"`,
      };

      fetchTcgSetSummary(tcg, set.id, setQuerySettings, controller)?.then(onSetCardsCallback);
    } else {
      fetchTcgCards(tcg, querySettings, controller)?.then(onCardsCallback);
    }

    return () => {
      controller.abort();
    };
  }, [querySettings, tcg, set]);

  return { cards, isLoading, isQueryLoading };
}

export default useCardOverviewData;
