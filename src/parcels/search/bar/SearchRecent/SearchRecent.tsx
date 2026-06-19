import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowRight, IconBook, IconBook2, IconDotsVertical } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { type ReactElement, type Ref, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { Button } from '@/parcels/generic/Button/Button';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import { deleteSavedSearches, saveSearches } from '@/parcels/search/api.ts';
import type { HistoryEntry } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import { useUserRecentSavedSearches } from '@/parcels/search/useUserRecentSavedSearches.ts';
import type { TcgProps } from '@/parcels/tcg/TcgProps.ts';
import type { TcgSearchParams } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { historyParamDefaults } from '@/routes/me/history';
import styles from './SearchRecent.module.css';

type SearchSavedItemProps = {
  tcg: Tcg;
  close: () => void;
  selectedIndex: number;
};

export default function SearchRecent({
  submenuRef,
  recentQueries,
  tPrefix,
  icon,
  maxPerPage,
  tcg,
  close,
  selectedIndex,
  reversed,
  forwardLink,
}: {
  submenuRef?: Ref<HTMLDivElement>;
  recentQueries: HistoryEntry[];
  tPrefix?: string;
  icon?: ReactElement;
  maxPerPage?: number;
  reversed?: boolean;
  forwardLink: string;
} & SearchSavedItemProps) {
  const { user } = useAuth();
  const { t } = useTranslation('search', { keyPrefix: tPrefix });

  const navigate = useNavigate();

  const reversedRecentQueries = useMemo(() => {
    if (reversed === true) return [...recentQueries].reverse().slice(0, maxPerPage ?? 5);
    return [...recentQueries].slice(0, maxPerPage ?? 5);
  }, [recentQueries, maxPerPage, reversed]);

  return (
    <div className={styles.recent}>
      <Group gap={'0.25rem'}>
        {icon}
        <GourmetText
          cgmff={'ui'}
          style={{ textTransform: 'uppercase' }}
          fw={500}
          fz={'0.8rem'}
          m={0}
          c={'var(--gourmet-blue-1)'}
        >
          {t('recent')}
        </GourmetText>
      </Group>
      <ul>
        {reversedRecentQueries.map((query, index) => (
          <li key={index}>
            <button
              type="button"
              tabIndex={0}
              className={index === selectedIndex ? styles.suggestionHighlighted : ''}
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
        <Button accent="brand" asChild size="sm" trailingIcon={<IconArrowRight />} variant="tertiary">
          <Link to={forwardLink} search={{ ...historyParamDefaults, tcg: tcg }}>
            {t('toHistory')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

function RecentItemTools(props: { query: HistoryEntry; submenuRef: Ref<HTMLDivElement> | undefined } & TcgProps) {
  const { query, tcg, submenuRef } = props;
  const { user } = useAuth();
  const history = useSearchHistory(tcg);

  const [menuOpened, setMenuOpened] = useState(false);

  const addSavedSearch = useUserRecentSavedSearches((s) => s.addSavedSearch);
  const removeSavedSearch = useUserRecentSavedSearches((s) => s.removeSavedSearch);

  return (
    <Group gap={'0.2rem'}>
      <ActionIcon
        onClick={() => {
          if (!user?.id) return;

          if (query.saved) {
            deleteSavedSearches(user?.id, tcg, [query.saved]).then(({ error }) => {
              if (error) {
                sendErrorNotification(error);
                return;
              }

              // adjust local storage and remove all with that queryId
              removeSavedSearch(tcg, query.saved!);
              history.markQueries(query.rawQuery as string, undefined);
            });
            return;
          }

          saveSearches(user?.id, tcg, [query.id as string]).then(({ data, error }) => {
            if (error) {
              sendErrorNotification(error);
              return;
            }
            if (!data?.length) return;

            // adjust local storage and add all with that queryId
            addSavedSearch(tcg, data[0]);
            history.markQueries(query.rawQuery as string, data[0].savedSearch.id);
          });
        }}
        className={styles.actionIcon}
      >
        {query.saved && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
        {!query.saved && <IconBook size={18} color={'var(--gourmet-neutral-7)'} />}
      </ActionIcon>

      <MoreListActionsMenu
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
        onAddedToList={(id) => {
          // adjust local storage and add all with that queryId
          history.markQueries(query.rawQuery as string, id);
        }}
      />
    </Group>
  );
}
