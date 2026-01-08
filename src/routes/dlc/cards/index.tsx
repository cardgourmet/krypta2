import type { Middleware } from 'openapi-fetch';
import createClient from 'openapi-fetch';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import type { components as c, paths } from '@/schema/api.d.ts';
import styles from './index.module.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ChevronRight, LucideChefHat } from 'lucide-react';
import CardGridSettings from '@/components/dlc/CardGridSettings.tsx';
import ImageCard from '@/components/ImageCard.tsx';
import Pagination from '@/components/Pagination.tsx';
import { calculateCardRange } from '@/helpers/dlc/calculateCardRange.ts';
import type { DlcCardQuery } from '@/helpers/dlc/types.ts';
import { validateSearchParams } from '@/helpers/dlc/validateSearchParams.ts';

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

export default function CardsOverview() {
  const filter = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [cards, setCards] = useState<
    c['schemas']['DataApiResponse-DetailedPage-CardSearchResult-DlcDataCard-ExplainSearchQueryResponse'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const currentPage = cards?.data?.currentPage;
  const lastPage = cards?.data?.pageCount || 0;

  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const query: DlcCardQuery = {
      page: filter.page,
      pageSize: filter.pageSize,
      sortBy: filter.sortBy,
    };
    if (filter.sortDirection !== 'auto') {
      query.sortDirection = filter.sortDirection;
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
  }, [filter]);

  return (
    <div ref={scrollBackRef}>
      <div className={styles.mainContent}>
        <div className={styles.breadcrumb}>
          <Link to="/">
            <LucideChefHat color="#9ba6b1" size={22} className={styles.homeButton} />
          </Link>
          <ChevronRight color="#9ba6b1" size={18} />
          <p>Disney Lorcana</p>
          <ChevronRight color="#9ba6b1" size={18} />
          <p>Kartendatenbank</p>
        </div>
        <div className={styles.contentNav}>
          {currentPage && (
            <Pagination
              lastPage={lastPage}
              filter={filter}
              setFilter={(params) => {
                if (params.page === currentPage) return;

                setLoading(true);
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: 'smooth',
                });

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  search: (prev) => {
                    return { ...prev, ...params };
                  },
                  replace: true,
                });
              }}
            />
          )}
        </div>

        <CardGridSettings
          filter={filter}
          setFilter={(params) => {
            // TODO: on change: update page to 1
            console.log(JSON.stringify(params));

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              search: (prev) => ({ ...prev, ...params }),
              replace: true,
            });

            /*const changes = compareSearchParams(searchParams, params);
            if (changes.length === 0) return;

            if (changes.length === 1 && changes.includes('d')) {
              setSearchParams(params);
              return;
            }

            if (!changes.includes('p')) {
              params.delete('p');
            }
            setSearchParams(params);*/
          }}
          setLoading={setLoading}
        />

        <div className={styles.queryExplanation}>
          {loading && (
            <p>
              <Skeleton baseColor={'#444'} highlightColor={'#656565'} />
            </p>
          )}
          {!loading && (
            <p>
              {calculateCardRange(currentPage, filter.pageSize).from}–
              {calculateCardRange(currentPage, filter.pageSize).to} von {cards?.data.details?.explanation}
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
            && filter.cardDisplayMode === 'grid'
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
