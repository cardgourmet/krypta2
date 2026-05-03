import {Accordion, Divider, Flex, Group, Stack, Text, Tooltip} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconAlertCircleFilled, IconClock} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {CardGrid} from '@/parcels/overview/cards/CardGrid/CardGrid.tsx';
import {CardOverviewLoader} from '@/parcels/overview/cards/CardOverview/CardOverviewLoader.tsx';
import CardOverviewSettings from '@/parcels/overview/cards/CardOverview/CardOverviewSettings/CardOverviewSettings.tsx';
import useCardOverviewData from '@/parcels/overview/cards/CardOverview/useCardOverviewData.tsx';
import {useTcgSearchSettings} from '@/parcels/overview/cards/CardOverview/useTcgSearchSettings.tsx';
import {CardTable} from '@/parcels/overview/cards/CardTable/CardTable.tsx';
import Pagination from '@/parcels/overview/cards/Pagination/Pagination.tsx';
import {QueryExplanation} from '@/parcels/overview/cards/QueryExplanation/QueryExplanation.tsx';
import {TcgCardMenu} from '@/parcels/overview/cards/TcgCardMenu/TcgCardMenu.tsx';
import {OverviewSelectionDisplay} from '@/parcels/selection/OverviewSelectionDisplay/OverviewSelectionDisplay.tsx';
import {useTcgOverviewWorkStore} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';
import {MtgSetIcon} from '@/parcels/tcg/mtg/details/MtgPrintMetaRenderer/MtgPrintMetaRenderer.tsx';
import type {TcgSearchCardsResult, TcgSearchParams} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {usePrevious} from '@/parcels/usePrevious.ts';
import {Route} from '@/routes/$tcg/cards';
import styles from './CardOverview.module.css';

export type OverviewSettings = Required<TcgSearchParams>;

export function CardOverview() {
  const smallScreen = useMediaQuery('(max-width: 800px)');

  const tcg = useTcgByLocation() as Tcg;
  const { component, title } = useBreadcrumbs({ subpage: 'Kartendatenbank' });
  const { user } = useAuth();

  const set = Route.useLoaderData() as TcgDataSet | null;
  const { params, querySettings, displaySettings } = useTcgSearchSettings(set ?? undefined);
  const { cards, isLoading, isQueryLoading } = useCardOverviewData(querySettings, set);

  const scrollbackRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const [isDisplayLoading, setIsDisplayLoading] = useState<boolean>(false);
  const [overviewSettings, setOverviewSettings] = useState<OverviewSettings | undefined>({
    query: querySettings.query,
    page: querySettings.page,
    sortBy: querySettings.sortBy,
    sortDirection: querySettings.sortDirection,
    uniqueBy: querySettings.uniqueBy,
    display: displaySettings.display,
  });
  const prevOverviewSettings = usePrevious(overviewSettings);

  useEffect(() => {
    if (!overviewSettings) return;
    if (!tcg) return;
    if (!prevOverviewSettings || prevOverviewSettings === overviewSettings) return;

    navigate({
      to: '/$tcg/cards',
      search: () => ({ ...overviewSettings }),
      params: {
        tcg: tcg,
      },
      replace: true,
    });
  }, [overviewSettings, navigate, tcg, prevOverviewSettings]);
  const setSettings = useCallback(
    (apply: ApplyFn<TcgSearchParams>) => {
      const newParams = apply(params) as Required<TcgSearchParams>;

      setOverviewSettings(newParams);
      setIsDisplayLoading(false);
    },
    [params],
  );

  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);

  return (
    <div ref={scrollbackRef}>
      {set === null && (
        <title>{`${(params.query?.length ?? 0) === 0 ? 'Card Database' : params.query} 
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}
      {set !== null && (
        <title>{`${set.translations.en.name} (${set.code?.toUpperCase()}) 
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}

      <WorkContextReloader cards={cards} />

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
          <Flex
            justify={'space-between'}
            p={'0.5rem 0'}
            direction={smallScreen ? 'column' : 'row'}
            gap={smallScreen ? '0.25rem' : ''}
          >
            <Group gap={'0.1rem'}>
              <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
                {title?.label}
              </GourmetText>
              {/*<IconCircleCheckFilled size={22} color={'var(--gourmet-green-1)'} />*/}
              <Stack h={'2rem'} justify={'start'}>
                <Tooltip label={'Card database might not be up to date.'} openDelay={500}>
                  <IconClock size={18} color={'var(--gourmet-neutral-7)'} />
                </Tooltip>
              </Stack>
            </Group>
            {set === null && (
              <Pagination
                currentPage={cards?.data?.currentPage}
                lastPage={cards?.data?.pageCount}
                isLoading={isQueryLoading}
                setSettings={setSettings}
              />
            )}
          </Flex>
          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        {set !== null && (
          <Stack
            p={'0.75rem 2rem'}
            style={{
              borderRadius: '0.5rem',
              backgroundColor: 'var(--gourmet-blue-05)',
            }}
            mb={'0.5rem'}
          >
            <Group>
              <MtgSetIcon setCode={set.code!.toLowerCase()} fontSize={'2.5rem'} color={'var(--gourmet-neutral-0)'} />

              <Stack gap={'0rem'}>
                <Group gap={'0.5rem'}>
                  <GourmetText fz={'1.5rem'} cgmff={'ui'} cgmc={'neutral-0'} fw={500}>
                    {set.translations.en.name}
                  </GourmetText>
                  <GourmetText fz={'1.15rem'} cgmff={'ui'} cgmc={'neutral-0'}>
                    ({set.code})
                  </GourmetText>
                </Group>
                <GourmetText fz={'1.15rem'} cgmff={'ui'} cgmc={'neutral-1'}>
                  {set.printsAvailable} prints
                </GourmetText>
              </Stack>
            </Group>
          </Stack>
        )}

        <CardOverviewSettings
          tcg={tcg}
          querySettings={querySettings}
          displaySettings={displaySettings}
          setSettings={setSettings}
          toolsEnabled={toolsEnabled}
          setToolsEnabled={setToolsEnabled}
          setIsDisplayLoading={setIsDisplayLoading}
        />

        <QueryExplanation
          isLoading={isLoading}
          currentPage={cards?.data?.currentPage}
          pageSize={set === null ? 60 : (cards?.data?.details?.count ?? 0)}
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

        <div style={{ padding: '0.5rem', width: '100%', height: '100%', position: 'relative' }}>
          <CardOverviewLoader isDisplayLoading={isDisplayLoading} />

          {displaySettings.display === 'grid' && (
            <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={user ? toolsEnabled : false} />
          )}
          {displaySettings.display === 'table' && (
            <CardTable tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={user ? toolsEnabled : false} />
          )}

          <TcgCardMenu tcg={tcg} />
        </div>

        {set === null && (
          <Pagination
            currentPage={cards?.data?.currentPage}
            lastPage={cards?.data?.pageCount}
            isLoading={isQueryLoading}
            setSettings={setSettings}
          />
        )}

        <OverviewSelectionDisplay />
      </div>
    </div>
  );
}

function WorkContextReloader({ cards }: { cards: TcgSearchCardsResult | null }) {
  const setData = useTcgOverviewWorkStore((state) => state.setData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.data.details) return;
    const query = cards?.data.details?.originalQuery;
    setData(query, cards as TcgSearchCardsResult);
  }, [cards]);

  return (
    // biome-ignore lint/complexity/noUselessFragments: <>
    <></>
  );
}
