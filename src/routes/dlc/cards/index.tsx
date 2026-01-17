import { useEffect, useEffectEvent, useRef, useState } from 'react';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import Breadcrumbs from '@/parcels/overview/Breadcrumbs/Breadcrumbs.tsx';
import { CardGrid } from '@/parcels/overview/CardGrid/CardGrid.tsx';
import CardGridSettings from '@/parcels/overview/CardGridSettings/CardGridSettings.tsx';
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
import { type Tcg, useTcg } from '@/parcels/tcg/useTcg.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: CardsOverview,
  validateSearch: dlcSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(dlcSearchParamsDefaults)],
  },
});

function CardsOverview() {
  const tcg = useTcg() as Tcg;
  const searchParams = Route.useSearch() as DlcSearchParams;
  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState<DlcSearchCardsResult | null>(null);
  const dataCurrentPage = cards?.data?.currentPage;
  const dataLastPage = cards?.data?.pageCount;

  const querySettings: DlcSearchQuerySettings = useDlcMemoizedQuerySettings();
  const prevQuerySettings = usePrevious(querySettings);
  const displaySettings: DlcSearchDisplaySettings = useDlcMemoizedDisplaySettings();

  const setSettings = (apply: ApplyFn<DlcSearchParams>) => {
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
    if (querySettings.query !== prevQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    fetchDlcCards(querySettings, controller).then(({ query, data, error }) => {
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
  }, [querySettings]);

  return (
    <div ref={scrollBackRef}>
      <div className={styles.mainContent}>
        <Breadcrumbs />
        <Pagination
          currentPage={dataCurrentPage}
          lastPage={dataLastPage}
          isQueryLoading={isQueryLoading}
          setSettings={setSettings}
        />

        <CardGridSettings querySettings={querySettings} displaySettings={displaySettings} setSettings={setSettings} />

        <QueryExplanation
          isLoading={isLoading}
          currentPage={dataCurrentPage}
          pageSize={Number(querySettings.pageSize)}
          cardCount={cards?.data?.details?.count ?? 0}
          explanation={cards?.data.details?.explanation ?? ''}
        />

        {displaySettings.cardDisplayMode === 'grid' && <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} />}
      </div>
    </div>
  );
}
