import type { RefObject } from 'react';
import Breadcrumbs from '@/parcels/overview/Breadcrumbs/Breadcrumbs.tsx';
import { CardGrid } from '@/parcels/overview/CardGrid/CardGrid.tsx';
import CardOverviewSettings from '@/parcels/overview/CardOverviewSettings/CardOverviewSettings.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import { QueryExplanation } from '@/parcels/overview/QueryExplanation/QueryExplanation.tsx';
import type { DlcSearchCardsResult } from '@/parcels/tcg/dlc/api.ts';
import type { DlcSearchDisplaySettings, DlcSearchParams, DlcSearchQuerySettings } from '@/parcels/tcg/dlc/types.ts';
import type { PcgSearchCardsResult } from '@/parcels/tcg/pcg/api.ts';
import type { PcgSearchDisplaySettings, PcgSearchParams, PcgSearchQuerySettings } from '@/parcels/tcg/pcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcg.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import styles from './CardOverview.module.css';

type CardOverviewProps = {
  tcg: Tcg;
  scrollbackRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isQueryLoading: boolean;

  cards: DlcSearchCardsResult | PcgSearchCardsResult | null;
  setSettings: (apply: ApplyFn<PcgSearchParams | DlcSearchParams>) => void;
  searchQuerySettings: DlcSearchQuerySettings | PcgSearchQuerySettings;
  searchDisplaySettings: DlcSearchDisplaySettings | PcgSearchDisplaySettings;
};

export function CardOverview({
  tcg,
  scrollbackRef,
  isLoading,
  isQueryLoading,
  cards,
  setSettings,
  searchQuerySettings,
  searchDisplaySettings,
}: CardOverviewProps) {
  return (
    <div ref={scrollbackRef}>
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
