import { Center, Divider, Group, SimpleGrid, Stack } from '@mantine/core';
import { createFileRoute, Link, notFound, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.ts';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { type DlcDataSet, fetchDlcSets } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgSets, type MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import {
  fetchPcgEras,
  fetchPcgSets,
  type PcgDataEra,
  type PcgDataEras,
  type PcgDataSet,
} from '@/parcels/tcg/pcg/api.ts';
import { TcgSetIcon } from '@/parcels/tcg/TcgSetIcon.tsx';
import {
  type SortDirection,
  sortDirections,
  type TcgDataSets,
  type TcgSetGroupBy,
  tcgSetsParamsDefaults,
  tcgSetsParamsSchema,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import styles from './index.module.css';

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

    let erasRes: GourmetApiResponse<PcgDataEras> | undefined;
    if (params.tcg === 'pcg') {
      erasRes = await fetchPcgEras();
    }
    return { setsRes: res, erasRes: erasRes };
  },
  validateSearch: tcgSetsParamsSchema,
  search: {
    middlewares: [stripSearchParams(tcgSetsParamsDefaults)],
  },
});

function RouteComponent() {
  const { tcg } = Route.useParams();
  const { setsRes: data, erasRes: erasData } = Route.useLoaderData();
  const erasById: Record<string, PcgDataEra> = useMemo(() => {
    return (
      erasData?.data?.items?.reduce((map: Record<string, PcgDataEra>, obj: PcgDataEra) => {
        map[obj.id] = obj;
        return map;
      }, {}) ?? {}
    );
  }, [erasData?.data?.items]);
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

          return ['main_expansion', 'special_expansion', 'energies'].includes(s.type);
        }) ?? [];
    }
    // always sort the sets by date first before grouping.
    filteredSets.sort((a, b) => {
      const dateA = getReleaseDate(tcg as Tcg, a)?.getTime() ?? 0;
      const dateB = getReleaseDate(tcg as Tcg, b)?.getTime() ?? 0;

      if (search.order === 'asc') return dateA - dateB;
      return (dateA - dateB) * -1;
    });

    if (settings.groupBy === 'year') {
      const setsByYear = groupBy<TcgDataSet, number>(filteredSets, (set) => {
        const releaseDate = getReleaseDate(tcg as Tcg, set);

        if (releaseDate === undefined) return 0 as number;
        return new Date(releaseDate).getFullYear();
      });
      const setsByYearArr = Object.entries(setsByYear).map(([year, sets]) => ({
        year: Number(year),
        era: undefined,
        sets,
      }));

      setsByYearArr.sort((a, b) => {
        if (search.order === 'asc') return a.year - b.year;
        return (a.year - b.year) * -1;
      });

      return setsByYearArr;
    } else if (settings.groupBy === 'era') {
      const setsByEra = groupBy<TcgDataSet, string>(filteredSets, (set) => {
        if (tcg === 'pcg') {
          return (set as PcgDataSet).eraId;
        }
        return '';
      });
      const setsByEraArr = Object.entries(setsByEra).map(([eraId, sets]) => ({
        era: eraId,
        year: undefined,
        sets,
      }));

      setsByEraArr.sort((a, b) => {
        const eraA = erasById[a.era];
        const eraB = erasById[b.era];
        const ancientDate = new Date(0);

        const dateA = eraA?.from ? new Date(eraA.from) : ancientDate;
        const dateB = eraB?.from ? new Date(eraB.from) : ancientDate;

        if (search.order === 'asc') return dateA.getTime() - dateB.getTime();
        return (dateA.getTime() - dateB.getTime()) * -1;
      });

      return setsByEraArr;
    }
    return [];
  }, [data?.data, tcg, search.order, settings.groupBy, erasById]);

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

        <Stack mb={'1.5rem'}>
          <SetOverviewSettings tcg={tcg as Tcg} overviewSettings={search} setOverviewSettings={setSettingsWrapper} />
        </Stack>

        <Stack gap={'2rem'}>
          {sortedSets.map((e) => {
            const era: PcgDataEra | undefined = erasById[e.era ?? ''];
            const eraName = era?.translations?.en?.name;

            return (
              <Stack key={e?.year ?? e.era} gap={'0.5rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fw={400} fz={'1.2rem'}>
                  {e?.year ?? eraName}
                </GourmetText>

                <SimpleGrid cols={4}>
                  {e.sets.map((set) => (
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

        <Stack justify={'end'} h={'100%'}>
          <Group justify={'space-between'}>
            <GourmetText cgmff={'ui'}>{set.printsAvailable} prints</GourmetText>
            <GourmetText cgmff={'ui'}>{date}</GourmetText>
          </Group>
        </Stack>
      </Stack>
    </Stack>
  );
}

function getReleaseDate(tcg: Tcg, set: TcgDataSet): Date | undefined {
  let releaseDate: string | undefined;
  if (tcg === 'mtg') {
    releaseDate = (set as MtgDataSet).releaseDate;
  } else if (tcg === 'pcg') {
    releaseDate = (set as PcgDataSet).releaseStartDate ?? undefined;
  } else if (tcg === 'dlc') {
    releaseDate = (set as DlcDataSet).releaseDate;
  }

  return releaseDate ? new Date(releaseDate) : undefined;
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
