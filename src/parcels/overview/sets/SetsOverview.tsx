import { Divider, Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { getReleaseDate, groupByEra, groupByYear } from '@/parcels/overview/sets/helpers.ts';
import { SetOverviewGrid } from '@/parcels/overview/sets/SetOverviewGrid/SetOverviewGrid.tsx';
import {
  SetOverviewLoader,
  useSetOverviewLoaderStore,
} from '@/parcels/overview/sets/SetOverviewLoader/SetOverviewLoader.tsx';
import {
  type OverviewSettings,
  SetOverviewSettings,
} from '@/parcels/overview/sets/SetOverviewSettings/SetOverviewSettings.tsx';
import { deserializeFilterString } from '@/parcels/overview/sets/SetOverviewSettings/setFilters.ts';
import type { PcgDataEra, PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import { Route } from '@/routes/$tcg/sets';

export type GroupedSet = { era?: string; year?: number; sets: TcgDataSet[] };

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
  const setTypes = useMemo(() => {
    return [...new Set(data?.data?.items?.map((s) => s.type) ?? [])];
  }, [data?.data?.items]);
  const search = Route.useSearch();

  const [settings, setSettings] = useState<OverviewSettings>(search);
  const prevSettings = usePrevious(settings);
  const navigate = useNavigate();
  const setIsLoading = useSetOverviewLoaderStore((s) => s.setLoading);
  useEffect(() => {
    if (!settings) return;
    if (!tcg) return;
    if (!prevSettings || prevSettings === settings) return;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: '/$tcg/sets',
      search: () => ({ ...settings }),
      params: {
        tcg: tcg,
      },
      replace: true,
    });

    setIsLoading(false);
  }, [settings, navigate, tcg, prevSettings, setIsLoading]);

  const setSettingsWrapper = useCallback(
    (apply: ApplyFn<OverviewSettings>) => {
      const newSettings = apply(settings);
      setSettings(newSettings);
    },
    [settings],
  );

  const { component, title } = useBreadcrumbs({ subpage: t('header.title') });
  const sortedSets: GroupedSet[] = useMemo(() => {
    if (!data?.data) return [];

    return filterAndSortSets(tcg as Tcg, settings, data.data.items as TcgDataSet[], erasById);
  }, [data?.data, tcg, settings.group, erasById, settings]);

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
          <SetOverviewSettings
            tcg={tcg as Tcg}
            overviewSettings={search}
            setOverviewSettings={setSettingsWrapper}
            metaData={{
              types: setTypes,
            }}
          />
        </Stack>

        <div style={{ padding: '0.5rem', width: '100%', height: '100%', position: 'relative' }}>
          <SetOverviewLoader />

          <SetOverviewGrid tcg={tcg} groupedSets={sortedSets} erasById={erasById} />
        </div>
      </div>
    </>
  );
}

function filterAndSortSets(
  tcg: Tcg,
  settings: OverviewSettings,
  sets: TcgDataSet[],
  erasById: Record<string, PcgDataEra>,
) {
  let filteredSets = sets;
  if (tcg === 'pcg') {
    filteredSets =
      filteredSets?.filter((set) => {
        const s = set as PcgDataSet;

        return ['main_expansion', 'special_expansion', 'energies'].includes(s.type);
      }) ?? [];
  }

  // now filter by the search query
  const setFilters = deserializeFilterString(settings.q);
  if (setFilters.name.length > 0) {
    filteredSets = filteredSets.filter((s) => {
      const name = s.translations.en.name;

      return name.toLowerCase().includes(setFilters.name.toLowerCase());
    });
  }
  if (setFilters.types.length > 0) {
    filteredSets = filteredSets.filter((set) => {
      return setFilters.types.includes(set.type);
    });
  }

  // always sort the sets first before grouping.
  filteredSets.sort((a, b) => {
    if (settings.sort === 'released') {
      const dateA = getReleaseDate(tcg as Tcg, a)?.getTime() ?? 0;
      const dateB = getReleaseDate(tcg as Tcg, b)?.getTime() ?? 0;

      if (settings.sortOrder === 'asc') return dateA - dateB;
      return (dateA - dateB) * -1;
    } else if (settings.sort === 'prints') {
      if (settings.sortOrder === 'asc') return a.printsAvailable - b.printsAvailable;
      return (a.printsAvailable - b.printsAvailable) * -1;
    } else if (settings.sort === 'name') {
      const nameA = a.translations.en.name;
      const nameB = b.translations.en.name;

      if (settings.sortOrder === 'asc') return nameA.localeCompare(nameB);
      return nameA.localeCompare(nameB) * -1;
    }
    return 0;
  });

  if (settings.group === 'year') {
    return groupByYear(tcg as Tcg, filteredSets, settings.order);
  } else if (settings.group === 'era') {
    return groupByEra(tcg as Tcg, filteredSets, settings.order, erasById);
  } else if (settings.group === 'none') {
    return [{ sets: filteredSets }];
  }
  return [];
}
