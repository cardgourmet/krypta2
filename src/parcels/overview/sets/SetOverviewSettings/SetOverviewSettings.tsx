import { Group, Stack } from '@mantine/core';
import { startTransition, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestAnimationFrameTransition } from '@/parcels/animation/requestAnimationFrameTransition.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { useSetOverviewLoaderStore } from '@/parcels/overview/sets/SetOverviewLoader/SetOverviewLoader.tsx';
import { FilterButton } from '@/parcels/overview/sets/SetOverviewSettings/FilterButton.tsx';
import {
  defaultFilters,
  deserializeFilterString,
  type SetFilters,
  serializeFilters,
} from '@/parcels/overview/sets/SetOverviewSettings/setFilters.ts';
import { SimpleSearchbar } from '@/parcels/search/bar/SimpleSearchbar/SimpleSearchbar.tsx';
import { type SortDirection, sortDirections, type TcgSetGroupBy, type TcgSetSortBy } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';

export type OverviewSettings = {
  group: TcgSetGroupBy;
  order: SortDirection;
  q: string;
  sort: TcgSetSortBy;
  sortOrder: SortDirection;
};

export function SetOverviewSettings({
  tcg,
  overviewSettings,
  setOverviewSettings,
  metaData,
}: {
  tcg: Tcg;
  overviewSettings: OverviewSettings;
  setOverviewSettings: (update: ApplyFn<OverviewSettings>) => void;
  metaData: { types: string[] };
}) {
  const { t } = useTranslation('sets', { keyPrefix: 'settings' });

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
    groupBys.push('none');

    const items: Record<string, string> = fillTranslation('groupBy', groupBys as string[]);
    return items;
  }, [tcg, fillTranslation]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);
  const sortByItems = useMemo(() => {
    const sortBys = ['released', 'prints', 'name'];

    const items: Record<string, string> = fillTranslation('sortBy', sortBys as string[]);
    return items;
  }, [fillTranslation]);

  const [settings, setSettings] = useState<OverviewSettings>({ ...overviewSettings });

  const setIsLoading = useSetOverviewLoaderStore((s) => s.setLoading);
  const [filters, setFilters] = useState<SetFilters>(deserializeFilterString(overviewSettings.q));
  const setFiltersWrapped = useCallback(
    (f: SetFilters) => {
      setFilters(f);
      setIsLoading(true);

      requestAnimationFrameTransition(() => {
        const newSettings = { ...settings, q: serializeFilters(f) };

        setOverviewSettings(() => newSettings);
      });
    },
    [settings, setOverviewSettings, setIsLoading],
  );

  return (
    <Stack>
      <Group justify={'space-between'}>
        <Group gap={'1rem'}>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.groupBy')}
            </GourmetText>
            <TextDropdown
              items={groupByItems}
              t={t}
              transPrefix={'groupBy'}
              defaultSelected={settings.group}
              onSelect={(sel) => {
                setSettings({ ...settings, group: sel as TcgSetGroupBy });
                setIsLoading(true);

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, group: sel as TcgSetGroupBy };
                  });
                });
              }}
            />
            {settings.group !== 'none' && (
              <TextDropdown
                items={sortDirItems}
                t={t}
                transPrefix={'sortdir'}
                defaultSelected={settings.order}
                onSelect={(sel) => {
                  setSettings({ ...settings, order: sel as SortDirection });
                  setIsLoading(true);

                  startTransition(() => {
                    setOverviewSettings((prev) => {
                      return { ...prev, order: sel as SortDirection };
                    });
                  });
                }}
              />
            )}
          </Group>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.sortBy')}
            </GourmetText>
            <TextDropdown
              items={sortByItems}
              t={t}
              transPrefix={'sortBy'}
              defaultSelected={settings.sort}
              onSelect={(sel) => {
                setSettings({ ...settings, sort: sel as TcgSetSortBy });
                setIsLoading(true);

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, sort: sel as TcgSetSortBy };
                  });
                });
              }}
            />
            <TextDropdown
              items={sortDirItems}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={settings.sortOrder}
              onSelect={(sel) => {
                setSettings({ ...settings, sortOrder: sel as SortDirection });
                setIsLoading(true);

                startTransition(() => {
                  setOverviewSettings((prev) => {
                    return { ...prev, sortOrder: sel as SortDirection };
                  });
                });
              }}
            />
          </Group>
        </Group>

        <Group gap={'0.5rem'}>
          <FilterButton
            filters={filters}
            setFilters={setFiltersWrapped}
            clearFilters={() => setFiltersWrapped({ ...defaultFilters, name: filters.name })}
            metaData={metaData}
          />
          <SimpleSearchbar
            value={filters.name}
            onChange={(searchQuery) => {
              setFiltersWrapped({ ...filters, name: searchQuery });
            }}
          />
        </Group>
      </Group>
    </Stack>
  );
}
