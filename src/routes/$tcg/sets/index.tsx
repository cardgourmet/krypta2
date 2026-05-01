import { Center, Divider, Group, SimpleGrid, Stack } from '@mantine/core';
import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.ts';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { type DlcDataSet, fetchDlcSets } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgSets, type MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgSets, type PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import { TcgSetIcon } from '@/parcels/tcg/TcgSetIcon.tsx';
import {
  type SortDirection,
  sortDirections,
  type TcgDataSets,
  type TcgSetGroupBy,
  tcgSetsParamsSchema,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './index.module.css';
import { usePrevious } from '@/parcels/usePrevious.ts';
import type { ApplyFn } from '@/parcels/types.ts';

export const Route = createFileRoute('/$tcg/sets/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  loader: async ({ params }) => {
    let res: GourmetApiResponse<TcgDataSets> | undefined;
    if (params.tcg === 'mtg') {
      res = await fetchMtgSets();
    } else if (params.tcg === 'pcg') {
      res = await fetchPcgSets();
    } else if (params.tcg === 'dlc') {
      res = await fetchDlcSets();
    }
    return res;
  },
  validateSearch: tcgSetsParamsSchema,
});

function RouteComponent() {
  const { tcg } = Route.useParams();
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  const [settings, setSettings] = useState<OverviewSettings>(search);
  const prevSettings = usePrevious(settings);
  const navigate = useNavigate();
  useEffect(() => {
    if (!settings) return;
    if (!tcg) return;
    if (!prevSettings || prevSettings === settings) return;

    navigate({
      to: '/$tcg/sets',
      search: () => ({ ...settings }),
      params: {
        tcg: tcg,
      },
      replace: true,
    });
  }, [settings, navigate, tcg, prevSettings]);
  const setSettingsWrapper = useCallback(
    (apply: ApplyFn<OverviewSettings>) => {
      setSettings(apply(settings));
      //setIsDisplayLoading(false);
    },
    [settings],
  );

  // const { t } = useTranslation('sets');

  const { component, title } = useBreadcrumbs({ subpage: 'Alle Sets' });
  const sortedSets = useMemo(() => {
    if (!data?.data) return [];

    let filteredSets = data.data.items as TcgDataSet[];
    if (tcg === 'pcg') {
      filteredSets =
        filteredSets?.filter((set) => {
          const s = set as PcgDataSet;

          return s.region === 'int' && ['main_expansion', 'special_expansion', 'energies'].includes(s.type);
        }) ?? [];
    }

    const setsByYear = groupBy<TcgDataSet, number>(filteredSets, (set) => {
      let releaseDate: string | undefined;
      if (tcg === 'mtg') {
        releaseDate = (set as MtgDataSet).releaseDate;
      } else if (tcg === 'pcg') {
        releaseDate = (set as PcgDataSet).releaseStartDate ?? undefined;
      } else if (tcg === 'dlc') {
        releaseDate = (set as DlcDataSet).releaseDate;
      }

      if (releaseDate === undefined) return 0 as number;
      return new Date(releaseDate).getFullYear();
    });
    const setsByYearArr = Object.entries(setsByYear).map(([year, sets]) => ({
      year: Number(year),
      sets,
    }));

    setsByYearArr.sort((a, b) => {
      if (search.order === 'asc') return a.year - b.year;
      return (a.year - b.year) * -1;
    });

    return setsByYearArr;
  }, [data?.data, tcg, search.order]);

  return (
    <>
      <title>{`All Sets Overview – ${tcg === 'mtg' ? 'Magic: The Gathering' : tcg === 'dlc' ? 'Disney Lorcana' : 'Pokémon Card Game'} – Cardgourmet`}</title>

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
          <Stack p={'0.5rem 0'}>
            <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
              {title?.label}
            </GourmetText>
          </Stack>

          <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
        </Stack>

        <Stack mb={'1rem'}>
          <SetOverviewSettings tcg={tcg as Tcg} overviewSettings={search} setOverviewSettings={setSettingsWrapper} />
        </Stack>

        <Stack>
          {sortedSets.map(({ year, sets }) => {
            return (
              <Stack key={year} gap={'0.5rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={400} fz={'1.2rem'}>
                  {year}
                </GourmetText>

                <SimpleGrid cols={4}>
                  {sets.map((set) => (
                    <SetCard key={set.id} tcg={tcg as Tcg} set={set} />
                  ))}
                </SimpleGrid>
              </Stack>
            );
          })}
        </Stack>
      </div>
    </>
  );
}

type OverviewSettings = {
  groupBy: TcgSetGroupBy;
  order: SortDirection;
};

function SetOverviewSettings({
  tcg,
  overviewSettings,
  setOverviewSettings,
}: {
  tcg: Tcg;
  overviewSettings: OverviewSettings;
  setOverviewSettings: (update: ApplyFn<OverviewSettings>) => void;
}) {
  const { t } = useTranslation('sets');

  const fillTranslation = useCallback(
    (prefix: string, elements: string[]) => {
      const items: Record<string, string> = {};
      elements.forEach((sortBy) => {
        items[sortBy as string] = t(`${prefix}.${(sortBy as string).toLowerCase()}`);
      });
      return items;
    },
    [t],
  );
  const groupByItems = useMemo(() => {
    const groupBys = ['year'];
    if (tcg === 'pcg') {
      groupBys.push('era');
    }

    const items: Record<string, string> = fillTranslation('groupBy', groupBys as string[]);
    return items;
  }, [tcg, fillTranslation]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);

  const [settings, setSettings] = useState<OverviewSettings>({ ...overviewSettings });

  return (
    <Stack>
      <Group gap={'1rem'}>
        <Group gap={'0.25rem'}>
          <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
            {t('common.groupBy')}
          </GourmetText>
          <TextDropdown
            items={groupByItems}
            t={t}
            transPrefix={'groupBy'}
            defaultSelected={settings.groupBy}
            onSelect={(sel) => {
              setSettings({ ...settings, groupBy: sel as TcgSetGroupBy });

              startTransition(() => {
                setOverviewSettings((prev) => {
                  return { ...prev, groupBy: sel as TcgSetGroupBy };
                });
              });
            }}
          />
          <TextDropdown
            items={sortDirItems}
            t={t}
            transPrefix={'sortdir'}
            defaultSelected={settings.order}
            onSelect={(sel) => {
              setSettings({ ...settings, order: sel as SortDirection });

              startTransition(() => {
                setOverviewSettings((prev) => {
                  return { ...prev, order: sel as SortDirection };
                });
              });
            }}
          />
        </Group>
      </Group>
    </Stack>
  );
}

function SetCard({ tcg, set }: { tcg: Tcg; set: TcgDataSet }) {
  const language = 'en';
  const translation = set.translations[language];

  const name = translation?.name ?? 'translation not found';
  const logoUrl = translation?.imageUrls?.logo ?? '';

  let date = new Date().toLocaleDateString();
  if (tcg === 'mtg') {
    date = (set as MtgDataSet).releaseDate;
  } else if (tcg === 'pcg') {
    date = (set as PcgDataSet).releaseStartDate ?? '';
  } else if (tcg === 'dlc') {
    date = (set as DlcDataSet).releaseDate;
  }

  return (
    <Stack className={styles.setCard}>
      <Stack gap={'0.75rem'} h={'100%'}>
        <Stack gap="0.15rem">
          <Group wrap={'nowrap'} gap={'0.75rem'}>
            <div style={{ alignSelf: 'start' }}>
              <TcgSetIcon tcg={tcg} setCode={set.code ?? '?'} />
            </div>
            <div>
              <Link
                to={'/$tcg/sets/$setCode'}
                params={{ tcg: tcg, setCode: set.code ?? '?' }}
                className={styles.setCardLink}
              >
                <GourmetText cgmc={'neutral-8'} span>
                  {name}
                </GourmetText>
              </Link>
              <GourmetText cgmc={'neutral-6'} fz={'0.85rem'} span>
                {set.code}
              </GourmetText>
            </div>
          </Group>
          <Group justify={'start'}>
            <div className={styles.setTypeTag}>
              <GourmetText cgmff={'monospace'} fz={'0.75rem'}>
                {set.type}
              </GourmetText>
            </div>
          </Group>
        </Stack>

        <Center>
          {logoUrl && (
            <Link
              to={'/$tcg/sets/$setCode'}
              params={{ tcg: tcg, setCode: set.code ?? '?' }}
              className={styles.setCardLink}
            >
              <img src={logoUrl} alt={'banner'} style={{ maxWidth: '100%', maxHeight: '5rem' }} />
            </Link>
          )}
          {!logoUrl && (
            <Center style={{ height: '5rem' }}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                No image available.
              </GourmetText>
            </Center>
          )}
        </Center>

        <Stack justify={'space-between'} h={'100%'}>
          <Group justify={'space-between'}>
            <GourmetText cgmff={'ui'}>{set.printsAvailable} prints</GourmetText>
            <GourmetText cgmff={'ui'}>{date}</GourmetText>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
}

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce(
    (groups, item) => {
      // biome-ignore lint/suspicious/noAssignInExpressions: <>
      (groups[key(item)] ||= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
