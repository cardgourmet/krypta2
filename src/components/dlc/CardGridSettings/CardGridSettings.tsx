import { useMediaQuery } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import {
  type CardDisplayMode,
  cardAmountElements,
  cardDisplayModeElements,
  type DlcCardOverviewDisplaySettings,
  type DlcCardOverviewQuerySettings,
  type DlcCardOverviewSearchParams,
  type DlcCardSortBy,
  type SortDirection,
  sortByElements,
  sortDirectionElements,
} from '@/helpers/dlc/types.ts';
import Dropdown from '../Dropdown/Dropdown.tsx';
import styles from './CardGridSettings.module.css';

type CardGridSettingsProps = {
  querySettings: DlcCardOverviewQuerySettings;
  displaySettings: DlcCardOverviewDisplaySettings;
  setSettings: (update: (params: DlcCardOverviewSearchParams) => DlcCardOverviewSearchParams) => void;
};

export default function CardGridSettings({ querySettings, displaySettings, setSettings }: CardGridSettingsProps) {
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
                  items={sortByElements}
                  defaultSelected={querySettings.sortBy}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortBy: selected as DlcCardSortBy };
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
                      return { ...prev, pageSize: selected };
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
              items={sortByElements}
              defaultSelected={querySettings.sortBy}
              onSelect={(selected: string) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, sortBy: selected as DlcCardSortBy };
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
                  return { ...prev, pageSize: selected };
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
