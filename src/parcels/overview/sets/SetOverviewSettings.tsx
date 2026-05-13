import {Group, Stack} from '@mantine/core';
import {startTransition, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import {type SortDirection, sortDirections, type TcgSetGroupBy} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';

export type OverviewSettings = {
  groupBy: TcgSetGroupBy;
  order: SortDirection;
};

export function SetOverviewSettings({
  tcg,
  overviewSettings,
  setOverviewSettings,
}: {
  tcg: Tcg;
  overviewSettings: OverviewSettings;
  setOverviewSettings: (update: ApplyFn<OverviewSettings>) => void;
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
