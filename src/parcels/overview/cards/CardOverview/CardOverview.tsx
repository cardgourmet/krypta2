import { Accordion, Divider, Flex, Group, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlertCircleFilled, IconArrowsShuffle, IconClock } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { ActiveListsContextProvider } from '@/parcels/lists/ActiveListsContextProvider.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { CardGrid } from '@/parcels/overview/cards/CardGrid/CardGrid.tsx';
import { CardOverviewLoader } from '@/parcels/overview/cards/CardOverview/CardOverviewLoader.tsx';
import CardOverviewSettings from '@/parcels/overview/cards/CardOverview/CardOverviewSettings/CardOverviewSettings.tsx';
import { SetBanner } from '@/parcels/overview/cards/CardOverview/SetBanner/SetBanner.tsx';
import useCardOverviewData from '@/parcels/overview/cards/CardOverview/useCardOverviewData.tsx';
import { useTcgSearchSettings } from '@/parcels/overview/cards/CardOverview/useTcgSearchSettings.tsx';
import { WorkContextReloader } from '@/parcels/overview/cards/CardOverview/WorkContextReloader.tsx';
import { CardTable } from '@/parcels/overview/cards/CardTable/CardTable.tsx';
import Pagination from '@/parcels/overview/cards/Pagination/Pagination.tsx';
import { QueryExplanation } from '@/parcels/overview/cards/QueryExplanation/QueryExplanation.tsx';
import { QueryMenu } from '@/parcels/overview/cards/QueryMenu/QueryMenu.tsx';
import { TcgOverviewCardMenu } from '@/parcels/overview/cards/TcgCardMenu/TcgOverviewCardMenu.tsx';
import { OverviewSelectionDisplay } from '@/parcels/selection/OverviewSelectionDisplay/OverviewSelectionDisplay.tsx';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';
import type { TcgDataSet, TcgSearchCardsResult, TcgSearchParams } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import styles from './CardOverview.module.css';

export type OverviewSettings = Required<TcgSearchParams>;

