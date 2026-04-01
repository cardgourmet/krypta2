import {Divider, Group, Stack} from '@mantine/core';
import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {ListsOverviewGrid} from '@/parcels/lists/ListsOverview/ListsOverviewGrid/ListsOverviewGrid.tsx';
import {ListsOverviewTable} from '@/parcels/lists/ListsOverview/ListsOverviewTable/ListsOverviewTable.tsx';
import type {UserListResponse, UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {Route} from '@/routes/me/lists';

export default function ListsOverview() {
  const { user } = useAuth();

  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Listen',
      },
    ],
  });

  const search = Route.useSearch();
  const { tcg } = search;

  const [listsData, setListsData] = useState<UserListResponse | undefined>(undefined);
  const userLists = (listsData?.items ?? []) as UserListWithResources[];

  const [isLoading] = useState(false);

  const { lists: localUserLists, setLists } = useUserLists();
  useEffect(() => {
    const lists: UserListWithResources[] = localUserLists.map((list) => {
      return {
        ...list,
        resources: {},
      };
    });
    sortLists(lists, search.sortBy, search.sortDir);

    setListsData({
      currentPage: 1,
      nextPage: 1,
      hasNextPage: false,
      lastPage: 1,
      items: lists,
    });
  }, [localUserLists, search.sortBy, search.sortDir]);

  const refetchLists = useCallback(() => {
    if (!user?.id) return;
    /*setIsLoading(true);
    fetchLists(
      user.id,
      search.sortBy,
      search.sortDir === 'auto' ? undefined : search.sortDir,
      search.tcg,
      undefined,
      undefined,
    ).then((res) => {
      setIsLoading(false);

      if (res.error) {
        noti.show('Unknown error', `${res.error}`, 'error');
        return;
      }

      setListsData(res.data);
    });*/
  }, [user?.id]);

  useEffect(() => {
    refetchLists();
  }, [refetchLists]);

  const [scrollToListId, setScrollToListId] = useState<string | null>(null);
  useEffect(() => {
    if (!scrollToListId) return;

    requestAnimationFrame(() => {
      document.getElementById(`list-${scrollToListId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });

    setScrollToListId(null);
  }, [scrollToListId]);

  return (
    <div>
      <title>{`Your Lists – Cardgourmet`}</title>
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

          <CreateListButton
            onSuccess={(list) => {
              const newList = { list: list, resources: {}, size: 0 };
              const newLists = [...localUserLists, newList];
              setLists(newLists);

              setScrollToListId(list.id);
            }}
          />
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <DesktopListOverviewSettings />

      <Stack mt={'xl'}>
        {search.display === 'grid' && <ListsOverviewGrid tcg={tcg} isLoading={isLoading} userLists={userLists} />}
        {search.display === 'table' && <ListsOverviewTable tcg={tcg} isLoading={isLoading} userLists={userLists} />}
      </Stack>
    </div>
  );
}

function sortLists(lists: UserListWithResources[], searchSortBy?: string, searchSortDir?: string) {
  const sortBy = searchSortBy ?? 'name';
  const sortDir = searchSortDir === 'auto' ? 'asc' : (searchSortDir ?? 'asc');

  lists.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') {
      comparison = a.list.name.localeCompare(b.list.name);
    } else if (sortBy === 'updatedAt') {
      const dateA = a.list.updatedAt ? new Date(a.list.updatedAt).getTime() : 0;
      const dateB = b.list.updatedAt ? new Date(b.list.updatedAt).getTime() : 0;
      comparison = dateA - dateB;
    } else if (sortBy === 'size') {
      const sizeA = a.size ?? 0;
      const sizeB = b.size ?? 0;
      comparison = sizeA - sizeB;
    }
    return sortDir === 'desc' ? -comparison : comparison;
  });
}
