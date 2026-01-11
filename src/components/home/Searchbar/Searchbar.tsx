import { useClickOutside, useMergedRef } from '@mantine/hooks';
import {
  IconArrowBack,
  IconArrowDown,
  IconArrowNarrowRight,
  IconArrowUp,
  IconChevronDown,
  IconClockHour8,
  IconQuestionMark,
  IconSearch,
  IconStar,
  IconX,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { getFocusableElements } from '@/components/home/Searchbar/getFocusableElements.ts';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
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
              <button type="button">
                <DLCIcon width={20} height={20} color={'#9ba6b1'} />
                <p>DISNEY LORCANA</p>
                <IconChevronDown size={18} color={'#9ba6b1'} />
              </button>
            </div>

            <div className={styles.typingInfo}>
              <p>Beginne zu tippen, um Vorschläge für Filter und Werte zu erhalten.</p>
            </div>

            <div className={`${styles.recent} ${isCaptainOfTheShip ? styles.hidden : ''}`}>
              <p>ZULETZT</p>
              <ul>
                {recentQueries.map((query, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      tabIndex={0}
                      className={index + 1 === suggestionIndex ? styles.suggestionHighlighted : ''}
                    >
                      <div className={styles.recentItemLeft}>
                        <IconClockHour8 size={22} color={'#9ba6b1'} />
                        <p>{query}</p>
                      </div>
                      <div className={styles.recentItemRight}>
                        <IconStar size={16} color={'#9ba6b1'} />
                        <IconX size={16} color={'#9ba6b1'} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.moreRecents}>
                <Link to={'/'}>
                  Zur gesamten Chronik
                  <IconArrowNarrowRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.controls}>
              <div>
                <p>Navigieren</p>
                <kbd>
                  <IconArrowUp size={18} color={'#9ba6b1'} />
                </kbd>
                <kbd>
                  <IconArrowDown size={18} color={'#9ba6b1'} />
                </kbd>
              </div>
              <div>
                <p>Suche starten</p>
                <kbd>
                  <IconArrowBack size={18} color={'#9ba6b1'} />
                </kbd>
              </div>
              <div>
                <p>Schließen</p>
                <kbd>esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
