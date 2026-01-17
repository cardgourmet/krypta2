import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { createFileRoute, Link, stripSearchParams, useNavigate } from '@tanstack/react-router';
import CardGridSettings from '@/parcels/overview/CardGridSettings/CardGridSettings.tsx';
import { calculateCardRange } from '@/parcels/overview/calculateCardRange.ts';
import ImageCard from '@/parcels/overview/ImageCard/ImageCard.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
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
import { type DlcSearchCardsResult, fetchDlcCards, type PcgSearchCardsResult } from '@/parcels/umori/api.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: CardsOverview,
  validateSearch: dlcSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(dlcSearchParamsDefaults)],
  },
});

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
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
        history?.addQuery(tcg, query.query);
      }
      setCards(data as DlcSearchCardsResult);

      setIsLoading(false);
      setIsQueryLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, [
    querySettings.query,
    querySettings.page,
    querySettings.pageSize,
    querySettings.sortBy,
    querySettings.sortDirection,
  ]);

  return (
    <div ref={scrollBackRef}>
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <Link to="/">
            <IconChefHat color="#9ba6b1" size={22} className={styles.homeButton} />
          </Link>
          <IconChevronRight color="#9ba6b1" size={18} />
          <p>
            {tcg === 'dlc' && 'Disney Lorcana'}
            {tcg === 'pcg' && 'Pokémon Card Game'}
            {tcg === 'mtg' && 'Magic: The Gathering'}
          </p>
          <IconChevronRight color="#9ba6b1" size={18} />
          <p>Kartendatenbank</p>
        </div>
        <div className={styles.contentNav}>
          <Pagination
            currentPage={dataCurrentPage}
            lastPage={dataLastPage}
            isQueryLoading={isQueryLoading}
            setSettings={setSettings}
          />
        </div>

        <CardGridSettings querySettings={querySettings} displaySettings={displaySettings} setSettings={setSettings} />

        <div className={styles.queryExplanation}>
          {isLoading && (
            <p>
              <Skeleton baseColor={'#444'} highlightColor={'#656565'} />
            </p>
          )}
          {!isLoading && (
            <p>
              {calculateCardRange(dataCurrentPage, Number(querySettings.pageSize)).from}–
              {calculateCardRange(dataCurrentPage, Number(querySettings.pageSize), cards?.data?.details?.count).to} von{' '}
              <span
                // biome-ignore lint/security/noDangerouslySetInnerHtml: _
                dangerouslySetInnerHTML={{
                  __html: parseSearchExplanation(cards?.data.details?.explanation ?? '') ?? '',
                }}
              />
            </p>
          )}
        </div>

        <div className={styles.cardsOverview}>
          {isLoading
            && Array(60)
              .fill(0)
              .map((_, i) => (
                <div key={i} className={styles.card}>
                  <Skeleton
                    baseColor={'#444'}
                    highlightColor={'#656565'}
                    height={'100%'}
                    style={{ borderRadius: '15px', aspectRatio: 672 / 936 }}
                  />
                </div>
              ))}
          {!isLoading && cards && displaySettings.cardDisplayMode === 'grid' && getImageCards(tcg, cards)}
        </div>
      </div>
    </div>
  );
}

function getImageCards(tcg: Tcg, cards: DlcSearchCardsResult | PcgSearchCardsResult) {
  switch (tcg) {
    case 'dlc': {
      const dlcCards = cards as DlcSearchCardsResult;
      return dlcCards.data.items.map((card) => (
        <ImageCard
          key={card.card.id}
          id={card.card.id}
          name={card.card.name}
          thumbnailUrl={card.card.print.translations.en?.imageUrls?.thumbnail ?? ''}
          backfaceThumbnailUrl={backupImageUrl}
          backupImageUrl={backupImageUrl}
        />
      ));
    }
    case 'pcg': {
      const pcgCards = cards as PcgSearchCardsResult;
      return pcgCards.data.items.map((card) => (
        <ImageCard
          key={card.card.id}
          id={card.card.id}
          name={card.card.name}
          thumbnailUrl={card.card.print.translations.en?.imageUrls?.thumbnail ?? ''}
          backfaceThumbnailUrl={backupImageUrl}
          backupImageUrl={backupImageUrl}
        />
      ));
    }
    case 'mtg':
      return <div></div>;
  }
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
