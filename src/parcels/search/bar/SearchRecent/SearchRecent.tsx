import {ActionIcon, Group, Tooltip} from '@mantine/core';
import {IconArrowNarrowRight, IconBook, IconBook2, IconClockHour8, IconDotsVertical} from '@tabler/icons-react';
import {Link, useNavigate} from '@tanstack/react-router';
import {type Ref, type RefObject, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';
import {deleteSavedSearches, saveSearches} from '@/parcels/search/api.ts';
import type {HistoryEntry} from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import {getFocusableElements} from '@/parcels/search/getFocusableElements.ts';
import {MoreActionsMenu} from '@/parcels/search/history/MoreActionsMenu.tsx';
import type {TcgProps} from '@/parcels/tcg/TcgProps.ts';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {historyParamDefaults} from '@/routes/me/history';
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
  submenuRef,
  tcg,
  close,
  setQuery,
  historyIndex,
  setHistoryIndex,
  searchContainerRef,
  searchInputRef,
}: { submenuRef?: Ref<HTMLDivElement> } & SearchRecentItemProps) {
  const { t } = useTranslation('search');
  const history = useSearchHistory(tcg);
  const recentQueries = history.pastQueries ?? [];
  const navigate = useNavigate();

  const { user } = useAuth();

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
                <IconClockHour8 size={20} color={'var(--gourmet-neutral-7)'} />
                <Tooltip label={query.rawQuery} openDelay={500}>
                  <p data-extended={!user?.id}>{query.rawQuery}</p>
                </Tooltip>
              </div>
            </button>
            {user?.id && (
              <div className={styles.recentItemRight}>
                <RecentItemTools query={query} tcg={tcg} submenuRef={submenuRef} />
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.moreRecents}>
        <Link to={'/me/history'} search={{ ...historyParamDefaults, tcg: tcg }}>
          {t('to-history')}
          <IconArrowNarrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}

function RecentItemTools(props: { query: HistoryEntry; submenuRef: Ref<HTMLDivElement> | undefined } & TcgProps) {
  const { query, tcg, submenuRef } = props;
  const { user } = useAuth();
  const history = useSearchHistory(tcg);

  const [menuOpened, setMenuOpened] = useState(false);
  const noti = useGourmetNotification();

  return (
    <Group gap={'0.2rem'}>
      <ActionIcon
        onClick={() => {
          if (!user?.id) return;

          if (query.saved) {
            deleteSavedSearches(user?.id, tcg, [query.saved]).then(({ error }) => {
              if (error) {
                noti.show('Unknown error', `${error}`, 'error');
                return;
              }

              // adjust local storage and remove all with that queryId
              history.markQueries(query.rawQuery as string, undefined);
            });
            return;
          }

          saveSearches(user?.id, tcg, [query.id as string]).then(({ data, error }) => {
            if (error || !data?.length) {
              noti.show('Unknown error', `${error}`, 'error');
              return;
            }

            // adjust local storage and add all with that queryId
            history.markQueries(query.rawQuery as string, data[0].savedSearch.id);
          });
        }}
        className={styles.actionIcon}
      >
        {query.saved && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
        {!query.saved && <IconBook size={18} color={'var(--gourmet-neutral-7)'} />}
      </ActionIcon>

      <MoreActionsMenu
        ref={submenuRef}
        type={'user_search'}
        tcg={tcg}
        resourceId={query.saved}
        rawResourceId={query.id as string}
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
        target={
          <ActionIcon
            style={{ pointerEvents: 'auto' }}
            color="var(--gourmet-neutral-dark-4)"
            className={styles.moreButton}
          >
            <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} style={{ flexShrink: 0 }} />
          </ActionIcon>
        }
        onSearchSaved={(id) => {
          // adjust local storage and add all with that queryId
          history.markQueries(query.rawQuery as string, id);
        }}
      />
    </Group>
  );
}
