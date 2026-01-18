import { useEffect, useEffectEvent, useRef, useState } from 'react';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import Breadcrumbs from '@/parcels/overview/Breadcrumbs/Breadcrumbs.tsx';
import { CardGrid } from '@/parcels/overview/CardGrid/CardGrid.tsx';
import CardOverviewSettings from '@/parcels/overview/CardOverviewSettings/CardOverviewSettings.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import { QueryExplanation } from '@/parcels/overview/QueryExplanation/QueryExplanation.tsx';
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
import { type Tcg, useTcg } from '@/parcels/tcg/useTcg.ts';
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
  const tcg = useTcg() as Tcg;
  const searchParams = Route.useSearch() as DlcSearchParams;
  const searchQuerySettings: DlcSearchQuerySettings = useDlcMemoizedQuerySettings();
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const searchDisplaySettings: DlcSearchDisplaySettings = useDlcMemoizedDisplaySettings();
  const [cards, setCards] = useState<DlcSearchCardsResult | null>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory();
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
    history?.addQuery(tcg, query);
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
    <div ref={scrollBackRef}>
      <div className={styles.mainContent}>
        <Breadcrumbs />
        <Pagination
          currentPage={cards?.data?.currentPage}
          lastPage={cards?.data?.pageCount}
          isQueryLoading={isQueryLoading}
          setSettings={setSettings}
        />

        <CardOverviewSettings
          tcg={tcg}
          querySettings={searchQuerySettings}
          displaySettings={searchDisplaySettings}
          setSettings={setSettings}
        />

        <QueryExplanation
          isLoading={isLoading}
          currentPage={cards?.data?.currentPage}
          pageSize={Number(searchQuerySettings.pageSize)}
          cardCount={cards?.data?.details?.count ?? 0}
          explanation={cards?.data.details?.explanation ?? ''}
        />

        {searchDisplaySettings.cardDisplayMode === 'grid' && <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} />}
      </div>
    </div>
  );
}
