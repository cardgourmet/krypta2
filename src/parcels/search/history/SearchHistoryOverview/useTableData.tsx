import {ActionIcon, Tooltip} from '@mantine/core';
import {IconBook, IconBook2} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {ExistsInListsBadge} from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {deleteSavedSearches, saveSearches} from '@/parcels/search/api.ts';
import {useSearchHistory} from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import styles from '@/parcels/search/history/SearchHistoryOverview/SearchHistoryOverview.module.css';
import type {PagedUserSearchHistoryEntry} from '@/parcels/search/types.ts';
import {Route} from '@/routes/me/history';

export function useTableData({
  historyData,
  onSearchUnsaved,
  onSearchSaved,
}: {
  historyData: PagedUserSearchHistoryEntry | undefined;
  onSearchUnsaved: (queryId: string) => void;
  onSearchSaved: (queryId: string, savedSearchId: string) => void;
}) {
  const { t } = useTranslation('history', { keyPrefix: 'table.cols' });
  const search = Route.useSearch();
  const localHistory = useSearchHistory(search.tcg);

  const { i18n } = useTranslation();
  const { user } = useAuth();

  return useMemo(() => {
    const columns = user?.id
      ? [t('query'), t('cards'), t('time'), t('speed'), t('saved'), t('inList')]
      : [t('query'), t('cards'), t('time'), t('speed')];
    const colSizes = user?.id ? ['', '6', '8', '6', '4', '4'] : ['', '6', '8', '6'];

    return {
      columns: columns,
      colSizes: colSizes,
      rows:
        historyData?.items?.map((i) => {
          return {
            entry: i,
            data: {
              Time: (
                <Tooltip label={new Date(i.search.createdAt).toLocaleString()} openDelay={500}>
                  <GourmetText cgmff={'ui'} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {formatRelativeTimestamp(i.search.createdAt, i18n.language)}
                  </GourmetText>
                </Tooltip>
              ),
              Query: (
                <GourmetText cgmff={'monospace'} fz={'0.95rem'}>
                  {i.search.rawQuery}
                </GourmetText>
              ),
              Cards: <GourmetText cgmff={'monospace'}>{i.totalCount}</GourmetText>,
              Speed: <GourmetText cgmff={'ui'}>{i.search.executionTime}ms</GourmetText>,
              Saved: (
                <ActionIcon
                  onClick={() => {
                    if (!user?.id) return;

                    if (i.savedSearch?.id) {
                      deleteSavedSearches(user?.id, search.tcg, [i.savedSearch.id]).then(({ error }) => {
                        if (error) {
                          console.error('error', error);
                          return;
                        }

                        // adjust local storage
                        onSearchUnsaved(i.search.queryId);
                        localHistory.markQueries(i.search.rawQuery as string, undefined);
                      });
                      return;
                    }

                    saveSearches(user?.id, search.tcg, [i.search.id as string]).then(({ data, error }) => {
                      if (error || !data?.length) {
                        console.error('error', error);
                        return;
                      }

                      // adjust local storage
                      onSearchSaved(i.search.queryId, data[0].savedSearch.id);
                      localHistory.markQueries(i.search.rawQuery as string, data[0].savedSearch.id);
                    });
                  }}
                  className={styles.actionIcon}
                >
                  {i.savedSearch && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
                  {!i.savedSearch && <IconBook size={18} color={'var(--gourmet-neutral-7)'} />}
                </ActionIcon>
              ),
              'In List': (
                <>
                  <ExistsInListsBadge type={'user_search'} resourceId={i.savedSearch?.id} />
                </>
              ),
            },
          };
        }) ?? [],
    };
  }, [
    historyData?.items,
    i18n.language,
    search.tcg,
    user?.id,
    localHistory.markQueries,
    onSearchSaved,
    onSearchUnsaved,
    t,
  ]);
}
