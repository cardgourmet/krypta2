import {Accordion, ActionIcon, Button, Divider, Group, Progress, Stack, Text, Tooltip,} from '@mantine/core';
import {IconAlertCircleFilled, IconAlertSquareRounded, IconX} from '@tabler/icons-react';
import {type RefObject, useEffect} from 'react';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {CardGrid} from '@/parcels/overview/CardGrid/CardGrid.tsx';
import CardOverviewSettings from '@/parcels/overview/CardOverviewSettings/CardOverviewSettings.tsx';
import {CardTable} from '@/parcels/overview/CardTable/CardTable.tsx';
import {useMtgOverviewWorkContext} from '@/parcels/overview/MtgOverviewWorkContext.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import {QueryExplanation} from '@/parcels/overview/QueryExplanation/QueryExplanation.tsx';
import type {DlcSearchCardsResult} from '@/parcels/tcg/dlc/api.ts';
import type {DlcSearchDisplaySettings, DlcSearchParams, DlcSearchQuerySettings} from '@/parcels/tcg/dlc/types.ts';
import type {MtgSearchCardsResult} from '@/parcels/tcg/mtg/api.ts';
import type {MtgSearchDisplaySettings, MtgSearchParams, MtgSearchQuerySettings} from '@/parcels/tcg/mtg/types.ts';
import type {PcgSearchCardsResult} from '@/parcels/tcg/pcg/api.ts';
import type {PcgSearchDisplaySettings, PcgSearchParams, PcgSearchQuerySettings} from '@/parcels/tcg/pcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import styles from './CardOverview.module.css';

type CardOverviewProps = {
  tcg: Tcg;
  scrollbackRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isQueryLoading: boolean;
  isSetSpecific?: boolean;

  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null;
  setSettings: (apply: ApplyFn<MtgSearchParams | PcgSearchParams | DlcSearchParams>) => void;
  searchQuerySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
  searchDisplaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;
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

  const workContext = useMtgOverviewWorkContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards) return;
    const query = cards?.data.details?.originalQuery;
    if (!query) return;

    workContext?.setSearchResult(query, cards as MtgSearchCardsResult);
  }, [cards]);

  return (
    <div ref={scrollbackRef}>
      <div className={styles.mainContent}>
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
          <Group justify={'space-between'} p={'0.5rem 0'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>
            <Pagination
              currentPage={cards?.data?.currentPage}
              lastPage={cards?.data?.pageCount}
              isQueryLoading={isQueryLoading}
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
          {searchDisplaySettings.display === 'grid' && <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} />}
          {searchDisplaySettings.display === 'table' && <CardTable tcg={tcg} cards={cards} isLoading={isLoading} />}
        </div>

        {workContext?.data && workContext.data.selection.elementIds.length > 0 && (
          <Group
            style={{
              position: 'sticky',
              bottom: '1rem',
              marginTop: '1rem',
              zIndex: 'var(--sticky-layer)',
              pointerEvents: 'none',
            }}
            justify={'center'}
            align={'center'}
          >
            <Stack
              style={{
                border: '2px solid var(--cgm-navbar-border)',
                borderRadius: '4px',
                backgroundColor: 'var(--cgm-navbar-bg)',
                padding: '1rem',
                boxShadow: '2px 4px 8px #000000',
                pointerEvents: 'auto',
              }}
              w={'36rem'}
              maw={'36rem'}
              gap={'0.1rem'}
            >
              <Group wrap={'nowrap'} justify={'space-between'}>
                <Stack gap={'0'}>
                  <Group gap={'0.5rem'}>
                    <GourmetText cgmff={'ui'} fz={'1.25rem'} cgmc={'neutral-8'}>
                      Auswahl:
                    </GourmetText>
                    <GourmetText cgmff={'ui'} c={'var(--gourmet-orange-1)'} fw={'500'} fz={'1.25rem'}>
                      {workContext.data.selection.elementIds.length} Karten
                    </GourmetText>
                  </Group>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
                    Aktuelle Seite:{' '}
                    {Object.keys(workContext.data.selection.elementsByPage[workContext.data.search.page] ?? []).length}{' '}
                    Karten
                  </GourmetText>
                </Stack>
                <Group wrap={'nowrap'}>
                  <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
                    <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
                      Auswahl verwenden für ...
                    </GourmetText>
                  </Button>
                  <Tooltip label={'Auswahl aufheben'} openDelay={500}>
                    <ActionIcon
                      color={'var(--gourmet-neutral-3)'}
                      onClick={() => {
                        workContext.clearSelection();
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
              <Stack gap={'0.25rem'}>{generateProgress(12, workContext.data.selection.elementIds.length, 60)}</Stack>
            </Stack>
          </Group>
        )}
      </div>
    </div>
  );
}

function generateProgress(sections: number, current: number, max: number) {
  const ratio = max > 0 ? current / max : 0;
  const toPaintCount = Math.max(0, Math.min(sections, Math.ceil(ratio * sections)));
  const toPaintIndex = toPaintCount - 1;

  let color = 'var(--gourmet-green-1)';
  if (ratio <= 0.5) {
    color = 'var(--gourmet-green-1)';
  } else if (ratio <= 0.75) {
    color = 'var(--gourmet-orange-1)';
  } else {
    color = 'var(--gourmet-red-01)';
  }

  return (
    <>
      <Group justify={'end'}>
        <Group gap={'0.25rem'}>
          <Group gap={'0.1rem'}>
            <GourmetText cgmff={'ui'} fw={'500'} c={color}>
              {current}
            </GourmetText>
            <GourmetText cgmff={'ui'}>/60</GourmetText>
          </Group>
          <ActionIcon className={styles.selectionInfoButton}>
            <IconAlertSquareRounded size={20} />
          </ActionIcon>
        </Group>
      </Group>
      <Group grow gap={'0.25rem'}>
        {Array.from(Array(sections).keys()).map((_, index) => {
          return <Progress key={index} color={color} size="xs" value={index <= toPaintIndex ? 100 : 0} />;
        })}
      </Group>
    </>
  );
}
