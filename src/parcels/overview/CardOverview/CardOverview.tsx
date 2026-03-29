import {Accordion, Divider, Group, Stack, Text, Tooltip} from '@mantine/core';
import {IconAlertCircleFilled, IconClock} from '@tabler/icons-react';
import {type RefObject, useEffect, useState} from 'react';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {CardGrid} from '@/parcels/overview/CardGrid/CardGrid.tsx';
import CardOverviewSettings from '@/parcels/overview/CardOverviewSettings/CardOverviewSettings.tsx';
import {CardTable} from '@/parcels/overview/CardTable/CardTable.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import {QueryExplanation} from '@/parcels/overview/QueryExplanation/QueryExplanation.tsx';
import {OverviewSelectionDisplay} from '@/parcels/selection/OverviewSelectionDisplay/OverviewSelectionDisplay.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import type {TcgSearchCardsResult, TcgSearchDisplaySettings, TcgSearchParams, TcgSearchQuerySettings,} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import styles from './CardOverview.module.css';

type CardOverviewProps = {
  tcg: Tcg;
  scrollbackRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isQueryLoading: boolean;
  isSetSpecific?: boolean;

  cards: TcgSearchCardsResult | null;
  setSettings: (apply: ApplyFn<TcgSearchParams>) => void;
  searchQuerySettings: TcgSearchQuerySettings;
  searchDisplaySettings: TcgSearchDisplaySettings;
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
  const { component, title } = useBreadcrumbs({ subpage: 'Kartendatenbank' });

  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);
  const workContext = useTcgOverviewWorkContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.data.details) return;
    const query = cards?.data.details?.originalQuery;
    workContext?.setSearchResult(query, cards as TcgSearchCardsResult);
  }, [cards]);

  return (
    <div ref={scrollbackRef}>
      <div>
        {component}

        <Stack
          gap={'0'}
          style={{
            position: 'sticky',
            top: 'var(--navbar-height)',
            zIndex: 'var(--sticky-layer)',
            backgroundColor: 'var(--gourmet-neutral-0)',
          }}
          mb={'1rem'}
        >
          <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
            <Group gap={'0.1rem'}>
              <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
                {title?.label}
              </GourmetText>
              {/*<IconCircleCheckFilled size={22} color={'var(--gourmet-green-1)'} />*/}
              <Stack h={'2rem'} justify={'start'}>
                <Tooltip label={'Card database might not be up to date.'} openDelay={500}>
                  <IconClock size={18} color={'var(--gourmet-orange-1)'} />
                </Tooltip>
              </Stack>
            </Group>
            <Pagination
              currentPage={cards?.data?.currentPage}
              lastPage={cards?.data?.pageCount}
              isLoading={isQueryLoading}
              setSettings={setSettings}
            />
          </Group>
          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        {/*{isSetSpecific && <Text>SetSpecific JOONGE</Text>}*/}

        <CardOverviewSettings
          tcg={tcg}
          querySettings={searchQuerySettings}
          displaySettings={searchDisplaySettings}
          setSettings={setSettings}
          toolsEnabled={toolsEnabled}
          setToolsEnabled={setToolsEnabled}
        />

        <QueryExplanation
          isLoading={isLoading}
          currentPage={cards?.data?.currentPage}
          pageSize={60}
          cardCount={cards?.data?.details?.count ?? 0}
          explanation={cards?.data.details?.explanation ?? ''}
        />
        {(cards?.data.details?.ignored ?? []).length > 0 && (
          <Accordion classNames={{ item: styles.item, root: styles.root, icon: styles.icon }}>
            <Accordion.Item value={'yeet'}>
              <Accordion.Control icon={<IconAlertCircleFilled />}>
                <Text>There are some ignored filters in your query</Text>
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

        <div style={{ padding: '0.5rem' }}>
          {searchDisplaySettings.display === 'grid' && (
            <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={toolsEnabled} />
          )}
          {searchDisplaySettings.display === 'table' && (
            <CardTable tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={toolsEnabled} />
          )}
        </div>

        <Pagination
          currentPage={cards?.data?.currentPage}
          lastPage={cards?.data?.pageCount}
          isLoading={isQueryLoading}
          setSettings={setSettings}
        />

        {workContext?.data && workContext.data.selection.elementIds.length > 0 && (
          <OverviewSelectionDisplay context={workContext} />
        )}
      </div>
    </div>
  );
}
