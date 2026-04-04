import {Divider, Group, Stack} from '@mantine/core';
import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {fetchListsPreview} from '@/parcels/lists/api.ts';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {ListsOverviewGrid} from '@/parcels/lists/ListsOverview/ListsOverviewGrid/ListsOverviewGrid.tsx';
import {ListsOverviewTable} from '@/parcels/lists/ListsOverview/ListsOverviewTable/ListsOverviewTable.tsx';
import type {UserListResponse, UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';
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

  const [userListsData, setUserListsData] = useState<UserListResponse | undefined>(undefined);
  const userLists = (userListsData?.items ?? []) as UserListWithResources[];
  const [userListsResources, setUserListsResources] = useState<Record<string, UserListWithResources>>({});

  const [isLoading] = useState(false);
  const [isPreviewsLoading, setIsPreviewsLoading] = useState(false);

  const { lists: localUserLists, setLists } = useUserLists();
  const sortOrFilterLists = useCallback(() => {
    let lists: UserListWithResources[] = localUserLists.map((list) => {
      return {
        ...list,
        resources: userListsResources[list.list.id]?.resources ?? {},
      };
    });

    if (search.search.trim().length > 0) {
      lists = lists.filter((l) => l.list.name.toLowerCase().includes(search.search.toLowerCase()));
    }
    sortLists(lists, search.sortBy, search.sortDir);

    setUserListsData({
      currentPage: 1,
      nextPage: 1,
      hasNextPage: false,
      lastPage: 1,
      items: lists,
    });
  }, [localUserLists, search.search, search.sortBy, search.sortDir, userListsResources]);
  useEffect(() => {
    sortOrFilterLists();
  }, [sortOrFilterLists]);

  const noti = useGourmetNotification();
  const refetchListsContent = useCallback(() => {
    if (!user?.id) return;
    if (Object.keys(userListsResources).length > 0) return;

    const listIds = userLists.map((list) => {
      return list.list.id;
    });
    if (listIds.length === 0) return;

    setIsPreviewsLoading(true);
    fetchListsPreview(user.id, listIds, undefined, undefined).then((res) => {
      setIsPreviewsLoading(false);

      if (res.error) {
        noti.show('Unknown error', `${res.error}`, 'error');
        return;
      }
      if (!res.data) return;

      const appliedLists: UserListWithResources[] =
        userListsData?.items.map((listWithRes) => {
          const newList = res.data?.items.find((l) => l.list.id === listWithRes.list.id);
          if (!newList) return listWithRes as UserListWithResources;

          return { ...listWithRes, resources: newList.resources ?? listWithRes.resources } as UserListWithResources;
        }) ?? [];

      const newUserListsResources: Record<string, UserListWithResources> = {};
      appliedLists.forEach((appliedList) => {
        newUserListsResources[appliedList.list.id] = appliedList;
      });

      setUserListsResources(newUserListsResources);
    });
  }, [user?.id, userLists, noti.show, userListsData, userListsResources]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    refetchListsContent();
  }, [userLists]);

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
        {search.display === 'grid' && (
          <ListsOverviewGrid
            tcg={tcg}
            isLoading={isLoading}
            isPreviewsLoading={isPreviewsLoading}
            userLists={userLists}
          />
        )}
        {search.display === 'table' && (
          <ListsOverviewTable
            tcg={tcg}
            isLoading={isLoading}
            userLists={userLists}
            onUpdate={(list) => {
              const newList = { list: list, resources: {}, size: 0 };
              const newLists = [...localUserLists, newList];
              setLists(newLists);
            }}
            onDelete={(id) => {
              const list = localUserLists.find((l) => l.list.id === id);
              if (!list) return;

              const newLists = [...localUserLists.filter((l) => l.list.id !== id)];
              setLists(newLists);
            }}
          />
        )}
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
