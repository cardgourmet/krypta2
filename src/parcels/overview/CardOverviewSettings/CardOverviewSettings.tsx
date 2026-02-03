import { useMediaQuery } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchParams,
  type DlcSearchQuerySettings,
  type DlcSortBy,
  dlcSortBys,
} from '@/parcels/tcg/dlc/types.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchParams,
  type PcgSearchQuerySettings,
  type PcgSortBy,
  pcgSortBys,
} from '@/parcels/tcg/pcg/types.ts';
import {
  type DisplayMode,
  displayModes,
  type PageSize,
  pageSizes,
  type SortDirection,
  sortDirections,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import Dropdown from '../Dropdown/Dropdown.tsx';
import styles from './CardOverviewSettings.module.css';
import type {MtgSearchDisplaySettings, MtgSearchParams, MtgSearchQuerySettings} from "@/parcels/tcg/mtg/types.ts";

type CardOverviewSettingsProps = {
  tcg: Tcg;
  querySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
  displaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;
  setSettings: (update: ApplyFn<MtgSearchParams | DlcSearchParams | PcgSearchParams>) => void;
};

export default function CardOverviewSettings({
  tcg,
  querySettings,
  displaySettings,
  setSettings,
}: CardOverviewSettingsProps) {
  const { t } = useTranslation('cards', { keyPrefix: `${tcg}` });
  function fillTranslation(prefix: string, elements: string[]) {
    const items: Record<string, string> = {};
    elements.forEach((sortBy) => {
      items[sortBy as string] = t(`${prefix}.${(sortBy as string).toLowerCase()}`);
    });
    return items;
  }

  const smallScreen = useMediaQuery('(max-width: 720px)');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (isSidebarOpen) {
      // Disable scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSidebarOpen]);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((sidebarRef.current?.offsetLeft ?? -1) < 0) return;
      if (isSidebarOpen && !sidebarRef.current?.contains(event.target as Element)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const setSettingsWrapper: typeof setSettings = (update) => {
    setIsSidebarOpen(false);

    setSettings(update);
  };

  let sortBys: readonly DlcSortBy[] | readonly PcgSortBy[] = dlcSortBys;
  if (tcg === 'pcg') {
    sortBys = pcgSortBys;
  }
  const sortByItems = fillTranslation('sortby', sortBys as string[]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);
  const pageSizeItems = fillTranslation('pagesize', pageSizes as readonly PageSize[] as string[]);
  const displayModeItems = fillTranslation('displaymode', displayModes as readonly DisplayMode[] as string[]);

  return (
    <div className={styles.settings}>
      {smallScreen && (
        <div>
          <div className={`${styles.settingsSidebar} ${isSidebarOpen ? styles.shown : ''}`} ref={sidebarRef}>
            <div className={styles.settingsSidebarHeader}>
              <button type="button" onClick={() => setIsSidebarOpen(false)}>
                <IconX size={20} />
              </button>
            </div>
            <div className={styles.settingsSidebarContent}>
              <div>
                <p>{t('common.sortby')}</p>
                <Dropdown
                  items={sortByItems}
                  defaultSelected={querySettings.sortBy}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortBy: selected as DlcSortBy | PcgSortBy };
                    });
                  }}
                />
                <Dropdown
                  items={sortDirItems}
                  defaultSelected={querySettings.sortDirection}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortDirection: selected as SortDirection };
                    });
                  }}
                />
              </div>
              <div>
                <p>{t('common.show')}</p>
                <Dropdown
                  items={pageSizeItems}
                  defaultSelected={querySettings.pageSize}
                  onSelect={(selected) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, pageSize: selected as PageSize };
                    });
                  }}
                />
              </div>
              <div>
                <p>{t('common.as')}</p>
                <Dropdown
                  items={displayModeItems}
                  defaultSelected={displaySettings.cardDisplayMode}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, cardDisplayMode: selected as DisplayMode };
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <button type="button" className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
            <IconAdjustmentsHorizontal />
            <p>Einstellungen</p>
          </button>
        </div>
      )}
      {!smallScreen && (
        <>
          <div>
            <p>{t('common.sortby')}</p>
            <Dropdown
              items={sortByItems}
              defaultSelected={querySettings.sortBy}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortBy: selected as DlcSortBy | PcgSortBy };
                });
              }}
            />
            <Dropdown
              items={sortDirItems}
              defaultSelected={querySettings.sortDirection}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortDirection: selected as SortDirection };
                });
              }}
            />
          </div>
          <div>
            <p>{t('common.show')}</p>
            <Dropdown
              items={pageSizeItems}
              defaultSelected={querySettings.pageSize}
              onSelect={(selected) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, pageSize: selected as PageSize };
                });
              }}
            />
            <p>{t('common.as')}</p>
            <Dropdown
              items={displayModeItems}
              defaultSelected={displaySettings.cardDisplayMode}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, cardDisplayMode: selected as DisplayMode };
                });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
