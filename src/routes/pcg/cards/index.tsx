import { useEffect, useEffectEvent, useRef, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { CardOverview } from '@/parcels/overview/CardOverview/CardOverview.tsx';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import { fetchPcgCards, type PcgSearchCardsResult } from '@/parcels/tcg/pcg/api.ts';
import { usePcgMemoizedDisplaySettings, usePcgMemoizedQuerySettings } from '@/parcels/tcg/pcg/query.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchParams,
  type PcgSearchQuerySettings,
  pcgSearchParamsDefaults,
  pcgSearchParamsSchema,
} from '@/parcels/tcg/pcg/types.ts';
import { type Tcg, useTcg } from '@/parcels/tcg/useTcg.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

export const Route = createFileRoute('/pcg/cards/')({
  component: PcgCardsOverview,
  validateSearch: pcgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(pcgSearchParamsDefaults)],
  },
});

function PcgCardsOverview() {
  const tcg = useTcg() as Tcg;
  const searchParams = Route.useSearch() as PcgSearchParams;
  const searchQuerySettings: PcgSearchQuerySettings = usePcgMemoizedQuerySettings();
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const searchDisplaySettings: PcgSearchDisplaySettings = usePcgMemoizedDisplaySettings();
  const [cards, setCards] = useState<PcgSearchCardsResult | null>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettings = (apply: ApplyFn<PcgSearchParams | DlcSearchParams>) => {
    const newParams = apply(searchParams) as Required<PcgSearchParams>;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      replace: true,
    });
  };

  const onQueryChange = useEffectEvent((query: string) => {
    history?.addQuery(tcg, query);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    if (searchQuerySettings.query !== prevSearchQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    fetchPcgCards(searchQuerySettings, controller).then(({ query, data, error }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }

      // write to history
      if (query.query !== undefined) {
        onQueryChange(query.query);
      }
      setCards(data as PcgSearchCardsResult);

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
