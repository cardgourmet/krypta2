import {useEffect, useEffectEvent, useState} from 'react';
import type {GourmetError} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet, TcgDataSetSummary} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails';
import {useTcgSearchSettings} from '@/parcels/overview/CardOverview/useTcgSearchSettings.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type {ExplainSearchQuery} from '@/parcels/search/types';
import {fetchDlcCards, fetchDlcSetSummary} from '@/parcels/tcg/dlc/api';
import type {DlcSearchQuerySettings, DlcSortBy} from '@/parcels/tcg/dlc/types';
import {fetchMtgCards, fetchMtgSetSummary} from '@/parcels/tcg/mtg/api.ts';
import type {MtgSearchQuerySettings, MtgSortBy} from '@/parcels/tcg/mtg/types';
import {fetchPcgCards, fetchPcgSetSummary} from '@/parcels/tcg/pcg/api';
import type {PcgSearchQuerySettings, PcgSortBy} from '@/parcels/tcg/pcg/types';
import type {TcgSearchCards, TcgSearchCardsResult} from '@/parcels/tcg/types';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import {usePrevious} from '@/parcels/usePrevious.ts';

function useCardOverviewData(set?: TcgDataSet | null) {
  const tcg = useTcgByLocation() as Tcg;
  const { querySettings } = useTcgSearchSettings();
  const prevQuerySettings = usePrevious(querySettings);

  const [cards, setCards] = useState<null | TcgSearchCardsResult>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);

  const history = useSearchHistory(tcg);
  const onQueryChange = useEffectEvent((query: ExplainSearchQuery) => {
    history?.addQuery(query);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    if (querySettings.query !== prevQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    const onCallback = ({ data, error }: { data?: TcgSearchCards; error?: GourmetError }) => {
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
    };
    const onSetCallback = ({ data, error }: { data?: TcgDataSetSummary; error?: GourmetError }) => {
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
      onCallback({ data: cards as TcgSearchCards, error: error });
    };

    if (set) {
      const { uniqueBy, sortBy, sortDirection } = querySettings;

      if (tcg === 'mtg') {
        fetchMtgSetSummary(
          set.id,
          querySettings.query,
          uniqueBy,
          sortBy as MtgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      } else if (tcg === 'pcg') {
        fetchPcgSetSummary(
          set.id,
          querySettings.query,
          uniqueBy,
          sortBy as PcgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      } else {
        fetchDlcSetSummary(
          set.id,
          querySettings.query,
          uniqueBy,
          sortBy as DlcSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      }
    } else {
      if (tcg === 'mtg') {
        fetchMtgCards(querySettings as MtgSearchQuerySettings, controller).then(onCallback);
      } else if (tcg === 'pcg') {
        fetchPcgCards(querySettings as PcgSearchQuerySettings, controller).then(onCallback);
      } else {
        fetchDlcCards(querySettings as DlcSearchQuerySettings, controller).then(onCallback);
      }
    }

    return () => {
      controller.abort();
    };
  }, [querySettings]);

  return { cards, isLoading, isQueryLoading };
}

export default useCardOverviewData;
