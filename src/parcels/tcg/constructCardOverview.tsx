import type { UseNavigateResult } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { CardOverview } from '@/parcels/overview/CardOverview/CardOverview.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { type DlcCardQuery, type DlcSearchCardsResult, fetchDlcCards } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSearchDisplaySettings, DlcSearchParams, DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgCards, type MtgCardQuery, type MtgSearchCardsResult } from '@/parcels/tcg/mtg/api.ts';
import type { MtgSearchDisplaySettings, MtgSearchParams, MtgSearchQuerySettings } from '@/parcels/tcg/mtg/types.ts';
import { fetchPcgCards, type PcgCardQuery, type PcgSearchCardsResult } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSearchDisplaySettings, PcgSearchParams, PcgSearchQuerySettings } from '@/parcels/tcg/pcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

export function constructCardOverview(
  searchParams: MtgSearchParams | DlcSearchParams | PcgSearchParams,
  searchQuerySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings,
  searchDisplaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings,
  navigate: UseNavigateResult<'/mtg/cards' | '/dlc/cards' | '/pcg/cards'>,
) {
  const tcg = useTcgByLocation() as Tcg;
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const [cards, setCards] = useState<null | MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult>(null);

  const history = useSearchHistory(tcg);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettings = (apply: ApplyFn<MtgSearchParams | PcgSearchParams | DlcSearchParams>) => {
    const newParams = apply(searchParams) as Required<MtgSearchParams>;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      replace: true,
    });
  };

  const onQueryChange = useEffectEvent((query: string) => {
    history?.addQuery(query);
  });

  const isSetSpecific = useMemo(() => {
    const setCodeOrName = getSetSpecificQuery(searchQuerySettings.query);
    return setCodeOrName !== null;
  }, [searchQuerySettings.query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    if (searchQuerySettings.query !== prevSearchQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    const onCallback = ({
      query,
      data,
      error,
    }: {
      query: MtgCardQuery | PcgCardQuery | DlcCardQuery;
      data?: MtgSearchCardsResult | PcgSearchCardsResult | DlcSearchCardsResult;
      error?: Error;
    }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }

      // write to history
      if (query.query !== undefined) {
        onQueryChange(query.query);
      }
      setCards(data as MtgSearchCardsResult);

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
    <CardOverview
      tcg={tcg}
      scrollbackRef={scrollBackRef}
      isLoading={isLoading}
      isQueryLoading={isQueryLoading}
      isSetSpecific={isSetSpecific}
      cards={cards}
      setSettings={setSettings}
      searchQuerySettings={searchQuerySettings}
      searchDisplaySettings={searchDisplaySettings}
    />
  );
}

function getSetSpecificQuery(query: string): string | null {
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
