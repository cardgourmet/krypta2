import type {UseNavigateResult} from '@tanstack/react-router';
import {useEffect, useEffectEvent, useRef, useState} from 'react';
import type {GourmetError} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {CardOverview} from '@/parcels/overview/CardOverview/CardOverview.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type {ExplainSearchQuery} from '@/parcels/search/types.ts';
import {fetchDlcCards, fetchDlcSet} from '@/parcels/tcg/dlc/api.ts';
import type {DlcSearchDisplaySettings, DlcSearchParams, DlcSearchQuerySettings} from '@/parcels/tcg/dlc/types.ts';
import {fetchMtgCards, fetchMtgSet} from '@/parcels/tcg/mtg/api.ts';
import type {MtgSearchDisplaySettings, MtgSearchParams, MtgSearchQuerySettings} from '@/parcels/tcg/mtg/types.ts';
import {fetchPcgCards, fetchPcgSet} from '@/parcels/tcg/pcg/api.ts';
import type {PcgSearchDisplaySettings, PcgSearchParams, PcgSearchQuerySettings} from '@/parcels/tcg/pcg/types.ts';
import type {TcgSearchCards, TcgSearchCardsResult} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {usePrevious} from '@/parcels/usePrevious.ts';

export function constructCardOverview(
  searchParams: MtgSearchParams | DlcSearchParams | PcgSearchParams,
  searchQuerySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings,
  searchDisplaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings,
  navigate: UseNavigateResult<'/$tcg/cards'>,
) {
  const tcg = useTcgByLocation() as Tcg;
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const [cards, setCards] = useState<null | TcgSearchCardsResult>(null);
  const [set, setSet] = useState<null | TcgDataSet>(null);

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
    const onSetCallback = ({ data, error }: { data?: TcgDataSet; error?: GourmetError }) => {
      if (error !== undefined) {
        return;
      }

      setSet(data ?? null);
    };

    const onCallback = ({ data, error }: { data?: TcgSearchCards; error?: GourmetError }) => {
      if (error !== undefined) {
        return;
      }

      const isSetSpecific = getSetSpecificQuery(searchQuerySettings.query) !== null;
      if (isSetSpecific) {
        const setId = data?.items[0]?.card?.print?.setId;

        if (setId) {
          if (tcg === 'mtg') {
            fetchMtgSet(setId, controller).then(onSetCallback);
          } else if (tcg === 'pcg') {
            fetchPcgSet(setId, controller).then(onSetCallback);
          } else if (tcg === 'dlc') {
            fetchDlcSet(setId, controller).then(onSetCallback);
          }
        }
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

    if (tcg === 'mtg') {
      fetchMtgCards(searchQuerySettings as MtgSearchQuerySettings, controller).then(onCallback);
    } else if (tcg === 'pcg') {
      fetchPcgCards(searchQuerySettings as PcgSearchQuerySettings, controller).then(onCallback);
    } else {
      fetchDlcCards(searchQuerySettings as DlcSearchQuerySettings, controller).then(onCallback);
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
        set={set}
        cards={cards}
        setSettings={setSettings}
        searchQuerySettings={searchQuerySettings}
        searchDisplaySettings={searchDisplaySettings}
      />
    </>
  );
}

export function getSetSpecificQuery(query: string): string | null {
  const allowedFilters = ['set', 'setcode', 'setname'];
  let allowed = false;
  for (const allowedFilter of allowedFilters) {
    if (query.startsWith(allowedFilter)) {
      allowed = true;
      break;
    }
  }
  if (!allowed) return null;

  const spl = query.split(/[:=]/);
  if (spl.length !== 2) return null;

  let value = spl[1];
  if (value.startsWith('"')) value = value.substring(1);
  if (value.endsWith('"')) value = value.substring(0, value.length - 1);
  return value.trim();
}
