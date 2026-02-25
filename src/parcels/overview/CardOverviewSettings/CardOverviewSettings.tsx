import {Button, Drawer, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconSettings} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {DesktopOverviewSettings} from '@/parcels/overview/CardOverviewSettings/DesktopOverviewSettings/DesktopOverviewSettings.tsx';
import {MobileOverviewSettings} from '@/parcels/overview/CardOverviewSettings/MobileOverviewSettings/MobileOverviewSettings.tsx';
import {type DlcSearchDisplaySettings, type DlcSearchParams, type DlcSearchQuerySettings, dlcSortBys, dlcUniqueBys,} from '@/parcels/tcg/dlc/types.ts';
import {type MtgSearchDisplaySettings, type MtgSearchParams, type MtgSearchQuerySettings, mtgSortBys, mtgUniqueBys,} from '@/parcels/tcg/mtg/types.ts';
import {type PcgSearchDisplaySettings, type PcgSearchParams, type PcgSearchQuerySettings, pcgSortBys, pcgUniqueBys,} from '@/parcels/tcg/pcg/types.ts';
import {type SortDirection, sortDirections, type TcgSortBy, type TcgUniqueBy} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import styles from './CardOverviewSettings.module.css';

export type CardOverviewSettingsProps = {
  tcg: Tcg;
  querySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
  displaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;
  setSettings: (update: ApplyFn<MtgSearchParams | DlcSearchParams | PcgSearchParams>) => void;
  toolsEnabled: boolean;
  setToolsEnabled: (tools: boolean) => void;
};

export default function CardOverviewSettings({
  tcg,
  querySettings,
  displaySettings,
  setSettings,
  toolsEnabled,
  setToolsEnabled,
}: CardOverviewSettingsProps) {
  const { t } = useTranslation('cards', { keyPrefix: `${tcg}` });
  function fillTranslation(prefix: string, elements: string[]) {
    const items: Record<string, string> = {};
    elements.forEach((sortBy) => {
      items[sortBy as string] = t(`${prefix}.${(sortBy as string).toLowerCase()}`);
    });
    return items;
  }

  const smallScreen = useMediaQuery('(max-width: 800px)');

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const setSettingsWrapper: typeof setSettings = (update) => {
    setSidebarOpen(false);

    setSettings(update);
  };

  const sortBys: readonly TcgSortBy[] = useMemo(() => {
    if (tcg === 'pcg') {
      return pcgSortBys;
    } else if (tcg === 'mtg') {
      return mtgSortBys;
    } else {
      return dlcSortBys;
    }
  }, [tcg]);
  const uniqueBys: readonly TcgUniqueBy[] = useMemo(() => {
    if (tcg === 'pcg') {
      return pcgUniqueBys;
    } else if (tcg === 'mtg') {
      return mtgUniqueBys;
    } else {
      return dlcUniqueBys;
    }
  }, [tcg]);
  const sortByItems = fillTranslation('sortby', sortBys as string[]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);
  const uniqueByItems = fillTranslation('uniqueby', uniqueBys as string[]);

  return (
    <div className={styles.settings}>
      <Drawer
        position={'left'}
        style={{ backgroundColor: 'var(--gourmet-neutral-0)' }}
        size="100%"
        opened={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        withCloseButton={false}
      >
        <MobileOverviewSettings
          t={t}
          sortByItems={sortByItems}
          defaultSortBy={querySettings.sortBy}
          sortDirItems={sortDirItems}
          defaultSortDirection={querySettings.sortDirection}
          uniqueByItems={uniqueByItems}
          defaultUniqueBy={querySettings.uniqueBy}
          defaultDisplayMode={displaySettings.display}
          toolsEnabled={toolsEnabled}
          setToolsEnabled={setToolsEnabled}
          setSettingsWrapper={setSettingsWrapper}
          close={() => setSidebarOpen(false)}
        />
      </Drawer>

      {!smallScreen && (
        <DesktopOverviewSettings
          t={t}
          sortByItems={sortByItems}
          defaultSortBy={querySettings.sortBy}
          sortDirItems={sortDirItems}
          defaultSortDirection={querySettings.sortDirection}
          uniqueByItems={uniqueByItems}
          defaultUniqueBy={querySettings.uniqueBy}
          defaultDisplayMode={displaySettings.display}
          toolsEnabled={toolsEnabled}
          setToolsEnabled={setToolsEnabled}
          setSettingsWrapper={setSettingsWrapper}
        />
      )}
      {smallScreen && (
        <Group>
          <Button
            onClick={() => setSidebarOpen(true)}
            color={'var(--gourmet-neutral-2)'}
            leftSection={
              <Group gap={'0.5rem'}>
                <IconSettings size={20} color={'var(--gourmet-neutral-9)'} />
                <GourmetText cgmff={'ui'}>{t('common.settings')}</GourmetText>
              </Group>
            }
          ></Button>
        </Group>
      )}
    </div>
  );
}
