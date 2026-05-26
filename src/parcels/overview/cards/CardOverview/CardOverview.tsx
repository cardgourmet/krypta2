import { Accordion, Divider, Flex, Group, Stack, Text, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconAlertCircleFilled, IconClock } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
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
import { TcgCardMenu } from '@/parcels/overview/cards/TcgCardMenu/TcgCardMenu.tsx';
import { OverviewSelectionDisplay } from '@/parcels/selection/OverviewSelectionDisplay/OverviewSelectionDisplay.tsx';
import type { TcgSearchCardsResult, TcgSearchParams } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import styles from './CardOverview.module.css';

export type OverviewSettings = Required<TcgSearchParams>;

export function CardOverview({ set, routeSearch }: { set?: TcgDataSet; routeSearch: TcgSearchParams }) {
  const tcg = useTcgByLocation() as Tcg;
  const { component, title } = useBreadcrumbs(
    set === undefined
      ? { subpage: 'Kartendatenbank' }
      : {
          subpage: '',
          moreSubpages: [
            {
              label: 'Sets',
              href: `/${tcg}/sets`,
            },
            {
              label: set.translations.en.name,
            },
          ],
        },
  );
  const { user } = useAuth();

  const { params, querySettings, displaySettings } = useTcgSearchSettings(routeSearch);
  const { cards, isLoading, isQueryLoading } = useCardOverviewData(querySettings, set);

  const scrollbackRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const [isDisplayLoading, setIsDisplayLoading] = useState<boolean>(false);
  const [overviewSettings, setOverviewSettings] = useState<OverviewSettings | undefined>({
    ...querySettings,
    ...displaySettings,
  });
  const prevOverviewSettings = usePrevious(overviewSettings);

  useEffect(() => {
    if (!overviewSettings) return;
    if (!tcg) return;
    if (!prevOverviewSettings || prevOverviewSettings === overviewSettings) return;

    if (set !== undefined) {
      navigate({
        to: '/$tcg/sets/$setCode',
        search: () => ({ ...overviewSettings }),
        params: {
          tcg: tcg,
          setCode: set.code!,
        },
        replace: true,
      });
    } else {
      navigate({
        to: '/$tcg/cards',
        search: () => ({ ...overviewSettings }),
        params: {
          tcg: tcg,
        },
        replace: true,
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

  return (
    <div ref={scrollbackRef}>
      {set === undefined && (
        <title>{`${(params.query?.length ?? 0) === 0 ? 'Card Database' : params.query}
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}
      {set !== undefined && (
        <title>{`${set.translations.en.name} (${set.code?.toUpperCase()})
      – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>
      )}

      <WorkContextReloader cards={cards} />

      <div>
        {component}

        <OverviewHeader title={title?.label}>
          {set === null && (
            <Pagination
              currentPage={cards?.data?.currentPage}
              lastPage={cards?.data?.pageCount}
              isLoading={isQueryLoading}
              setSettings={setSettings}
            />
          )}
        </OverviewHeader>
        {set && <SetBanner className={styles.setBanner} set={set} tcg={tcg} />}

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
          pageSize={set === undefined ? 60 : (cards?.data?.details?.count ?? 0)}
          cardCount={cards?.data?.details?.count ?? 0}
          explanation={cards?.data.details?.explanation ?? ''}
        />
        <QueryIgnoredDisplay queryDetails={cards?.data?.details} />

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
