import { useClickOutside, useMergedRef } from '@mantine/hooks';
import { IconChevronDown, IconQuestionMark, IconSearch, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Dropdown from '@/components/dlc/Dropdown/Dropdown.tsx';
import { getFocusableElements } from '@/components/home/Searchbar/getFocusableElements.ts';
import SearchFooter from '@/components/home/Searchbar/SearchFooter.tsx';
import SearchRecent from '@/components/home/Searchbar/SearchRecent.tsx';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
import { MTGIcon } from '@/helpers/icons/games/mtg/Icon.tsx';
import { PCGIcon } from '@/helpers/icons/games/pcg/Icon.tsx';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const [isOpened, setIsOpened] = useState(false);
  const [focusableElements, setFocusableElements] = useState<Array<HTMLElement | null>>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // while the user is typing themselves we want to show
  // auto completions instead
  const [isCaptainOfTheShip, setIsCaptainOfTheShip] = useState(false);

  const recentQueries = [
    'ink:amber and type:hero',
    'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
    'ability="Deep Freeze" and o:"chosen characters"',
    'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
    'ability="Deep Freeze" and o:"chosen characters"',
  ];
  const suggestions = [...recentQueries];
  const [currentQuery, setCurrentQuery] = useState<{
    query: string;
    isByUser?: boolean;
  }>({ query: '' });

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const deleteSearchButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        searchInputRef.current?.focus();
        setIsOpened(false);
        return;
      }

      if (event.key === 'Tab') {
        const total = focusableElements.length;
        const shift = event.shiftKey;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[total - 1];
        if (firstElement === null || lastElement === null) return;

        if (shift && document.activeElement === firstElement) {
          lastElement.focus();
          return event.preventDefault();
        }
        if (!shift && document.activeElement === lastElement) {
          firstElement.focus();
          return event.preventDefault();
        }
      }

      if (event.key === 'Enter') {
        if (!isOpened && document.activeElement === searchInputRef.current) {
          setIsOpened(true);
        }
        if (isOpened && document.activeElement === searchInputRef.current) {
          // TODO: navigate with new query to current page (let filter stay the same)
        }
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (document.activeElement !== searchInputRef.current) return event.preventDefault();

        const suggestions = focusableElements.filter((el) => el?.parentElement instanceof HTMLLIElement);
        suggestions.unshift(null);

        if (suggestions.length === 0) return;
        const arrowUp = event.key === 'ArrowUp';

        let newIndex = arrowUp ? suggestionIndex - 1 : suggestionIndex + 1;
        if (newIndex < 0) newIndex = suggestions.length - 1;
        if (newIndex >= suggestions.length) newIndex = 0;
        setSuggestionIndex(newIndex);

        return event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [focusableElements, isOpened, suggestionIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!isOpened || isCaptainOfTheShip) return;

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

  const mergedSearchRef = useMergedRef(searchContainerRef, clickOutsideRef);
  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!searchContainerRef.current) return;

    setFocusableElements(getFocusableElements(searchContainerRef.current));
  }, [searchContainerRef]);

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
              setIsCaptainOfTheShip(false);
            } else if (!isCaptainOfTheShip && newQuery.length > 0) {
              setIsCaptainOfTheShip(true);
              setSuggestionIndex(0);
            }

            setCurrentQuery({ query: event.target.value, isByUser: true });
          }}
        />
        <button
          className={`${styles.deleteSearchIcon} ${currentQuery.query.length === 0 ? styles.hidden : ''}`}
          type={'button'}
          ref={deleteSearchButtonRef}
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
              />
            </div>

            <div className={styles.typingInfo}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            <div className={`${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <SearchRecent suggestionIndex={suggestionIndex} recentQueries={recentQueries} />
            </div>
          </div>

          <SearchFooter />
        </div>
      </div>
    </>
  );
}
