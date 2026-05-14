import {Divider, Stack} from '@mantine/core';
import {useNavigate} from '@tanstack/react-router';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {groupBy} from '@/parcels/groupBy.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {SetOverviewGrid} from '@/parcels/overview/sets/SetOverviewGrid/SetOverviewGrid.tsx';
import {type OverviewSettings, SetOverviewSettings} from '@/parcels/overview/sets/SetOverviewSettings.tsx';
import type {DlcDataSet} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataSet} from '@/parcels/tcg/mtg/api.ts';
import type {PcgDataEra, PcgDataSet} from '@/parcels/tcg/pcg/api.ts';
import type {SortDirection} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {usePrevious} from '@/parcels/usePrevious.ts';
import {Route} from '@/routes/$tcg/sets';

export function SetsOverview() {
  const { t } = useTranslation('sets');

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

  const { component, title } = useBreadcrumbs({ subpage: t('header.title') });
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

      if (settings.order === 'asc') return dateA - dateB;
      return (dateA - dateB) * -1;
    });

    if (settings.groupBy === 'year') {
      return groupByYear(tcg as Tcg, filteredSets, settings.order);
    } else if (settings.groupBy === 'era') {
      return groupByEra(tcg as Tcg, filteredSets, settings.order, erasById);
    }
    return [];
  }, [data?.data, tcg, settings.groupBy, erasById, settings.order]);

  // TODO: cutoffs
  // 1100px: 3 per row
  //

  return (
    <>
      <title>{`${t('pageTitle')} – ${t(`tcg.${tcg}`)} – Cardgourmet`}</title>

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

        <SetOverviewGrid tcg={tcg} sortedSets={sortedSets} erasById={erasById} />
      </div>
    </>
  );
}

function groupByEra(tcg: Tcg, sets: TcgDataSet[], order: SortDirection, erasById: Record<string, PcgDataEra>) {
  const setsByEra = groupBy<TcgDataSet, string>(sets, (set) => {
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

    if (order === 'asc') return dateA.getTime() - dateB.getTime();
    return (dateA.getTime() - dateB.getTime()) * -1;
  });

  return setsByEraArr;
}

function groupByYear(tcg: Tcg, sets: TcgDataSet[], order: SortDirection) {
  const setsByYear = groupBy<TcgDataSet, number>(sets, (set) => {
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
    if (order === 'asc') return a.year - b.year;
    return (a.year - b.year) * -1;
  });

  return setsByYearArr;
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
