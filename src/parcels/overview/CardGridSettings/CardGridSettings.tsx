import { useMediaQuery } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountElements,
  cardDisplayModeElements,
  type SortDirection,
  sortDirectionElements,
} from '@/parcels/overview/types.ts';
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
import type { Tcg } from '@/parcels/tcg/useTcg.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import Dropdown from '../Dropdown/Dropdown.tsx';
import styles from './CardGridSettings.module.css';

type CardGridSettingsProps = {
  tcg: Tcg;
  querySettings: DlcSearchQuerySettings | PcgSearchQuerySettings;
  displaySettings: DlcSearchDisplaySettings | PcgSearchDisplaySettings;
  setSettings: (update: ApplyFn<DlcSearchParams | PcgSearchParams>) => void;
};

export default function CardGridSettings({ tcg, querySettings, displaySettings, setSettings }: CardGridSettingsProps) {
  const { t } = useTranslation('translation', { keyPrefix: `${tcg}` });
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
  const sortByItems: Record<string, string> = {};
  sortBys.forEach((sortBy) => {
    sortByItems[sortBy as string] = t(`sortby.${(sortBy as string).toLowerCase()}`);
  });

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
                <p>Sortieren nach</p>
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
                  items={sortDirectionElements}
                  defaultSelected={querySettings.sortDirection}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortDirection: selected as SortDirection };
                    });
                  }}
                />
              </div>
              <div>
                <p>Zeige</p>
                <Dropdown
                  items={cardAmountElements}
                  defaultSelected={querySettings.pageSize}
                  onSelect={(selected) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, pageSize: selected as CardAmount };
                    });
                  }}
                />
              </div>
              <div>
                <p>Als</p>
                <Dropdown
                  items={cardDisplayModeElements}
                  defaultSelected={displaySettings.cardDisplayMode}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, cardDisplayMode: selected as CardDisplayMode };
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
            <p>Sortieren nach</p>
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
              items={sortDirectionElements}
              defaultSelected={querySettings.sortDirection}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortDirection: selected as SortDirection };
                });
              }}
            />
          </div>
          <div>
            <p>Zeige</p>
            <Dropdown
              items={cardAmountElements}
              defaultSelected={querySettings.pageSize}
              onSelect={(selected) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, pageSize: selected as CardAmount };
                });
              }}
            />
            <p>Als</p>
            <Dropdown
              items={cardDisplayModeElements}
              defaultSelected={displaySettings.cardDisplayMode}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, cardDisplayMode: selected as CardDisplayMode };
                });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
