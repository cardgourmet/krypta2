import { useMediaQuery } from '@mantine/hooks';
import { SlidersVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountElements,
  cardDisplayModeElements,
  type DlcCardOverviewParams,
  type DlcCardSortBy,
  type SortDirection,
  sortByElements,
  sortDirectionElements,
} from '@/helpers/dlc/types.ts';
import Dropdown from '../../components/Dropdown.tsx';
import styles from './CardGridSettings.module.css';

interface CardGridSettingsProps {
  filter: DlcCardOverviewParams;
  setFilter: (newFilter: DlcCardOverviewParams) => void;
  setLoading: (loading: boolean) => void;
}

export default function CardGridSettings({ filter, setFilter, setLoading }: CardGridSettingsProps) {
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
                    defaultSelected={filter.sortBy as string}
                    onSelect={(selected: string) => {
                      const newFilter = { ...filter, sortBy: selected as DlcCardSortBy };

                      setLoading(true);
                      setFilter(newFilter);
                    }}
                  />
                  <Dropdown
                    items={sortDirectionElements}
                    defaultSelected={filter.sortDirection as string}
                    onSelect={(selected: string) => {
                      const newFilter = { ...filter, sortDirection: selected as SortDirection };

                      setLoading(true);
                      setFilter(newFilter);
                    }}
                  />
                </div>
                <div>
                  <p>Zeige</p>
                  <Dropdown
                    items={cardAmountElements}
                    defaultSelected={`${filter.pageSize}`}
                    onSelect={(selected: string) => {
                      const newFilter = { ...filter, pageSize: Number(selected) as CardAmount };

                      setLoading(true);
                      setFilter(newFilter);
                    }}
                  />
                  <p>Als</p>
                  <Dropdown
                    items={cardDisplayModeElements}
                    defaultSelected={filter.cardDisplayMode as string}
                    onSelect={(selected: string) => {
                      const newFilter = { ...filter, cardDisplayMode: selected as CardDisplayMode };

                      setLoading(true);
                      setFilter(newFilter);
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
              defaultSelected={filter.sortBy as string}
              onSelect={(selected: string) => {
                const newFilter = { ...filter, sortBy: selected as DlcCardSortBy };

                setLoading(true);
                setFilter(newFilter);
              }}
            />
            <Dropdown
              items={sortDirectionElements}
              defaultSelected={filter.sortDirection as string}
              onSelect={(selected: string) => {
                const newFilter = { ...filter, sortDirection: selected as SortDirection };

                setLoading(true);
                setFilter(newFilter);
              }}
            />
          </div>
          <div>
            <p>Zeige</p>
            <Dropdown
              items={cardAmountElements}
              defaultSelected={`${filter.pageSize}`}
              onSelect={(selected: string) => {
                const newFilter = { ...filter, pageSize: Number(selected) as CardAmount };

                setLoading(true);
                setFilter(newFilter);
              }}
            />
            <p>Als</p>
            <Dropdown
              items={cardDisplayModeElements}
              defaultSelected={filter.cardDisplayMode as string}
              onSelect={(selected: string) => {
                const newFilter = { ...filter, cardDisplayMode: selected as CardDisplayMode };

                setLoading(true);
                setFilter(newFilter);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
