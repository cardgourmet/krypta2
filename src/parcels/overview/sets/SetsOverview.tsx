import { Divider, Stack } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { getReleaseDate, groupByEra, groupByYear } from '@/parcels/overview/sets/helpers.ts';
import { SetOverviewGrid } from '@/parcels/overview/sets/SetOverviewGrid/SetOverviewGrid.tsx';
import { type OverviewSettings, SetOverviewSettings } from '@/parcels/overview/sets/SetOverviewSettings.tsx';
import type { PcgDataEra, PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';
import { Route } from '@/routes/$tcg/sets';

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

    if (settings.group === 'year') {
      return groupByYear(tcg as Tcg, filteredSets, settings.order);
    } else if (settings.group === 'era') {
      return groupByEra(tcg as Tcg, filteredSets, settings.order, erasById);
    }
    return [];
  }, [data?.data, tcg, settings.group, erasById, settings.order]);

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
