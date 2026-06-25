import { Divider, Group, Stack } from '@mantine/core';
import { IconAlertSquareRoundedFilled } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { type ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetTable, type GourmetTableData } from '@/parcels/generic/GourmetTable/GourmetTable.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification.ts';
import Pagination from '@/parcels/overview/cards/Pagination/Pagination.tsx';
import { fetchSearchHistory } from '@/parcels/search/api.ts';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import { HorTableRow } from '@/parcels/search/history/SearchHistoryOverview/HorTableRow/HorTableRow.tsx';
import { SearchHistoryOverviewSettings } from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverviewSettings.tsx';
import { useTableData } from '@/parcels/search/history/SearchHistoryOverview/useTableData.tsx';
import { VerTableRow } from '@/parcels/search/history/SearchHistoryOverview/VerTableRow/VerTableRow.tsx';
import type { PagedUserSearchHistoryEntry, UserSavedSearch, UserSearchHistoryEntry } from '@/parcels/search/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { Route } from '@/routes/me/history';
import styles from './SearchHistoryOverview.module.css';

export function SearchHistoryOverview() {
  const { t } = useTranslation('history');
  const { t: t2 } = useTranslation('history', { keyPrefix: 'table.cols' });

  const search = Route.useSearch();
  const localHistory = useSearchHistory(search.tcg);

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: !user ? t('header.breadcrumbs.guest') : `@${user?.username}`,
    moreSubpages: [
      {
        label: t('header.title'),
      },
    ],
  });
  const [historyData, setHistoryData] = useState<PagedUserSearchHistoryEntry | undefined>(undefined);

  const noti = useGourmetNotification();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (user?.state !== 'verified') {
      // if user is not logged in: let's fetch based on local history
      const localData = localHistory.pastQueries;
      const localHistoryData = localData
        .map((d) => {
          return {
            clusterSize: 1,
            search: {
              id: d.id,
              rawQuery: d.rawQuery,
              createdAt: d.at,
              executionTime: d.executionTime,
            },
            totalCount: d.count,
          } as UserSearchHistoryEntry;
        })
        .filter((item) => {
          return search.search.length === 0 || item.search.rawQuery.toLowerCase().includes(search.search.toLowerCase());
        });
      localHistoryData.sort((a, b) => {
        const dateA = new Date(a.search.createdAt).getTime();
        const dateB = new Date(b.search.createdAt).getTime();
        return search.sortDir === 'asc' ? dateA - dateB : dateB - dateA;
      });

      const paged = {
        currentPage: 1,
        hasNextPage: false,
        lastPage: 1,
        nextPage: 1,
        items: localHistoryData,
      } as PagedUserSearchHistoryEntry;

      setHistoryData(paged);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const abort = new AbortController();
    fetchSearchHistory(user.id, search.tcg, search.search, search.sortDir, search.page - 1, search.size, abort).then(
      ({ data, error }) => {
        setIsLoading(false);

        if (error) {
          noti.show('Unknown error', `${error}`, 'error');
          return;
        }

        setHistoryData(data);
      },
    );

    return () => {
      // abort.abort();
      setIsLoading(false);
    };
  }, [search.page, search.size, search.sortDir, search.tcg, user, search.search, localHistory.pastQueries, noti.show]);

  const navigate = useNavigate();
  const setSettings = (apply: ApplyFn<{ page?: number }>) => {
    const newParams = apply({ ...search });

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: '/me/history',
      search: () => ({ ...search, page: newParams.page ?? 1 }),
      replace: true,
    });
  };
  const onSearchSaved = useCallback(
    (queryId: string, id: string) => {
      if (!historyData) return;
      const dataCopyItems = [...historyData.items];
      for (let i = 0; i < dataCopyItems.length; i++) {
        const copyItem = { ...dataCopyItems[i] };
        if (copyItem.search.queryId === queryId && !copyItem.savedSearch) {
          copyItem.savedSearch = { id: id } as UserSavedSearch;
        }
        dataCopyItems[i] = copyItem;
      }
      setHistoryData({ ...historyData, items: dataCopyItems });
    },
    [historyData],
  );
  const onSearchUnsaved = useCallback(
    (queryId: string) => {
      if (!historyData) return;
      const dataCopyItems = [...historyData.items];
      for (let i = 0; i < dataCopyItems.length; i++) {
        const copyItem = { ...dataCopyItems[i] };
        if (copyItem.search.queryId === queryId && copyItem.savedSearch) {
          copyItem.savedSearch = undefined;
        }
        dataCopyItems[i] = copyItem;
      }
      setHistoryData({ ...historyData, items: dataCopyItems });
    },
    [historyData],
  );

  const tableData: GourmetTableData<UserSearchHistoryEntry> = useTableData({
    historyData,
    onSearchSaved,
    onSearchUnsaved,
  });

  return (
    <div>
      <title>{`${t('pageTitle')} – Cardgourmet`}</title>
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
        <Group justify={'space-between'} p={'0.5rem 0'} mih={'3.5rem'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>

          {(historyData?.lastPage ?? 1) > 1 && (
            <Pagination
              currentPage={search.page}
              lastPage={historyData?.lastPage ?? search.page}
              isLoading={false}
              setSettings={setSettings}
            />
          )}
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      {!user?.id && (
        <Stack className={styles.infoBanner}>
          <Group wrap={'nowrap'}>
            <IconAlertSquareRoundedFilled />
            <GourmetText cgmff={'ui'}>{t('notLoggedIn')}</GourmetText>
          </Group>
        </Stack>
      )}
      {user?.id && user?.state !== 'verified' && (
        <Stack className={styles.infoBanner}>
          <Group wrap={'nowrap'}>
            <IconAlertSquareRoundedFilled />
            <GourmetText cgmff={'ui'}>{t('notVerified')}</GourmetText>
          </Group>
        </Stack>
      )}

      <SearchHistoryOverviewSettings />

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
                key={entry.search.id}
                entry={entry}
                data={data}
                tableData={tableData}
                tcg={search.tcg}
                onSearchSaved={(id) => {
                  onSearchSaved(entry.search.queryId, id);
                }}
              />
            )}
            constructVerTableRow={({ entry, data }) => (
              <VerTableRow
                key={entry.search.id}
                entry={entry}
                data={data}
                tableData={tableData}
                tcg={search.tcg}
                onSearchSaved={(id) => {
                  onSearchSaved(entry.search.queryId, id);
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
  entry: UserSearchHistoryEntry;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserSearchHistoryEntry>;
  tcg: Tcg;
  onSearchSaved?: (resourceId: string) => void;
};
