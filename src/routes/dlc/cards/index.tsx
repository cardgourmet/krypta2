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
import { calculateCardRange } from '@/helpers/dlc/calculateCardRange.ts';
import { compareSearchParams, removeDefaults, validateSearchParams } from '@/helpers/dlc/searchParams.ts';
import {
  cardAmountDefault,
  cardDisplayModeDefault,
  type DlcCardOverviewSettings,
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

const backupImageUrl =
  'https://media.discordapp.net/attachments/350014049750089732/1458761128866746381/NjNjY.png?ex=6960d0ab&is=695f7f2b&hm=13b11817308053850266de4cc15309e1a891fb85cf033277304736a8c218f285&=&format=webp&quality=lossless&width=577&height=799';

function CardsOverview() {
  const searchParams = Route.useSearch();
  const settings: DlcCardOverviewSettings = useMemo(() => {
    return {
      page: searchParams.page ?? 1,
      pageSize: searchParams.pageSize ?? cardAmountDefault,
      sortBy: searchParams.sortBy ?? sortByDefault,
      sortDirection: searchParams.sortDirection ?? sortDirectionDefault,
      cardDisplayMode: searchParams.cardDisplayMode ?? cardDisplayModeDefault,
    };
  }, [searchParams]);

  const navigate = useNavigate({ from: Route.fullPath });

  const [cards, setCards] = useState<
    c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const dataCurrentPage = cards?.data?.currentPage;
  const dataLastPage = cards?.data?.pageCount || 0;

  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query: DlcCardQuery = {
      page: settings.page,
      pageSize: Number(settings.pageSize),
      sortBy: settings.sortBy,
    };
    if (settings.sortDirection !== 'auto') {
      query.sortDirection = settings.sortDirection;
    }

    const controller = new AbortController();
    client
      .GET('/v1/dlc/cards/search', {
        params: {
          query: query,
        },
        signal: controller.signal,
      })
      .then((res) => {
        if (!res.data) {
          return;
        }

        setCards(res.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Just aborted the call, no biggies.');
        } else {
          console.log(`Error: ${error}`);
        }
      });

    return () => {
      controller.abort();
    };
  }, [settings]);

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
          {dataCurrentPage && (
            <Pagination
              lastPage={dataLastPage}
              settings={settings}
              setSettings={(updateSettings) => {
                let newParams = updateSettings(searchParams);
                if (newParams.page === dataCurrentPage) return;
                newParams = removeDefaults(newParams);

                setLoading(true);
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
                });

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  search: () => {
                    return { ...newParams };
                  },
                  replace: true,
                });
              }}
            />
          )}
        </div>

        <CardGridSettings
          settings={settings}
          setSettings={(setNewParams) => {
            let newParams = setNewParams(searchParams);
            const changes = compareSearchParams(searchParams, newParams);
            if (changes.length === 0) return;
            newParams = removeDefaults(newParams);

            // only change it if it's not just the display mode
            if (!(changes.length === 1 && changes.includes('cardDisplayMode'))) {
              delete newParams.page;
            }

            setLoading(true);

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              search: () => ({ ...newParams }),
              replace: true,
            });
          }}
        />

        <div className={styles.queryExplanation}>
          {loading && (
            <p>
              <Skeleton baseColor={'#444'} highlightColor={'#656565'} />
            </p>
          )}
          {!loading && (
            <p>
              {calculateCardRange(dataCurrentPage, Number(settings.pageSize)).from}–
              {calculateCardRange(dataCurrentPage, Number(settings.pageSize)).to} von {cards?.data.details?.explanation}
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
            && settings.cardDisplayMode === 'grid'
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
