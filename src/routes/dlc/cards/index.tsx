import { useEffect, useEffectEvent, useRef, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { CardOverview } from '@/parcels/overview/CardOverview/CardOverview.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import { type DlcSearchCardsResult, fetchDlcCards } from '@/parcels/tcg/dlc/api.ts';
import { useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings } from '@/parcels/tcg/dlc/query.ts';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchParams,
  type DlcSearchQuerySettings,
  dlcSearchParamsDefaults,
  dlcSearchParamsSchema,
} from '@/parcels/tcg/dlc/types.ts';
import type { PcgSearchParams } from '@/parcels/tcg/pcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: DlcCardsOverview,
  validateSearch: dlcSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(dlcSearchParamsDefaults)],
  },
});

function DlcCardsOverview() {
  const tcg = useTcgByLocation() as Tcg;
  const searchParams = Route.useSearch() as DlcSearchParams;
  const searchQuerySettings: DlcSearchQuerySettings = useDlcMemoizedQuerySettings();
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const searchDisplaySettings: DlcSearchDisplaySettings = useDlcMemoizedDisplaySettings();
  const [cards, setCards] = useState<DlcSearchCardsResult | null>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory(tcg);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettings = (apply: ApplyFn<PcgSearchParams | DlcSearchParams>) => {
    const newParams = apply(searchParams) as Required<DlcSearchParams>;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      replace: true,
    });
  };

  const onQueryChange = useEffectEvent((query: string) => {
    history?.addQuery(query);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    if (searchQuerySettings.query !== prevSearchQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    fetchDlcCards(searchQuerySettings, controller).then(({ query, data, error }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }

      // write to history
      if (query.query !== undefined) {
        onQueryChange(query.query);
      }
      setCards(data as DlcSearchCardsResult);

      setIsLoading(false);
      setIsQueryLoading(false);
    });

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
      cards={cards}
      setSettings={setSettings}
      searchQuerySettings={searchQuerySettings}
      searchDisplaySettings={searchDisplaySettings}
    />
  );
}
