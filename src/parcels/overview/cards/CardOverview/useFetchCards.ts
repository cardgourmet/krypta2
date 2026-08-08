import { useCallback } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MAX_CARD_OVERVIEW_SIZE } from '@/parcels/overview/cards/CardOverview/CardOverview.tsx';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
import { fetchTcgCards } from '@/parcels/tcg/fetchTcgCards.tsx';
import { fetchTcgSetSummary } from '@/parcels/tcg/fetchTcgSetSummary.tsx';
import type {
  TcgDataSet,
  TcgSearchCardsUser,
  TcgSearchQuerySettings,
  UserSearchCardsDetails,
} from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import { Route as RouteCards } from '@/routes/$tcg/cards';

export type CardsMask = {
  printIds: Set<string>;
  details?: UserSearchCardsDetails;
};

export function useFetchCards({
  querySettings,
  set,
  cards,
  onCardsCallback,
  onSetCardsCallback,
  onCardsMaskCallback,
  setIsQueryLoading,
  setIsLoading,
}: {
  querySettings?: TcgSearchQuerySettings;
  set?: TcgDataSet | null;
  cards?: TcgSearchCardsUser | null;
  onCardsCallback: (res: NonNullable<Awaited<ReturnType<typeof fetchTcgCards>>>) => void;
  onSetCardsCallback: (res: NonNullable<Awaited<ReturnType<typeof fetchTcgSetSummary>>>) => void;
  onCardsMaskCallback: (res: CardsMask | undefined) => void;
  setIsQueryLoading: (b: boolean) => void;
  setIsLoading: (b: boolean) => void;
}) {
  const tcg = useTcgByLocation() as Tcg;
  const { user } = useAuth();
  const prevQuerySettings = usePrevious(querySettings);

  // true if the user manually send a query (needed for search history)
  const manualQuery = useLocalUserTransientStore((state) => state.manualQuery);
  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  const navigateCards = RouteCards.useNavigate();

  return useCallback(
    (controller?: AbortController) => {
      if (!querySettings) return;
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
          if ((querySettings?.subquery?.length ?? 0) === 0) {
            onCardsMaskCallback(undefined);
          } else {
            // fetch set summary with different query to get print ids
            const setQuerySettings = {
              ...querySettings,
              query: `set="${set.code}" (${querySettings.subquery})`,
            };

            fetchTcgSetSummary(tcg, set.id, setQuerySettings, controller, user?.id)?.then((res) => {
              if (!res?.data) return;

              const maskPrintIds = res.data.items.map((item) => item.card.print.id);

              onCardsMaskCallback({
                printIds: new Set(maskPrintIds),
                details: res.data.details?.details ?? undefined,
              });
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
      onCardsMaskCallback,
      setIsLoading,
      setIsQueryLoading,
    ],
  );
}
