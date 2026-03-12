import {ActionIcon, Group, Tooltip} from '@mantine/core';
import {IconArrowNarrowRight, IconClockHour8, IconDotsVertical, IconStar} from '@tabler/icons-react';
import {Link, useNavigate} from '@tanstack/react-router';
import {type RefObject, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import type {HistoryEntry} from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import {getFocusableElements} from '@/parcels/search/getFocusableElements.ts';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchRecent.module.css';

type SearchRecentItemProps = {
  tcg: Tcg;
  close: () => void;
  setQuery: (query: string, isByUser?: boolean) => void;
  historyIndex: number;
  setHistoryIndex: (historyIndex: number) => void;
  searchContainerRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export default function SearchRecent({
  tcg,
  close,
  setQuery,
  historyIndex,
  setHistoryIndex,
  searchContainerRef,
  searchInputRef,
}: SearchRecentItemProps) {
  const { t } = useTranslation('search');
  const history = useSearchHistory(tcg);
  const recentQueries = history.pastQueries ?? [];
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const suggs = [...recentQueries].reverse().slice(0, 5);
    suggs.unshift({} as HistoryEntry);
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
    let currentSugg = { rawQuery: '' } as HistoryEntry;
    if (historyIndex > 0) {
      currentSugg = suggestions[historyIndex];
    }
    setQuery(currentSugg.rawQuery, false);
  }, [historyIndex]);

  return (
    <div className={styles.recent}>
      <p style={{ textTransform: 'uppercase' }}>{t('recent')}</p>
      <ul>
        {reversedRecentQueries.map((query, index) => (
          <li key={index}>
            <button
              type="button"
              tabIndex={0}
              className={index + 1 === historyIndex ? styles.suggestionHighlighted : ''}
              onClick={() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/$tcg/cards',
                  params: { tcg: tcg },
                  search: (prev) => {
                    return { ...prev, query: query.rawQuery, page: 1 } as Required<TcgSearchParams>;
                  },
                });
                close();
              }}
            >
              <div className={styles.recentItemLeft}>
                <IconClockHour8 size={22} color={'var(--gourmet-neutral-8)'} />
                <Tooltip label={query.rawQuery} openDelay={500}>
                  <p>{query.rawQuery}</p>
                </Tooltip>
              </div>
            </button>
            <div className={styles.recentItemRight}>
              <Group gap={'0.2rem'}>
                <ActionIcon
                  onClick={() => {
                    // TODO: add history entry to saved searches and favorites
                  }}
                  className={styles.actionIcon}
                >
                  <IconStar size={16} color={'var(--gourmet-neutral-7)'} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    // TODO: more actions for search history entry
                  }}
                  className={styles.actionIcon}
                >
                  <IconDotsVertical size={16} color={'var(--gourmet-neutral-7)'} />
                </ActionIcon>
              </Group>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.moreRecents}>
        <Link to={'/'}>
          {t('to-history')}
          <IconArrowNarrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
