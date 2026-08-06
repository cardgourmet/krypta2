import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import type { GourmetError } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MAX_CARD_OVERVIEW_SIZE } from '@/parcels/overview/cards/CardOverview/CardOverview.tsx';
import { useFetchCards } from '@/parcels/overview/cards/CardOverview/useFetchCards.ts';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
import type {
  TcgDataSet,
  TcgDataSetUserSummary,
  TcgSearchCardsUser,
  TcgSearchQuerySettings,
  UserSearchCardsDetails,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/$tcg/sets/$setCode/$collectorNumber/{-$any}.tsx';

type CardsMask = {
  printIds: Set<string>;
  details?: UserSearchCardsDetails;
};

function useCardOverviewData(tcg?: Tcg, querySettings?: TcgSearchQuerySettings, set?: TcgDataSet | null) {
  const { user } = useAuth();
  const [cards, setCards] = useState<null | TcgSearchCardsUser>(null);

  const [isMaskLoading, setIsMaskLoading] = useState(false);
  const [cardsMask, setCardsMask] = useState<CardsMask | undefined>(undefined);
  const maskedCards = useMemo(() => {
    if (!querySettings?.page) return cards;
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
  }, [cards, cardsMask, querySettings?.page, set]);
  const slicedCards = useMemo(() => {
    if (set === undefined) return maskedCards;

    const currentPage = maskedCards?.currentPage ?? 1;
    const startIndex = (currentPage - 1) * MAX_CARD_OVERVIEW_SIZE;
    const endIndex = currentPage * MAX_CARD_OVERVIEW_SIZE;

    return {
      ...maskedCards,
      items: maskedCards?.items?.slice(startIndex, endIndex),
    } as TcgSearchCardsUser;
  }, [maskedCards, set]);

  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  // true if the user manually send a query (needed for search history)
  const manualQuery = useLocalUserTransientStore((state) => state.manualQuery);
  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  const setWasForwarded = useLocalUserStateStore((state) => state.setDetailsForwarded);
  const removeDetailsForwarded = useLocalUserStateStore((state) => state.removeDetailsForwarded);

  const navigatePrint = Route.useNavigate();
  const history = useSearchHistory(tcg);
  const [searchDetails, setSearchDetails] = useState<UserSearchCardsDetails | undefined>(undefined);
  const activeSearchDetails = useMemo(() => {
    if (cardsMask?.details?.explain) return cardsMask.details;
    return searchDetails;
  }, [cardsMask?.details, searchDetails]);

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
  const onCardsMaskCallback = useCallback((res: CardsMask | undefined) => {
    setCardsMask(res);
    setIsMaskLoading(false);
  }, []);

  const fetchCards = useFetchCards({
    querySettings,
    set,
    cards,
    onCardsCallback,
    onSetCardsCallback,
    onCardsMaskCallback,
    setIsQueryLoading,
    setIsLoading,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    const controller = new AbortController();
    fetchCards(controller);

    return () => {
      controller.abort();
    };
  }, [querySettings, tcg, set?.id, user?.id]);

  return {
    cards: slicedCards,
    isLoading: isLoading || isMaskLoading,
    isQueryLoading,
    fetchCards,
    searchDetails,
    activeSearchDetails,
    cardsMask,
    isMaskLoading,
  };
}

export default useCardOverviewData;
