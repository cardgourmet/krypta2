import {ActionIcon, Button, Group, Menu, Stack, Tooltip} from '@mantine/core';
import {IconBook, IconBook2, IconLabelFilled} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
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
  const search = Route.useSearch();
  const localHistory = useSearchHistory(search.tcg);

  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { lists } = useUserLists();

  return useMemo(() => {
    const columns = user?.id
      ? ['Query', 'Cards', 'Time', 'Speed', 'Saved', 'In List']
      : ['Query', 'Cards', 'Time', 'Speed'];
    const colSizes = user?.id ? ['', '6', '8', '6', '4', '4'] : ['', '6', '8', '6'];

    return {
      columns: columns,
      colSizes: colSizes,
      rows:
        historyData?.items?.map((i) => {
          const existsInLists = lists.filter((l) => {
            return l.resources?.user_search?.find((r) => r.listResource.resourceId === i.savedSearch?.id);
          });
          const firstList = existsInLists?.at(0);

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
                  {existsInLists?.length > 0 && (
                    <Menu shadow="md" width={250} position={'bottom'} withArrow>
                      <Menu.Target>
                        <Button className={styles.inListButton}>
                          <Group wrap={'nowrap'} gap={'0.2rem'}>
                            <IconLabelFilled size={18} color={firstList?.list?.color ?? ''} />
                            {existsInLists?.length > 1 && (
                              <GourmetText cgmff={'monospace'} fz={'0.8rem'}>
                                +{existsInLists.length - 1}
                              </GourmetText>
                            )}
                          </Group>
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown style={{ zIndex: 0 }}>
                        <Stack gap={'0.5rem'} p={'0.25rem'}>
                          {existsInLists.map((l) => {
                            return (
                              <Link
                                key={l.list.id}
                                to={'/me/lists/$listId'}
                                params={{ listId: l.list.id }}
                                style={{ textDecoration: 'none' }}
                              >
                                <Group wrap={'nowrap'} gap={'0.25rem'}>
                                  <IconLabelFilled size={18} color={l.list.color ?? ''} style={{ flexShrink: 0 }} />
                                  <Tooltip label={l.list.name} openDelay={500}>
                                    <GourmetText
                                      cgmff={'ui'}
                                      fz={'0.9rem'}
                                      style={{ textWrap: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                                    >
                                      {l.list.name}
                                    </GourmetText>
                                  </Tooltip>
                                </Group>
                              </Link>
                            );
                          })}
                        </Stack>
                      </Menu.Dropdown>
                    </Menu>
                  )}
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
    lists,
  ]);
}
