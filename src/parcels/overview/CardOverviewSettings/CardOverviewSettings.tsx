import {Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchParams,
  type DlcSearchQuerySettings,
  type DlcSortBy,
  dlcSortBys,
  type DlcUniqueBy,
  dlcUniqueBys,
} from '@/parcels/tcg/dlc/types.ts';
import {
  type MtgSearchDisplaySettings,
  type MtgSearchParams,
  type MtgSearchQuerySettings,
  type MtgSortBy,
  mtgSortBys,
  type MtgUniqueBy,
  mtgUniqueBys,
} from '@/parcels/tcg/mtg/types.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchParams,
  type PcgSearchQuerySettings,
  type PcgSortBy,
  pcgSortBys,
  type PcgUniqueBy,
  pcgUniqueBys,
} from '@/parcels/tcg/pcg/types.ts';
import {type DisplayMode, displayModes, type SortDirection, sortDirections, type TcgSortBy, type TcgUniqueBy,} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import styles from './CardOverviewSettings.module.css';

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

  const sortBys: readonly DlcSortBy[] | readonly PcgSortBy[] | readonly MtgSortBy[] = useMemo(() => {
    if (tcg === 'pcg') {
      return pcgSortBys;
    } else if (tcg === 'mtg') {
      return mtgSortBys;
    } else {
      return dlcSortBys;
    }
  }, [tcg]);
  const uniqueBys: readonly DlcUniqueBy[] | readonly PcgUniqueBy[] | readonly MtgUniqueBy[] = useMemo(() => {
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
  const displayModeItems = fillTranslation('displaymode', displayModes as readonly DisplayMode[] as string[]);

  return (
    <div className={styles.settings}>
      {!smallScreen && (
        <Group gap={'1rem'}>
          <Group gap={'0.5rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.sortby')}
            </GourmetText>
            <TextDropdown
              items={sortByItems}
              t={t}
              transPrefix={'sortby'}
              defaultSelected={querySettings.sortBy}
              onSelect={(sel) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortBy: sel as TcgSortBy };
                });
              }}
            />
            <TextDropdown
              items={sortDirItems}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={querySettings.sortDirection}
              onSelect={(sel) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortDirection: sel as SortDirection };
                });
              }}
            />
          </Group>
          <Group gap={'0.5rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.show')}
            </GourmetText>
            <TextDropdown
              items={uniqueByItems}
              t={t}
              transPrefix={'uniqueby'}
              defaultSelected={querySettings.uniqueBy}
              onSelect={(sel) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, uniqueBy: sel as TcgUniqueBy };
                });
              }}
            />
          </Group>
        </Group>
      )}

      {/*{smallScreen && (
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
                      return { ...prev, sortBy: selected as DlcSortBy | PcgSortBy | MtgSortBy };
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
                  items={uniqueByItems}
                  defaultSelected={querySettings.uniqueBy}
                  onSelect={(selected) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, pageSize: selected as DlcUniqueBy | PcgUniqueBy | MtgUniqueBy };
                    });
                  }}
                />
              </div>
              <div>
                <p>{t('common.as')}</p>
                <Dropdown
                  items={displayModeItems}
                  defaultSelected={displaySettings.display}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, display: selected as DisplayMode };
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <button type="button" className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
            <IconAdjustmentsHorizontal />
          </button>
        </div>
      )}*/}
    </div>
  );
}
