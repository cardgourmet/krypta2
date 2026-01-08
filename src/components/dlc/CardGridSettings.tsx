import { useMediaQuery } from '@mantine/hooks';
import { SlidersVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountElements,
  cardDisplayModeElements,
  type DlcCardOverviewSearchParams,
  type DlcCardOverviewSettings,
  type DlcCardSortBy,
  type SortDirection,
  sortByElements,
  sortDirectionElements,
} from '@/helpers/dlc/types.ts';
import Dropdown from '../../components/Dropdown.tsx';
import styles from './CardGridSettings.module.css';

interface CardGridSettingsProps {
  settings: DlcCardOverviewSettings;
  setSettings: (update: (params: DlcCardOverviewSearchParams) => DlcCardOverviewSearchParams) => void;
}

export default function CardGridSettings({ settings, setSettings }: CardGridSettingsProps) {
  const smallScreen = useMediaQuery('(max-width: 720px)');

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (isModalOpen) {
      // Disable scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

  return (
    <div className={styles.settings}>
      {smallScreen && (
        <div>
          {isModalOpen && (
            <div className={styles.settingsModal}>
              <div className={styles.settingsModalHeader}>
                <h1>Anzeigeeinstellungen</h1>
              </div>
              <div className={styles.settingsModalContent}>
                <div>
                  <p>Sortieren nach</p>
                  <Dropdown
                    items={sortByElements}
                    defaultSelected={settings.sortBy as string}
                    onSelect={(selected: string) => {
                      setSettings((prev) => {
                        return { ...prev, sortBy: selected as DlcCardSortBy };
                      });
                    }}
                  />
                  <Dropdown
                    items={sortDirectionElements}
                    defaultSelected={settings.sortDirection as string}
                    onSelect={(selected: string) => {
                      setSettings((prev) => {
                        return { ...prev, sortDirection: selected as SortDirection };
                      });
                    }}
                  />
                </div>
                <div>
                  <p>Zeige</p>
                  <Dropdown
                    items={cardAmountElements}
                    defaultSelected={`${settings.pageSize}`}
                    onSelect={(selected: string) => {
                      setSettings((prev) => {
                        return { ...prev, pageSize: Number(selected) as CardAmount };
                      });
                    }}
                  />
                  <p>Als</p>
                  <Dropdown
                    items={cardDisplayModeElements}
                    defaultSelected={settings.cardDisplayMode as string}
                    onSelect={(selected: string) => {
                      setSettings((prev) => {
                        return { ...prev, cardDisplayMode: selected as CardDisplayMode };
                      });
                    }}
                  />
                </div>
              </div>
              <div className={styles.settingsModalFooter}>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Schließen
                </button>
              </div>
            </div>
          )}
          <button type="button" className={styles.iconButton} onClick={() => setIsModalOpen(true)}>
            <SlidersVertical />
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
              defaultSelected={settings.sortBy as string}
              onSelect={(selected: string) => {
                setSettings((prev) => {
                  return { ...prev, sortBy: selected as DlcCardSortBy };
                });
              }}
            />
            <Dropdown
              items={sortDirectionElements}
              defaultSelected={settings.sortDirection as string}
              onSelect={(selected: string) => {
                setSettings((prev) => {
                  return { ...prev, sortDirection: selected as SortDirection };
                });
              }}
            />
          </div>
          <div>
            <p>Zeige</p>
            <Dropdown
              items={cardAmountElements}
              defaultSelected={`${settings.pageSize}`}
              onSelect={(selected: string) => {
                setSettings((prev) => {
                  return { ...prev, pageSize: Number(selected) as CardAmount };
                });
              }}
            />
            <p>Als</p>
            <Dropdown
              items={cardDisplayModeElements}
              defaultSelected={settings.cardDisplayMode as string}
              onSelect={(selected: string) => {
                setSettings((prev) => {
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
