import type {UseNavigateResult} from '@tanstack/react-router';
import {useEffect, useEffectEvent, useRef, useState} from 'react';
import type {GourmetError} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet, TcgDataSetSummary} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {CardOverview} from '@/parcels/overview/CardOverview/CardOverview.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type {ExplainSearchQuery} from '@/parcels/search/types.ts';
import {fetchDlcCards, fetchDlcSetSummary} from '@/parcels/tcg/dlc/api.ts';
import type {DlcSearchParams, DlcSearchQuerySettings, DlcSortBy} from '@/parcels/tcg/dlc/types.ts';
import {fetchMtgCards, fetchMtgSetSummary} from '@/parcels/tcg/mtg/api.ts';
import type {MtgSearchParams, MtgSearchQuerySettings, MtgSortBy} from '@/parcels/tcg/mtg/types.ts';
import {fetchPcgCards, fetchPcgSetSummary} from '@/parcels/tcg/pcg/api.ts';
import type {PcgSearchParams, PcgSearchQuerySettings, PcgSortBy} from '@/parcels/tcg/pcg/types.ts';
import type {TcgSearchCards, TcgSearchCardsResult, TcgSearchDisplaySettings, TcgSearchParams, TcgSearchQuerySettings,} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {usePrevious} from '@/parcels/usePrevious.ts';

export function constructCardOverview(
  searchParams: TcgSearchParams,
  searchQuerySettings: TcgSearchQuerySettings,
  searchDisplaySettings: TcgSearchDisplaySettings,
  navigate: UseNavigateResult<'/$tcg/cards'>,
  set?: TcgDataSet | null,
) {
  const tcg = useTcgByLocation() as Tcg;
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const [cards, setCards] = useState<null | TcgSearchCardsResult>(null);

  const history = useSearchHistory(tcg);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettings = (apply: ApplyFn<MtgSearchParams | PcgSearchParams | DlcSearchParams>) => {
    const newParams = apply(searchParams) as Required<MtgSearchParams>;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      params: {
        tcg: tcg,
      },
      replace: true,
    });
  };

  const onQueryChange = useEffectEvent((query: ExplainSearchQuery) => {
    history?.addQuery(query);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    if (searchQuerySettings.query !== prevSearchQuerySettings?.query) {
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
      const { uniqueBy, sortBy, sortDirection } = searchQuerySettings;

      if (tcg === 'mtg') {
        fetchMtgSetSummary(
          set.id,
          searchQuerySettings.query,
          uniqueBy,
          sortBy as MtgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      } else if (tcg === 'pcg') {
        fetchPcgSetSummary(
          set.id,
          searchQuerySettings.query,
          uniqueBy,
          sortBy as PcgSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      } else {
        fetchDlcSetSummary(
          set.id,
          searchQuerySettings.query,
          uniqueBy,
          sortBy as DlcSortBy,
          sortDirection === 'auto' ? 'asc' : sortDirection,
          controller,
        ).then(onSetCallback);
      }
    } else {
      if (tcg === 'mtg') {
        fetchMtgCards(searchQuerySettings as MtgSearchQuerySettings, controller).then(onCallback);
      } else if (tcg === 'pcg') {
        fetchPcgCards(searchQuerySettings as PcgSearchQuerySettings, controller).then(onCallback);
      } else {
        fetchDlcCards(searchQuerySettings as DlcSearchQuerySettings, controller).then(onCallback);
      }
    }

    return () => {
      controller.abort();
    };
  }, [searchQuerySettings]);

  return (
    <>
      <title>{`${(searchParams.query?.length ?? 0) === 0 ? 'Card Database' : searchParams.query} 
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      <CardOverview
        tcg={tcg}
        scrollbackRef={scrollBackRef}
        isLoading={isLoading}
        isQueryLoading={isQueryLoading}
        set={set ?? null}
        cards={cards}
        setSettings={setSettings}
        searchQuerySettings={searchQuerySettings}
        searchDisplaySettings={searchDisplaySettings}
      />
    </>
  );
}

export function getSetSpecificQuery(query: string): string | null {
  if (!query) return null;
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes(' or ')) return null;

  const allowedFilters = ['set', 'setcode', 'setname'];
  let allowed = false;
  for (const allowedFilter of allowedFilters) {
    if (lowerQuery.startsWith(allowedFilter)) {
      allowed = true;
      break;
    }
  }
  if (!allowed) return null;

  const spl = lowerQuery.split(/[:=]/);
  if (spl.length !== 2) return null;

  let value = spl[1];
  if (value.startsWith('"')) value = value.substring(1);
  if (value.endsWith('"')) value = value.substring(0, value.length - 1);
  return value.trim();
}
