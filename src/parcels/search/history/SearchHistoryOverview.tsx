import {ActionIcon, Divider, Group, Stack, Tooltip} from '@mantine/core';
import {IconBook, IconBook2, IconDotsVertical, IconPlayerPlayFilled} from '@tabler/icons-react';
import {Link, useNavigate} from '@tanstack/react-router';
import {type ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {GourmetTable, type GourmetTableData} from '@/parcels/overview/GourmetTable/GourmetTable.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import {fetchSearchHistory} from '@/parcels/search/api.ts';
import {SearchHistoryMoreMenu} from '@/parcels/search/history/SearchHistoryMoreMenu.tsx';
import {SearchHistoryOverviewSettings} from '@/parcels/search/history/SearchHistoryOverviewSettings.tsx';
import type {PagedUserSearchHistoryEntry, UserSavedSearch, UserSearchHistoryEntry} from '@/parcels/search/types.ts';
import {tcgSearchParamsDefaults} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {Route} from '@/routes/me/history';
import styles from './SearchHistoryOverview.module.css';

export function SearchHistoryOverview() {
  const { i18n } = useTranslation();
  const search = Route.useSearch();

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: !user ? `Guest` : `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Suchhistorie',
      },
    ],
  });

  // TODO: if not logged in: only show what is in local storage
  // (with warning that not all are shown because not logged in)

  // const history = useSearchHistory(search.tcg);
  const [remoteHistoryData, setRemoteHistoryData] = useState<PagedUserSearchHistoryEntry | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    const abort = new AbortController();
    fetchSearchHistory(user.id, search.tcg, undefined, search.sortDir, search.page - 1, search.size, abort).then(
      ({ data, error }) => {
        setIsLoading(false);

        if (error) {
          console.error('error while fetching search history', error);
          return;
        }

        setRemoteHistoryData(data);
      },
    );

    return () => {
      // abort.abort();
      setIsLoading(false);
    };
  }, [search.page, search.size, search.sortDir, search.tcg, user?.id]);

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

  const tableData: GourmetTableData<UserSearchHistoryEntry> = useMemo(() => {
    return {
      columns: ['Query', 'Cards', 'Time', 'Speed', 'Saved'],
      colSizes: ['', '6', '8', '6', '4'],
      rows:
        remoteHistoryData?.items?.map((i) => {
          return {
            entry: i,
            data: {
              Time: (
                <Tooltip label={new Date(i.search.createdAt).toLocaleString()} openDelay={500}>
                  <GourmetText cgmff={'ui'}>{formatRelativeTimestamp(i.search.createdAt, i18n.language)}</GourmetText>
                </Tooltip>
              ),
              Query: <GourmetText cgmff={'monospace'}>{i.search.rawQuery}</GourmetText>,
              Cards: <GourmetText cgmff={'monospace'}>{i.totalCount}</GourmetText>,
              Speed: <GourmetText cgmff={'ui'}>{i.search.executionTime}ms</GourmetText>,
              Saved: (
                <ActionIcon
                  onClick={() => {
                    // save search
                  }}
                  className={styles.actionIcon}
                >
                  {i.savedSearch && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
                  {!i.savedSearch && <IconBook size={18} color={'var(--gourmet-neutral-7)'} />}
                </ActionIcon>
              ),
            },
          };
        }) ?? [],
    };
  }, [remoteHistoryData?.items, i18n.language]);

  const onSearchSaved = useCallback(
    (queryId: string, id: string) => {
      if (!remoteHistoryData) return;
      const dataCopyItems = [...remoteHistoryData.items];
      for (let i = 0; i < dataCopyItems.length; i++) {
        const copyItem = { ...dataCopyItems[i] };
        if (copyItem.search.queryId === queryId && !copyItem.savedSearch) {
          copyItem.savedSearch = { id: id } as UserSavedSearch;
        }
        dataCopyItems[i] = copyItem;
      }
      setRemoteHistoryData({ ...remoteHistoryData, items: dataCopyItems });
    },
    [remoteHistoryData],
  );

  return (
    <div>
      <title>{`Your Search History – Cardgourmet`}</title>
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

          {user?.id && (remoteHistoryData?.lastPage ?? 1) > 1 && (
            <Pagination
              currentPage={search.page}
              lastPage={remoteHistoryData?.lastPage ?? search.page}
              isLoading={false}
              setSettings={setSettings}
            />
          )}
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <SearchHistoryOverviewSettings />

      <Stack mt={'xl'} style={{ padding: '0.5rem' }}>
        <GourmetTable
          tcg={'mtg'}
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
      </Stack>
    </div>
  );
}

type TableEntryProps = {
  entry: UserSearchHistoryEntry;
  data: Record<string, ReactElement>;
  tableData: GourmetTableData<UserSearchHistoryEntry>;
  tcg: Tcg;
  onSearchSaved?: (resourceId: string) => void;
};

function HorTableRow({ entry, data, tableData, tcg, onSearchSaved }: TableEntryProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <tr key={entry.search.id} data-selected={false} style={{ padding: '0 1rem' }}>
      <td style={{ height: '2.5rem' }}>{''}</td>
      {tableData.columns.map((column) => (
        <td key={column}>{data[column]}</td>
      ))}
      <td>
        <Group wrap={'nowrap'} gap={'0.25rem'} justify={'end'} p={'0 0.25rem 0 0'}>
          <Link
            to={'/$tcg/cards'}
            params={{ tcg: tcg }}
            search={{
              ...tcgSearchParamsDefaults,
              query: entry.search.rawQuery,
            }}
            target="_blank"
            rel="noreferrer noopener"
            style={{ padding: 0 }}
          >
            <Tooltip label={'Re-execute query'} openDelay={500}>
              <ActionIcon style={{ pointerEvents: 'auto' }} className={styles.playButton}>
                <IconPlayerPlayFilled size={18} color={'var(--gourmet-blue-1)'} style={{ flexShrink: 0 }} />
              </ActionIcon>
            </Tooltip>
          </Link>

          <Tooltip label={'More options'} openDelay={500}>
            <SearchHistoryMoreMenu
              tcg={tcg}
              search={entry}
              target={
                <ActionIcon
                  style={{ pointerEvents: 'auto' }}
                  color="var(--gourmet-neutral-dark-4)"
                  className={styles.moreButton}
                >
                  <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} style={{ flexShrink: 0 }} />
                </ActionIcon>
              }
              menuOpened={menuOpened}
              setMenuOpened={setMenuOpened}
              onSearchSaved={(id) => {
                if (onSearchSaved) onSearchSaved(id);
              }}
            />
          </Tooltip>
        </Group>
      </td>
    </tr>
  );
}

function VerTableRow({ entry, data, tableData, tcg, onSearchSaved }: TableEntryProps) {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <>
      {tableData.columns.map((column) => (
        <tr key={`${column}`} data-cell={'not-last'}>
          <th style={{ width: '5.25rem' }}>{column}</th>
          <td data-selected={false}>{data[column]}</td>
        </tr>
      ))}
      <tr key={`tools-1`} data-cell={'last'}>
        <th style={{ width: '5.25rem' }}>
          <GourmetText cgmc={'neutral-5'}>Tools</GourmetText>
        </th>
        <td data-selected={false}>
          <Group wrap={'nowrap'} gap={'0.25rem'} justify={'space-between'} p={'0 0.25rem 0 0'}>
            <Link
              to={'/$tcg/cards'}
              params={{ tcg: tcg }}
              search={{
                ...tcgSearchParamsDefaults,
                query: entry.search.rawQuery,
              }}
              style={{ padding: 0 }}
            >
              <Tooltip label={'Re-execute query'} openDelay={500}>
                <ActionIcon style={{ pointerEvents: 'auto' }} className={styles.playButton}>
                  <IconPlayerPlayFilled size={18} color={'var(--gourmet-blue-1)'} style={{ flexShrink: 0 }} />
                </ActionIcon>
              </Tooltip>
            </Link>

            <Tooltip label={'More options'} openDelay={500}>
              <SearchHistoryMoreMenu
                tcg={tcg}
                search={entry}
                target={
                  <ActionIcon
                    style={{ pointerEvents: 'auto' }}
                    color="var(--gourmet-neutral-dark-4)"
                    className={styles.moreButton}
                  >
                    <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} style={{ flexShrink: 0 }} />
                  </ActionIcon>
                }
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                onSearchSaved={(id) => {
                  if (onSearchSaved) onSearchSaved(id);
                }}
              />
            </Tooltip>
          </Group>
        </td>
      </tr>
    </>
  );
}
