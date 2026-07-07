import { ActionIcon, Divider, Group, Stack, Tooltip } from '@mantine/core';
import { IconBook2 } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetTable, type GourmetTableData } from '@/parcels/generic/GourmetTable/GourmetTable.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { ExistsInListsBadge } from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import { formatRelativeTimestamp } from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import type { UserListResource } from '@/parcels/lists/types.ts';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification.ts';
import Pagination from '@/parcels/overview/cards/Pagination/Pagination.tsx';
import { deleteSavedSearches, fetchSavedSearches } from '@/parcels/search/api.ts';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';
import { HorTableRow } from '@/parcels/search/saved/HorTableRow/HorTableRow.tsx';
import { SavedSearchesOverviewSettings } from '@/parcels/search/saved/SavedSearchesOverviewSettings.tsx';
import { VerTableRow } from '@/parcels/search/saved/VerTableRow/VerTableRow.tsx';
import type { PagedUserSavedSearch, UserResolvedSavedSearch } from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { Route } from '@/routes/me/saved-searches';

export function SavedSearchesOverview() {
  const { t } = useTranslation('saved');
  const { t: t2 } = useTranslation('saved', { keyPrefix: 'table.cols' });

  const search = Route.useSearch();

  const navigate = useNavigate();
  const setSettings = (apply: ApplyFn<{ page?: number }>) => {
    const newParams = apply({ ...search });

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: '/me/saved-searches',
      search: () => ({ ...search, page: newParams.page ?? 1 }),
      replace: true,
    });
  };

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: t('header'),
      },
    ],
  });

  const noti = useGourmetNotification();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchesData, setSearchesData] = useState<PagedUserSavedSearch | undefined>(undefined);

  const listResources = useMemo(() => {
    return searchesData?.items?.flatMap((i) => i.listResources ?? []) ?? [];
  }, [searchesData?.items]);
  const { addResources, removeResources } = useActiveLists(undefined, listResources);

  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    fetchSavedSearches(user.id, search.tcg, search.search, search.sortDir).then(({ data, error }) => {
      setIsLoading(false);

      if (error) {
        noti.show('Unknown error', `${error}`, 'error');
        return;
      }

      setSearchesData(data);
    });
  }, [noti.show, search.tcg, user?.id, search.search, search.sortDir]);

  const onSearchUnsaved = useCallback(
    (queryId: string) => {
      if (!searchesData) return;

      const dataCopyItems = [...searchesData.items];
      for (let i = 0; i < dataCopyItems.length; i++) {
        const copyItem = dataCopyItems[i];
        if (copyItem.firstSearch.queryId === queryId && copyItem.savedSearch) {
          dataCopyItems.splice(i, 1);
          break;
        }
      }

      setSearchesData({ ...searchesData, items: dataCopyItems });
    },
    [searchesData],
  );
  const tableData: GourmetTableData<UserResolvedSavedSearch> = useTableData({
    savedSearchData: searchesData,
    onSearchUnsaved,
  });

  return (
    <div>
      <title>{`${t('title')} – Cardgourmet`}</title>
      {component}

      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>

          {(searchesData?.lastPage ?? 1) > 1 && (
            <Pagination
              currentPage={search.page}
              lastPage={searchesData?.lastPage ?? search.page}
              isLoading={false}
              setSettings={setSettings}
            />
          )}
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <SavedSearchesOverviewSettings />

      <Stack mt={'xl'} style={{ padding: '0.5rem' }}>
        {!isLoading && tableData.rows.length === 0 && (
          <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
            {t('noSearches')}
          </GourmetText>
        )}
        {tableData.rows.length > 0 && (
          <GourmetTable
            t={t2}
            isLoading={isLoading}
            tableData={tableData}
            constructHorTableRow={({ entry, data }) => (
              <HorTableRow
                key={entry.savedSearch.id}
                entry={entry}
                data={data}
                tableData={tableData}
                tcg={search.tcg}
                onSearchSaved={(res) => {
                  addResources([res]);
                }}
                onSearchUnsaved={() => {
                  removeResources([entry.savedSearch.id]);
                }}
              />
            )}
            constructVerTableRow={({ entry, data }) => (
              <VerTableRow
                key={entry.savedSearch.id}
                entry={entry}
                data={data}
                tableData={tableData}
                tcg={search.tcg}
                onSearchSaved={(res) => {
                  addResources([res]);
                }}
                onSearchUnsaved={() => {
                  removeResources([entry.savedSearch.id]);
                }}
              />
            )}
          />
        )}
      </Stack>
    </div>
  );
}

export type TableEntryProps = {
  entry: UserResolvedSavedSearch;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserResolvedSavedSearch>;
  tcg: Tcg;
  onSearchSaved?: (res: UserListResource) => void;
  onSearchUnsaved?: (resourceId: string) => void;
};

function useTableData({
  savedSearchData,
  onSearchUnsaved,
}: {
  savedSearchData: PagedUserSavedSearch | undefined;
  onSearchUnsaved: (queryId: string) => void;
}) {
  const search = Route.useSearch();
  const localHistory = useSearchHistory(search.tcg);

  const { i18n } = useTranslation();
  const { user } = useAuth();
  const noti = useGourmetNotification();

  return useMemo(() => {
    const columns = ['query', 'cards', 'time', 'speed', 'saved', 'inList'];
    const colSizes = ['', '6', '8', '6', '4', '4'];

    return {
      columns: columns,
      colSizes: colSizes,
      rows:
        savedSearchData?.items?.map((i) => {
          const search = i.lastSearch ?? i.firstSearch;

          return {
            entry: i,
            data: {
              time: (
                <Tooltip label={new Date(search.createdAt).toLocaleString()} openDelay={500}>
                  <GourmetText cgmff={'ui'} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatRelativeTimestamp(search.createdAt, i18n.language)}
                  </GourmetText>
                </Tooltip>
              ),
              query: (
                <GourmetText cgmff={'monospace'} fz={'0.95rem'}>
                  {search.rawQuery}
                </GourmetText>
              ),
              cards: <GourmetText cgmff={'monospace'}>{i.lastTotalCount}</GourmetText>,
              speed: <GourmetText cgmff={'ui'}>{search.executionTime}ms</GourmetText>,
              saved: (
                <ActionIcon
                  onClick={() => {
                    if (!user?.id) return;

                    if (i.savedSearch?.id) {
                      deleteSavedSearches(user?.id, i.savedSearch.game as Tcg, [i.savedSearch.id]).then(({ error }) => {
                        if (error) {
                          noti.show('Unknown error', `${error}`, 'error');
                          return;
                        }

                        // adjust local storage
                        onSearchUnsaved(search.queryId);
                        localHistory.markQueries(search.rawQuery as string, undefined);
                      });
                      return;
                    }
                  }}
                  className={styles.actionIcon}
                >
                  {i.savedSearch && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
                </ActionIcon>
              ),
              inList: (
                <>
                  <ExistsInListsBadge resourceId={i.savedSearch?.id} />
                </>
              ),
            },
          };
        }) ?? [],
    };
  }, [savedSearchData?.items, i18n.language, user?.id, onSearchUnsaved, noti.show, localHistory.markQueries]);
}
