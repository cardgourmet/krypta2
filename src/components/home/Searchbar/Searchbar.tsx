import { useClickOutside, useMergedRef } from '@mantine/hooks';
import { IconChevronDown, IconQuestionMark, IconSearch, IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Dropdown from '@/components/dlc/Dropdown/Dropdown.tsx';
import { getFocusableElements } from '@/components/home/Searchbar/getFocusableElements.ts';
import { handleKeydown } from '@/components/home/Searchbar/handleKeydown.ts';
import SearchFooter from '@/components/home/Searchbar/SearchFooter.tsx';
import SearchRecent from '@/components/home/Searchbar/SearchRecent.tsx';
import { useSearchQuery } from '@/components/home/Searchbar/useSearchQuery.ts';
import { SearchHistoryContext } from '@/components/home/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
import { MTGIcon } from '@/helpers/icons/games/mtg/Icon.tsx';
import { PCGIcon } from '@/helpers/icons/games/pcg/Icon.tsx';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const [isOpened, setIsOpened] = useState(false);
  const [_, setCurrentTcg] = useState<'dlc' | 'mtg' | 'pcg'>('dlc');

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const history = useContext(SearchHistoryContext);
  const recentQueries = history?.pastQueries ?? [];

  const [currentQuery, setCurrentQuery] = useSearchQuery();
  const isCaptainOfTheShip = currentQuery.isByUser ?? false;

  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const suggestions = useMemo(() => {
    return [...recentQueries];
  }, [recentQueries]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!searchContainerRef.current) return;
    const focusableElements = getFocusableElements(searchContainerRef.current);

    const handle = handleKeydown({
      searchInputRef: searchInputRef,
      isOpened: isOpened,
      setIsOpened: setIsOpened,
      focusableElements: focusableElements,
      suggestionIndex: suggestionIndex,
      setSuggestionIndex: setSuggestionIndex,
      currentQuery: currentQuery.query,
      navigate: navigate,
    });

    document.addEventListener('keydown', handle);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handle);
    };
  }, [isOpened, suggestionIndex, currentQuery, navigate]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!isOpened || isCaptainOfTheShip) return;

    // TODO: extract to `currentSuggestion`
    let currentSugg = '';
    if (suggestionIndex > 0) {
      currentSugg = suggestions[suggestionIndex - 1];
    }
    setCurrentQuery({ query: currentSugg, isByUser: false });

    if (searchInputRef.current) {
      searchInputRef.current.focus();

      const length = currentSugg.length;
      searchInputRef.current.setSelectionRange(length, length);

      // hacky, I'm so sorry (LG zurück)
      const timeoutId = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.scrollLeft = searchInputRef.current.scrollWidth;
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [suggestionIndex, isOpened, isCaptainOfTheShip]);

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const mergedSearchRef = useMergedRef(searchContainerRef, clickOutsideRef);

  return (
    <>
      <div className={`${styles.searchOverlay} ${!isOpened ? styles.hidden : ''}`} />

      <div className={styles.searchbar} ref={mergedSearchRef}>
        <IconSearch size={18} color={'#9ba6b1'} className={styles.searchIcon} />
        <input
          type="text"
          ref={searchInputRef}
          value={currentQuery.query}
          onFocus={() => setIsOpened(true)}
          onClick={() => setIsOpened(true)}
          onChange={(event) => {
            const newQuery = event.target.value;
            if (isCaptainOfTheShip && newQuery.length === 0) {
              setCurrentQuery({ query: '', isByUser: false });
            } else if (!isCaptainOfTheShip && newQuery.length > 0) {
              setSuggestionIndex(0);
              setCurrentQuery({ query: event.target.value, isByUser: true });
            } else if (isCaptainOfTheShip && newQuery.length > 0) {
              setCurrentQuery({ query: event.target.value, isByUser: true });
            }
          }}
        />
        <button
          className={`${styles.deleteSearchIcon} ${currentQuery.query.length === 0 ? styles.hidden : ''}`}
          type={'button'}
          onClick={() => {
            setCurrentQuery({ query: '', isByUser: false });
            searchInputRef.current?.focus();
          }}
        >
          <IconX size={16} color={'#9ba6b1'} />
        </button>

        <button type="button">
          <IconQuestionMark size={18} color={'#9ba6b1'} />
        </button>

        <div className={`${styles.searchModal} ${!isOpened ? styles.hidden : ''}`}>
          <div className={styles.content}>
            <div className={styles.gameSelector}>
              <Dropdown
                items={{
                  dlc: 'Disney Lorcana',
                  mtg: 'Magic: The Gathering',
                  pcg: 'Pokémon Card Game',
                }}
                defaultSelected={'dlc'}
                renderButtonContent={(selected) => (
                  <>
                    {selected === 'dlc' && (
                      <>
                        <DLCIcon width={20} height={20} color={'#9ba6b1'} />
                        <p className={styles.gameSelectorLabel}>DISNEY LORCANA</p>
                      </>
                    )}
                    {selected === 'mtg' && (
                      <>
                        <MTGIcon width={20} height={20} color={'#9ba6b1'} />
                        <p className={styles.gameSelectorLabel}>MAGIC: THE GATHERING</p>
                      </>
                    )}
                    {selected === 'pcg' && (
                      <>
                        <PCGIcon width={20} height={20} color={'#9ba6b1'} />
                        <p className={styles.gameSelectorLabel}>POKÉMON CARD GAME</p>
                      </>
                    )}
                    <IconChevronDown size={18} color={'#9ba6b1'} />
                  </>
                )}
                onSelect={(selected) => {
                  setCurrentTcg(selected);
                }}
              />
            </div>

            <div className={`${styles.typingInfo} ${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            <div className={`${isCaptainOfTheShip || recentQueries.length === 0 ? styles.hidden : ''}`}>
              <SearchRecent suggestionIndex={suggestionIndex} recentQueries={recentQueries} />
            </div>
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
