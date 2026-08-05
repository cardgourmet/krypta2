import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import type { GourmetError } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MAX_CARD_OVERVIEW_SIZE } from '@/parcels/overview/cards/CardOverview/CardOverview.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
import { fetchTcgCards } from '@/parcels/tcg/fetchTcgCards.tsx';
import { fetchTcgSetSummary } from '@/parcels/tcg/fetchTcgSetSummary.tsx';
import type {
  TcgDataSet,
  TcgDataSetUserSummary,
  TcgSearchCardsUser,
  TcgSearchQuerySettings,
  UserSearchCardsDetails,
} from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import { Route as RouteCards } from '@/routes/$tcg/cards/index.tsx';
import { Route } from '@/routes/$tcg/sets/$setCode/$collectorNumber/{-$any}.tsx';

type CardsMask = {
  printIds: Set<string>;
  details?: UserSearchCardsDetails;
};

function useCardOverviewData(querySettings: TcgSearchQuerySettings, set?: TcgDataSet | null) {
  const tcg = useTcgByLocation() as Tcg;
  const prevQuerySettings = usePrevious(querySettings);

  const { user } = useAuth();
  const [cards, setCards] = useState<null | TcgSearchCardsUser>(null);

  const [isMaskLoading, setIsMaskLoading] = useState(false);
  const [cardsMask, setCardsMask] = useState<CardsMask | undefined>(undefined);
  const maskedCards = useMemo(() => {
    if (!cards || !cardsMask || !set) return cards;

    const filteredItems = cards.items.filter((item) => cardsMask.printIds.has(item.card.print.id));

    const isPaginated = filteredItems.length > MAX_CARD_OVERVIEW_SIZE;
    const lastPage = isPaginated ? Math.ceil(filteredItems.length / MAX_CARD_OVERVIEW_SIZE) : 1;
    const currentPage = Math.min(lastPage, querySettings.page);

    return {
      ...cards,
      currentPage: currentPage,
      hasNextPage: currentPage < lastPage,
      pageCount: lastPage,
      totalItemCount: filteredItems.length,
      items: filteredItems,
      details: cardsMask.details ?? cards.details,
    } as TcgSearchCardsUser;
  }, [cards, cardsMask, querySettings.page, set]);

  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  // true if the user manually send a query (needed for search history)
  const manualQuery = useLocalUserTransientStore((state) => state.manualQuery);
  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  const setWasForwarded = useLocalUserStateStore((state) => state.setDetailsForwarded);
  const removeDetailsForwarded = useLocalUserStateStore((state) => state.removeDetailsForwarded);

  const navigatePrint = Route.useNavigate();
  const navigateCards = RouteCards.useNavigate();
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

      navigatePrint({
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
    setCards(data as TcgSearchCardsUser);

    setIsLoading(false);
    setIsQueryLoading(false);
  }, []);
  const onSetCardsCallback = useCallback(
    ({ data, error }: { data?: TcgDataSetUserSummary; error?: GourmetError }) => {
      if (error) return;
      if (!data || !data?.details?.details?.explain) return;

      if (data?.details?.details) {
        setSearchDetails(data.details.details);
      }

      const searchCards = data.items;

      const isPaginated = searchCards.length > MAX_CARD_OVERVIEW_SIZE;
      const currentPage = data.currentPage;
      const lastPage = isPaginated ? Math.ceil(searchCards.length / MAX_CARD_OVERVIEW_SIZE) : 1;

      const cards = {
        currentPage: currentPage,
        hasNextPage: currentPage < lastPage,
        pageCount: lastPage,
        totalItemCount: searchCards.length,
        items: searchCards,
        details: {
          ...data?.details?.details,
        },
      } as TcgSearchCardsUser;
      onCardsCallback({ data: cards, error: error });
    },
    [onCardsCallback],
  );

  const fetchCards = useCallback(
    (controller?: AbortController) => {
      if (querySettings.query !== prevQuerySettings?.query) {
        setIsQueryLoading(true);
      }
      setIsLoading(true);
      if (querySettings.manual) {
        querySettings.trigger = 'search';
        setManualQuery(true);

        navigateCards({
          to: '/$tcg/cards',
          search: (prev) => ({ ...prev, manual: false }),
          replace: true,
        });
      }
      if (manualQuery) querySettings.trigger = 'search';

      if (set) {
        if (querySettings?.subquery !== prevQuerySettings?.subquery) {
          console.log('subquery changed...');

          if ((querySettings?.subquery?.length ?? 0) === 0) {
            setCardsMask(undefined);
            setIsMaskLoading(false);
          } else {
            // fetch set summary with different query to get print ids
            const setQuerySettings = {
              ...querySettings,
              query: `set="${set.code}" (${querySettings.subquery})`,
            };

            fetchTcgSetSummary(tcg, set.id, setQuerySettings, controller, user?.id)?.then((res) => {
              if (!res?.data) return;

              const maskPrintIds = res.data.items.map((item) => item.card.print.id);
              setCardsMask({
                printIds: new Set(maskPrintIds),
                details: res.data.details?.details ?? undefined,
              });
              setIsMaskLoading(false);
            });
          }
        }

        const alreadyHaveData = (cards?.items?.length ?? 0) > 0;
        const querySettingsChanged = prevQuerySettings?.page !== querySettings.page;

        // if we already have the data, no need to refetch from backend
        // since we always get all cards from a set anyway.
        if (alreadyHaveData && querySettingsChanged) {
          const isPaginated = cards!.items.length > MAX_CARD_OVERVIEW_SIZE;
          const lastPage = isPaginated ? Math.ceil(cards!.items.length / MAX_CARD_OVERVIEW_SIZE) : 1;
          const currentPage = Math.min(lastPage, querySettings.page);

          const newCards = {
            ...cards!,
            currentPage: currentPage,
            hasNextPage: currentPage < lastPage,
            pageCount: lastPage,
          } as TcgSearchCardsUser;
          onCardsCallback({ data: newCards });
          return;
        }

        const setQuerySettings = {
          ...querySettings,
          query: `set="${set.code}"`,
        };

        fetchTcgSetSummary(tcg, set.id, setQuerySettings, controller, user?.id)?.then((res) => {
          if (res !== null) onSetCardsCallback(res);
        });
      } else {
        fetchTcgCards(tcg, querySettings, controller, user?.id)?.then((res) => {
          if (res !== null) onCardsCallback(res);
        });
      }
    },
    [
      querySettings,
      tcg,
      set,
      manualQuery,
      onCardsCallback,
      onSetCardsCallback,
      prevQuerySettings,
      user?.id,
      setManualQuery,
      navigateCards,
      cards,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const controller = new AbortController();
    fetchCards(controller);

    return () => {
      controller.abort();
    };
  }, [querySettings, tcg, set, user?.id]);

  return {
    cards: maskedCards,
    isLoading: isLoading || isMaskLoading,
    isQueryLoading,
    fetchCards,
    searchDetails,
    cardsMask,
    isMaskLoading,
  };
}

export default useCardOverviewData;
