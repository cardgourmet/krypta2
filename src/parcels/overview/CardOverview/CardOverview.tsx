import { Accordion } from '@mantine/core';
import { IconAlertCircleFilled } from '@tabler/icons-react';
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
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
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
        {(cards?.data.details?.ignored ?? []).length > 0 && (
          <Accordion classNames={{ item: styles.item, root: styles.root, icon: styles.icon }}>
            <Accordion.Item value={'yee'}>
              <Accordion.Control icon={<IconAlertCircleFilled />}>
                There are some ignored filters in your query
              </Accordion.Control>
              <Accordion.Panel>
                {cards?.data.details?.ignored.map((ignore) => (
                  <div key={ignore.value} style={{ display: 'flex', gap: '1rem' }}>
                    <code>{ignore.value}</code>
                    <span>{ignore.reason}</span>
                  </div>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}

        {searchDisplaySettings.cardDisplayMode === 'grid' && <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} />}
      </div>
    </div>
  );
}
