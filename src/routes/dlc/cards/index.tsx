import type { Middleware } from 'openapi-fetch';
import createClient from 'openapi-fetch';
import { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import type { components as c, paths } from '@/schema/api.d.ts';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { IconChefHat, IconChevronRight } from '@tabler/icons-react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import CardGridSettings from '@/components/dlc/CardGridSettings/CardGridSettings.tsx';
import ImageCard from '@/components/dlc/ImageCard/ImageCard.tsx';
import Pagination from '@/components/dlc/Pagination/Pagination.tsx';
import { useSearchHistory } from '@/components/home/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { calculateCardRange } from '@/helpers/dlc/calculateCardRange.ts';
import { parseSearchExplanation } from '@/helpers/dlc/parseSearchExplanation.ts';
import { type ApplyFn, applyAndCleanup, validateSearchParams } from '@/helpers/dlc/searchParams.ts';
import {
  cardAmountDefault,
  cardDisplayModeDefault,
  type DlcCardOverviewDisplaySettings,
  type DlcCardOverviewQuerySettings,
  type DlcCardOverviewSearchParams,
  type DlcCardQuery,
  sortByDefault,
  sortDirectionDefault,
} from '@/helpers/dlc/types.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: CardsOverview,
  validateSearch: validateSearchParams,
});

const client = createClient<paths>({
  baseUrl: 'http://localhost:8080',
});
const authMiddleware: Middleware = {
  onRequest({ request }) {
    request.headers.set('Authorization', `Basic ${btoa('quagga:omnivoregarden42')}`);
    return request;
  },
};
client.use(authMiddleware);

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

function CardsOverview() {
  const searchParams = Route.useSearch();
  const querySettings: DlcCardOverviewQuerySettings = useMemo(() => {
    return {
      query: searchParams.query ?? '',
      page: searchParams.page ?? 1,
      pageSize: searchParams.pageSize ?? cardAmountDefault,
      sortBy: searchParams.sortBy ?? sortByDefault,
      sortDirection: searchParams.sortDirection ?? sortDirectionDefault,
    };
  }, [searchParams]);
  const displaySettings: DlcCardOverviewDisplaySettings = useMemo(() => {
    return {
      cardDisplayMode: searchParams.cardDisplayMode ?? cardDisplayModeDefault,
    };
  }, [searchParams]);

  const navigate = useNavigate({ from: Route.fullPath });

  const history = useSearchHistory();
  const [cards, setCards] = useState<
    c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const dataCurrentPage = cards?.data?.currentPage;
  const dataLastPage = cards?.data?.pageCount;

  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettingsFn = (apply: ApplyFn<DlcCardOverviewSearchParams>) => {
    const newParams = applyAndCleanup(apply, searchParams);
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
  }, [querySettings.query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    const query: DlcCardQuery = {
      query: querySettings.query,
      page: querySettings.page,
      pageSize: Number(querySettings.pageSize),
      sortBy: querySettings.sortBy,
    };
    if (querySettings.sortDirection !== 'auto') {
      query.sortDirection = querySettings.sortDirection;
    }

    setLoading(true);

    const controller = new AbortController();
    fetchCards(query, controller, (data) => {
      // write to history
      if (query.query !== undefined) {
        history?.addQuery(query.query);
      }

      // res.data.data.details.
      setCards(data);
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
          <p>Disney Lorcana</p>
          <IconChevronRight color="#9ba6b1" size={18} />
          <p>Kartendatenbank</p>
        </div>
        <div className={styles.contentNav}>
          <Pagination lastPage={dataLastPage} settings={querySettings} setSettings={setSettingsFn} />
        </div>

        <CardGridSettings querySettings={querySettings} displaySettings={displaySettings} setSettings={setSettingsFn} />

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
          {!loading
            && displaySettings.cardDisplayMode === 'grid'
            && cards
            && cards.data.items.map((card) => (
              <ImageCard
                key={card.card.id}
                id={card.card.id}
                name={card.card.name}
                thumbnailUrl={card.card.print.translations.en?.imageUrls?.thumbnail ?? ''}
                backfaceThumbnailUrl={backupImageUrl}
                backupImageUrl={backupImageUrl}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function fetchCards(
  query: DlcCardQuery,
  abort: AbortController,
  onSuccess: (
    data: c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'],
  ) => void,
) {
  client
    .GET('/v1/dlc/cards/search', {
      params: {
        query: query,
      },
      signal: abort.signal,
    })
    .then((res) => {
      if (!res.data) {
        return;
      }

      // res.data.data.details.
      onSuccess(res.data);
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.log('Just aborted the call, no biggies.');
      } else {
        console.log(`Error: ${error}`);
      }
    });
}
