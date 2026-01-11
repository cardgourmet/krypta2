import { useClickOutside, useMergedRef } from '@mantine/hooks';
import {
  IconArrowBack,
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconClockHour8,
  IconQuestionMark,
  IconSearch,
  IconStar,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { getFocusableElements } from '@/components/home/Searchbar/getFocusableElements.ts';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
import styles from './Searchbar.module.css';

export default function Searchbar() {
  const [isOpened, setIsOpened] = useState(false);
  const [focusableElements, setFocusableElements] = useState<Array<HTMLElement | null>>([]);

  const clickOutsideRef = useClickOutside(() => setIsOpened(false));
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
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
        const firstElement = focusableElements[0];
        const suggestions = focusableElements.filter((el) => el?.parentElement instanceof HTMLLIElement);
        const firstSuggestion = suggestions[0];
        const lastSuggestion = suggestions[suggestions.length - 1];

        if (suggestions.length === 0 || firstElement === null || firstSuggestion === null || lastSuggestion === null)
          return;
        const arrowUp = event.key === 'ArrowUp';

        if (
          (!arrowUp && document.activeElement === lastSuggestion)
          || (arrowUp && document.activeElement === firstSuggestion)
        ) {
          firstElement.focus();
          return event.preventDefault();
        }
        if (arrowUp && document.activeElement === firstElement) {
          lastSuggestion.focus();
          return event.preventDefault();
        }

        const currentIndex = suggestions.indexOf(document.activeElement as HTMLElement);
        const nextIndex = arrowUp ? currentIndex - 1 : currentIndex + 1;

        suggestions[nextIndex]?.focus();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => {
      // Detach listener when component unmounts
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [focusableElements]);

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
        <IconSearch size={20} color={'#9ba6b1'} className={styles.searchIcon} />
        <input
          type="text"
          ref={searchInputRef}
          onFocus={() => {
            setIsOpened(true);
          }}
          onClick={() => {
            setIsOpened(true);
          }}
        />
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
            <div className={styles.recent}>
              <p>ZULETZT</p>
              <ul>
                {[
                  'ink:amber and type:hero',
                  'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
                  'ability="Deep Freeze" and o:"chosen characters"',
                  'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
                  'ability="Deep Freeze" and o:"chosen characters"',
                ].map((query, index) => (
                  <li key={index}>
                    <button type="button" tabIndex={0}>
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
