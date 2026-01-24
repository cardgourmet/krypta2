import { IconArrowNarrowRight, IconClockHour8, IconStar, IconX } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { type RefObject, useEffect, useMemo } from 'react';
import { getFocusableElements } from '@/parcels/search/getFocusableElements.ts';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider/SearchHistoryProvider.tsx';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import type { PcgSearchParams } from '@/parcels/tcg/pcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchRecent.module.css';

type SearchRecentItemProps = {
  tcg: Tcg;
  setIsOpened: (isOpened: boolean) => void;
  setQuery: (query: string, isByUser: boolean) => void;
  historyIndex: number;
  setHistoryIndex: (historyIndex: number) => void;
  searchContainerRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export default function SearchRecent({
  tcg,
  setIsOpened,
  setQuery,
  historyIndex,
  setHistoryIndex,
  searchContainerRef,
  searchInputRef,
}: SearchRecentItemProps) {
  const history = useSearchHistory(tcg);
  const recentQueries = history.pastQueries ?? [];
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const suggs = [...recentQueries].reverse().slice(0, 5);
    suggs.unshift('');
    return suggs;
  }, [recentQueries]);
  const reversedRecentQueries = useMemo(() => {
    return [...recentQueries].reverse().slice(0, 5);
  }, [recentQueries]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    if (!searchContainerRef.current) return;
    const focusableElements = getFocusableElements(searchContainerRef.current);

    const handle = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (document.activeElement !== searchInputRef.current) return event.preventDefault();

        const suggestions: (HTMLElement | null)[] = focusableElements.filter(
          (el) => el?.parentElement instanceof HTMLLIElement,
        );
        suggestions.unshift(null);

        if (suggestions.length === 0) return;
        const arrowUp = event.key === 'ArrowUp';

        let newIndex = arrowUp ? historyIndex - 1 : historyIndex + 1;
        if (newIndex < 0) newIndex = suggestions.length - 1;
        if (newIndex >= suggestions.length) newIndex = 0;
        setHistoryIndex(newIndex);

        return event.preventDefault();
      }
    };

    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, [historyIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    let currentSugg = '';
    if (historyIndex > 0) {
      currentSugg = suggestions[historyIndex];
    }
    setQuery(currentSugg, false);
  }, [historyIndex]);

  return (
    <div className={styles.recent}>
      <p>ZULETZT</p>
      <ul>
        {reversedRecentQueries.map((query, index) => (
          <li key={index}>
            <button
              type="button"
              tabIndex={0}
              className={index + 1 === historyIndex ? styles.suggestionHighlighted : ''}
              onClick={() => {
                if (tcg === 'dlc') {
                  // noinspection JSIgnoredPromiseFromCall
                  navigate({
                    to: '/dlc/cards',
                    search: (prev) => {
                      return { ...prev, query: query } as Required<DlcSearchParams>;
                    },
                  });
                } else if (tcg === 'pcg') {
                  // noinspection JSIgnoredPromiseFromCall
                  navigate({
                    to: '/pcg/cards',
                    search: (prev) => {
                      return { ...prev, query: query } as Required<PcgSearchParams>;
                    },
                  });
                }
                setIsOpened(false);
              }}
            >
              <div className={styles.recentItemLeft}>
                <IconClockHour8 size={22} color={'#9ba6b1'} />
                <p>{query}</p>
              </div>
            </button>
            <div className={styles.recentItemRight}>
              <button
                type={'button'}
                onClick={() => {
                  // TODO: add history entry to favorites
                }}
              >
                <IconStar size={16} color={'#9ba6b1'} />
              </button>
              <button
                type={'button'}
                onClick={() => {
                  const reverseIndex = recentQueries.length - 1 - index;
                  history?.removeQuery(reverseIndex);
                }}
              >
                <IconX size={16} color={'#9ba6b1'} />
              </button>
            </div>
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
  );
}
