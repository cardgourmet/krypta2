import { Button, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconSettings, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { fetchListsPreview } from '@/parcels/lists/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import { ListOverviewSettings } from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/ListOverviewSettings.tsx';
import { ListsOverviewGrid } from '@/parcels/lists/ListsOverview/ListsOverviewGrid/ListsOverviewGrid.tsx';
import { ListsOverviewTable } from '@/parcels/lists/ListsOverview/ListsOverviewTable/ListsOverviewTable.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { useGourmetNotification } from '@/parcels/notification/useGourmetNotification.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import { Route } from '@/routes/me/lists';

export default function ListsOverview() {
  const { user } = useAuth();
  const noti = useGourmetNotification();
  const { t } = useTranslation('lists', { keyPrefix: 'overview' });

  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: t('header.title'),
      },
    ],
  });

  const search = Route.useSearch();
  const { tcg } = search;

  const { lists: localUserLists, setLists } = useUserLists();
  const processedLocalUserLists: UserListWithResources[] = useMemo(() => {
    let lists: UserListWithResources[] = localUserLists
      .map((list) => {
        return { ...list };
      })
      .filter((l) => {
        const allowed = l.list.allowedTcgs;
        if (!allowed) return true;
        if (tcg === 'all') return true;
        return allowed.includes(tcg as Tcg);
      });
    if (search.search.trim().length > 0) {
      lists = lists.filter((l) => l.list.name.toLowerCase().includes(search.search.toLowerCase()));
    }
    sortLists(lists, search.sortBy, search.sortDir);

    return lists;
  }, [localUserLists, search.search, search.sortBy, search.sortDir, tcg]);

  const [userListsWithResources, setUserListsWithResources] = useState<UserListWithResources[]>([]);
  const refetchListsContent = useCallback(() => {
    if (!user?.id) return;

    setIsPreviewsLoading(true);
    fetchListsPreview(user.id, undefined, search.tcg === 'all' ? undefined : (search.tcg as Tcg), 6).then((res) => {
      setIsPreviewsLoading(false);

      if (res.error) {
        noti.show('Unknown error', `${res.error}`, 'error');
        return;
      }
      if (!res.data) return;

      const appliedLists: UserListWithResources[] = processedLocalUserLists?.map((listWithRes) => {
        const newList = res.data?.items.find((l) => l.list.id === listWithRes.list.id);
        if (!newList) return listWithRes as UserListWithResources;

        return { ...listWithRes, resources: newList.resources ?? listWithRes.resources } as UserListWithResources;
      });

      setUserListsWithResources(appliedLists);
    });
  }, [user?.id, search.tcg, noti, processedLocalUserLists]);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    // only refetch the content if the user lists change in any way (order, filter, etc.)
    refetchListsContent();
  }, [processedLocalUserLists]);

  const [isLoading] = useState(false);
  const [isPreviewsLoading, setIsPreviewsLoading] = useState(false);

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

  const smallScreen = useMediaQuery('(max-width: 800px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      <Drawer
        position={'left'}
        style={{ backgroundColor: 'var(--gourmet-neutral-0)' }}
        size="100%"
        opened={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        withCloseButton={false}
      >
        <Stack>
          <Group justify={'space-between'}>
            <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
              {t('settings.title')}
            </Text>
            <Button onClick={() => setIsSidebarOpen(false)} style={{ padding: 0, border: 'none', background: 'none' }}>
              <IconX size={18} color={'var(--gourmet-neutral-8)'} />
            </Button>
          </Group>

          <ListOverviewSettings onChange={() => setIsSidebarOpen(false)} />
        </Stack>
      </Drawer>
      {!smallScreen && <ListOverviewSettings />}
      {smallScreen && (
        <Button
          onClick={() => setIsSidebarOpen(true)}
          color={'var(--gourmet-neutral-2)'}
          leftSection={
            <Group gap={'0.5rem'}>
              <IconSettings size={20} color={'var(--gourmet-neutral-9)'} />
              <GourmetText cgmff={'ui'}>{t('settings.title')}</GourmetText>
            </Group>
          }
        />
      )}

      <Stack mt={'xl'} mb={'2.5rem'}>
        {search.display === 'grid' && (
          <ListsOverviewGrid
            isLoading={isLoading}
            isPreviewsLoading={isPreviewsLoading}
            userLists={userListsWithResources}
          />
        )}
        {search.display === 'table' && (
          <ListsOverviewTable
            isLoading={isLoading}
            userLists={userListsWithResources}
            onUpdate={(list) => {
              const newLists: UserListWithResources[] = [];
              localUserLists.forEach((l) => {
                if (l.list.id === list.id) {
                  newLists.push({ list: list, resources: l.resources, size: l.size });
                } else {
                  newLists.push(l);
                }
              });
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
