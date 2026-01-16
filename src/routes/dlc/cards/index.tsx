import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import CardGridSettings from '@/parcels/overview/CardGridSettings/CardGridSettings.tsx';
import { calculateCardRange } from '@/parcels/overview/calculateCardRange.ts';
import ImageCard from '@/parcels/overview/ImageCard/ImageCard.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import { useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings } from '@/parcels/tcg/dlc/query.ts';
import { type ApplyFn, dlcApplyAndCleanup, dlcValidateSearchParams } from '@/parcels/tcg/dlc/searchParams.ts';
import type {
  DlcCardSearchDisplaySettings,
  DlcCardSearchParams,
  DlcCardSearchQuerySettings,
} from '@/parcels/tcg/dlc/types.ts';
import { type Tcg, useTcg } from '@/parcels/tcg/useTcg.ts';
import { type DlcSearchCardsResult, fetchDlcCards, type PcgSearchCardsResult } from '@/parcels/umori/api.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: CardsOverview,
  validateSearch: dlcValidateSearchParams,
});

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

function CardsOverview() {
  const tcg = useTcg() as Tcg;
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory();
  const [loading, setLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState<DlcSearchCardsResult | null>(null);
  const dataCurrentPage = cards?.data?.currentPage;
  const dataLastPage = cards?.data?.pageCount;

  const querySettings: DlcCardSearchQuerySettings = useDlcMemoizedQuerySettings();
  const displaySettings: DlcCardSearchDisplaySettings = useDlcMemoizedDisplaySettings();

  const setSettings = (apply: ApplyFn<DlcCardSearchParams>) => {
    const newParams = dlcApplyAndCleanup(apply, searchParams);
    if (newParams === null) return;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      replace: true,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    setCards(null);
    setLoading(true);

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
      setLoading(false);
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
          <Pagination lastPage={dataLastPage} settings={querySettings} setSettings={setSettings} />
        </div>

        <CardGridSettings querySettings={querySettings} displaySettings={displaySettings} setSettings={setSettings} />

        <div className={styles.queryExplanation}>
          {loading && (
            <p>
              <Skeleton baseColor={'#444'} highlightColor={'#656565'} />
            </p>
          )}
          {!loading && (
            <p>
              {calculateCardRange(dataCurrentPage, Number(querySettings.pageSize)).from}–
              {calculateCardRange(dataCurrentPage, Number(querySettings.pageSize)).to} von{' '}
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
          {loading
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
          {!loading && cards && displaySettings.cardDisplayMode === 'grid' && getImageCards(tcg, cards)}
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
