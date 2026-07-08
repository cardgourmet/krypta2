import { useCallback, useEffect, useEffectEvent, useState } from 'react';
import type { GourmetError } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
import { fetchTcgCards } from '@/parcels/tcg/fetchTcgCards.tsx';
import { fetchTcgSetSummary } from '@/parcels/tcg/fetchTcgSetSummary.tsx';
import type {
  TcgDataSet,
  TcgDataSetSummary,
  TcgSearchCardsResult,
  TcgSearchCardsUser,
  TcgSearchQuerySettings,
  UserSearchCardsDetails,
} from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import { Route } from '@/routes/$tcg/sets/$setCode/$collectorNumber/{-$any}.tsx';

function useCardOverviewData(querySettings: TcgSearchQuerySettings, set?: TcgDataSet | null) {
  const tcg = useTcgByLocation() as Tcg;
  const prevQuerySettings = usePrevious(querySettings);

  const { user } = useAuth();
  const [cards, setCards] = useState<null | TcgSearchCardsResult>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  // true if the user manually send a query (needed for search history)
  const manualQuery = useLocalUserTransientStore((state) => state.manualQuery);
  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  const setWasForwarded = useLocalUserStateStore((state) => state.setDetailsForwarded);
  const removeDetailsForwarded = useLocalUserStateStore((state) => state.removeDetailsForwarded);

  const navigate = Route.useNavigate();
  const history = useSearchHistory(tcg);
  const [searchDetails, setSearchDetails] = useState<UserSearchCardsDetails | undefined>(undefined);
  const onQueryChange = useEffectEvent((query: ExplainSearchQuery) => {
    // only add to local history, when the search has been done manually
    if (manualQuery) {
      history?.addQuery(query);
    }

    setManualQuery(false);
  });
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const onCardsCallback = useCallback(({ data, error }: { data?: TcgSearchCardsUser; error?: GourmetError }) => {
    if (error !== undefined) {
      return;
    }

    const onlyOneCard = data?.items?.length === 1;
    if (onlyOneCard && (user?.settings.search?.forwardToDetailPage ?? true)) {
      const card = data.items[0].card;
      setWasForwarded();

      navigate({
        to: '/$tcg/sets/$setCode/$collectorNumber/{-$any}',
        params: {
          tcg: tcg,
          setCode: card.print.setCode!,
          collectorNumber: card.print.collectorNumber,
        },
        replace: true,
      });
      return;
    }
    removeDetailsForwarded();

    if (data?.details) {
      setSearchDetails(data.details);
    }

    // write to history
    const explainedQuery = data?.details?.explain as ExplainSearchQuery | undefined;
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
        details: {
          explain: data.queryExplanation as ExplainSearchQuery | undefined,
        },
      };
      onCardsCallback({ data: cards as TcgSearchCardsUser, error: error });
    },
    [onCardsCallback],
  );

  const fetchCards = useCallback(
    (controller?: AbortController) => {
      if (querySettings.query !== prevQuerySettings?.query) {
        setIsQueryLoading(true);
      }
      setIsLoading(true);
      if (manualQuery) querySettings.trigger = 'search';

      if (set) {
        const setQuerySettings = {
          ...querySettings,
          query: `set="${set.code}"`,
        };

        fetchTcgSetSummary(tcg, set.id, setQuerySettings, controller)?.then(onSetCardsCallback);
      } else {
        fetchTcgCards(tcg, querySettings, controller, user?.id)?.then((res) => {
          if (res !== null) onCardsCallback(res);
        });
      }
    },
    [querySettings, tcg, set, manualQuery, onCardsCallback, onSetCardsCallback, prevQuerySettings?.query, user?.id],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const controller = new AbortController();
    fetchCards(controller);

    return () => {
      controller.abort();
    };
  }, [querySettings, tcg, set, user?.id]);

  return { cards, isLoading, isQueryLoading, fetchCards, searchDetails };
}

export default useCardOverviewData;
