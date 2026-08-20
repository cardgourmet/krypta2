import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconArrowRight, IconBook, IconBook2, IconDotsVertical } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { type ReactElement, type Ref, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { Hyperlink } from '@/parcels/generic/Hyperlink/Hyperlink';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { CONTEXT_LIST_NAV, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { deleteSavedSearches, saveSearches } from '@/parcels/search/api.ts';
import type { HistoryEntry } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import type { UserResolvedSavedSearch } from '@/parcels/search/types.ts';
import { useUserRecentSavedSearches } from '@/parcels/search/useUserRecentSavedSearches.ts';
import { useLocalUserTransientStore } from '@/parcels/state/LocalUserTransientStore.tsx';
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
  const setManualQuery = useLocalUserTransientStore((state) => state.setManualQuery);

  return (
    <div className={styles.recent}>
      <Group align="center" justify="space-between">
        <Kicker leadingIcon={icon} style={{ color: 'var(--cgm-color-complementary)' }}>
          {t('recent')}
        </Kicker>

        {/* <Button accent="brand" asChild size="sm" trailingIcon={<IconArrowRight />} variant="tertiary">
          <Link to={forwardLink} search={{ ...historyParamDefaults, tcg: tcg }} onClick={close}>
            {t('toHistory')}
          </Link>
        </Button> */}

        <Hyperlink asChild size="sm" trailingIcon={<IconArrowRight />}>
          <Link to={forwardLink} search={{ ...historyParamDefaults, tcg: tcg }} onClick={close}>
            {t('toHistory')}
          </Link>
        </Hyperlink>
      </Group>

      <ul>
        {reversedRecentQueries.map((query, index) => (
          <li key={index}>
            <button
              type="button"
              tabIndex={0}
              className={index === selectedIndex ? styles.suggestionHighlighted : ''}
              onClick={() => {
                setManualQuery(true);

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

  const savedSearches = useUserRecentSavedSearches((s) => s.savedSearches);
  const currentSavedSearch = useMemo(() => {
    return savedSearches[tcg]?.find((s) => s.firstSearch.rawQuery === query.rawQuery);
  }, [query.rawQuery, savedSearches, tcg]);

  const { removeResources } = useActiveLists(CONTEXT_LIST_NAV);

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
              removeResources([query.saved!]);

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
        resource={query}
        resourceId={currentSavedSearch?.savedSearch.id}
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
        onAddedToList={(res) => {
          if (!query.saved) {
            addSavedSearch(tcg, {
              firstSearch: {
                id: query.id,
                queryId: query.id,
                rawQuery: query.rawQuery,
              },
              listResources: [res],
              savedSearch: {
                game: tcg,
                id: res.resourceId,
                queryId: query.id,
                userId: user?.id,
                savedAt: res.createdAt,
              },
            } as UserResolvedSavedSearch);
          }

          // adjust local storage and add all with that queryId
          history.markQueries(query.rawQuery as string, res.resourceId);
        }}
        activeListContext={CONTEXT_LIST_NAV}
      />
    </Group>
  );
}