export function CardOverview({ set, routeSearch }: { set?: TcgDataSet; routeSearch: TcgSearchParams }) {
  const tcg = useTcgByLocation() as Tcg;
  const { t } = useTranslation('cards');
  const [lang] = useUserLanguage();

  const { component, title } = useBreadcrumbs(
    set === undefined
      ? { subpage: t('breadcrumbs.database') }
      : {
          subpage: '',
          moreSubpages: [
            {
              label: t('breadcrumbs.sets'),
              href: `/${tcg}/sets`,
            },
            {
              label: set.translations?.[lang]?.name ?? set.translations.en.name,
            },
          ],
        },
  );
  const { user } = useAuth();

  const { params, querySettings, displaySettings } = useTcgSearchSettings(routeSearch);
  const { cards, isLoading, isQueryLoading, fetchCards, searchDetails } = useCardOverviewData(querySettings, set);

  const scrollbackRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const [isDisplayLoading, setIsDisplayLoading] = useState<boolean>(false);
  const [overviewSettings, setOverviewSettings] = useState<OverviewSettings | undefined>({
    ...querySettings,
    ...displaySettings,
  });
  const prevOverviewSettings = usePrevious(overviewSettings);

  const { addResources, removeResources, setResources, activeLists } = useActiveLists('main');
  console.log('activeLists', activeLists);

  const previousSearchDetails = usePrevious(searchDetails);
  useEffect(() => {
    if (previousSearchDetails === searchDetails) return;

    const queryChanged = previousSearchDetails?.explain?.originalQuery !== searchDetails?.explain?.originalQuery;

    const resources = searchDetails?.listResources;
    if (!resources) return;
    if (queryChanged) {
      console.log('query changed');
      setResources(resources);
    } else {
      addResources(resources);
    }
  }, [previousSearchDetails, searchDetails, addResources, setResources]);

  useEffect(() => {
    if (!overviewSettings) return;
    if (!tcg) return;
    if (!prevOverviewSettings || prevOverviewSettings === overviewSettings) return;

    const pageChanged = prevOverviewSettings.page !== overviewSettings.page;

    if (set !== undefined) {
      navigate({
        to: '/$tcg/sets/$setCode',
        search: () => ({ ...overviewSettings }),
        params: {
          tcg: tcg,
          setCode: set.code!,
        },
        replace: !pageChanged,
      });
    } else {
      navigate({
        to: '/$tcg/cards',
        search: () => ({ ...overviewSettings }),
        params: {
          tcg: tcg,
        },
        replace: !pageChanged,
      });
    }
  }, [overviewSettings, navigate, tcg, prevOverviewSettings, set]);
  const setSettings = useCallback(
    (apply: ApplyFn<TcgSearchParams>) => {
      const newParams = apply(params) as Required<TcgSearchParams>;

      setOverviewSettings(newParams);
      setIsDisplayLoading(false);
    },
    [params],
  );

  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);
  const isRandomized = querySettings.random;

  return (
    <div ref={scrollbackRef}>
      {set === undefined && (
        <title>{`${(params.query?.length ?? 0) === 0 ? t('breadcrumbs.database') : params.query}
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}
      {set !== undefined && (
        <title>{`${set.translations?.[lang]?.name ?? set.translations.en.name} (${set.code?.toUpperCase()})
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}

      <WorkContextReloader cards={cards} />

      <div>
        {component}

        <OverviewHeader title={title?.label}>
          {set === undefined && !isRandomized && (
            <Pagination
              currentPage={cards?.data?.currentPage}
              lastPage={cards?.data?.pageCount}
              isLoading={isQueryLoading}
              setSettings={setSettings}
            />
          )}
        </OverviewHeader>
        {set && <SetBanner className={styles.setBanner} set={set} tcg={tcg} />}
        {isRandomized && (
          <Stack style={{ margin: '0.25rem 0' }}>
            <Group
              style={{ borderRadius: '0.25rem', backgroundColor: 'var(--gourmet-purple-1)', padding: '0.25rem 0.5rem' }}
              gap={'0.5rem'}
            >
              <IconArrowsShuffle size={18} color={'var(--gourmet-neutral-1)'} />
              <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'}>
                {t('randomized.info')}
              </GourmetText>
              <UnstyledButton
                onClick={() => {
                  fetchCards();
                }}
              >
                <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
                  {t('randomized.repeat')}
                </GourmetText>
              </UnstyledButton>
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

        <Stack gap={'0.25rem'} pt={'0.5rem'} pb={'0.5rem'}>
          <QueryExplanation
            isLoading={isLoading}
            currentPage={cards?.data?.currentPage}
            pageSize={set === undefined ? 60 : (searchDetails?.explain?.count ?? 0)}
            cardCount={searchDetails?.explain?.count ?? 0}
            explanation={searchDetails?.explain?.explanation ?? ''}
            randomized={isRandomized}
          />
          {user && searchDetails?.explain?.statisticsId && <QueryMenu details={searchDetails} />}
        </Stack>
        <QueryIgnoredDisplay queryDetails={cards?.data?.details} />

        <div style={{ padding: '0.5rem', width: '100%', height: '100%', position: 'relative' }}>
          <CardOverviewLoader isDisplayLoading={isDisplayLoading} />

          <ActiveListsContextProvider activeLists={activeLists}>
            {displaySettings.display === 'grid' && (
              <CardGrid tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={user ? toolsEnabled : false} />
            )}
            {displaySettings.display === 'table' && (
              <CardTable tcg={tcg} cards={cards} isLoading={isLoading} toolsEnabled={user ? toolsEnabled : false} />
            )}

            <TcgOverviewCardMenu
              tcg={tcg}
              onAddToList={(res) => {
                addResources([res], true);
              }}
              onRemoveFromList={(res) => {
                removeResources([res.resourceId]);
              }}
            />
          </ActiveListsContextProvider>
        </div>

        {set === undefined && !isRandomized && (
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

export function QueryIgnoredDisplay({ queryDetails }: { queryDetails?: TcgSearchCardsResult['data']['details'] }) {
  return (
    <>
      {(queryDetails?.ignored?.length ?? 0) > 0 && (
        <Accordion classNames={{ item: styles.item, root: styles.root, icon: styles.icon }}>
          <Accordion.Item value={'yeet'}>
            <Accordion.Control icon={<IconAlertCircleFilled />}>
              <Text>There are some ignored filters in your query</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {queryDetails?.ignored.map((ignore) => (
                <div key={ignore.value} style={{ display: 'flex', gap: '1rem' }}>
                  <code>{ignore.value}</code>
                  <span>{ignore.reason}</span>
                </div>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  );
}

export function OverviewHeader({ title, children }: PropsWithChildren<{ title?: string }>) {
  const smallScreen = useMediaQuery('(max-width: 800px)');

  return (
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
            {title}
          </GourmetText>
          {/*<IconCircleCheckFilled size={22} color={'var(--gourmet-green-1)'} />*/}
          <Stack h={'2rem'} justify={'start'}>
            <Tooltip label={'Our data might not be up to date.'} openDelay={500}>
              <IconClock size={18} color={'var(--gourmet-neutral-7)'} />
            </Tooltip>
          </Stack>
        </Group>
        {children}
      </Flex>
      <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
    </Stack>
  );
}
