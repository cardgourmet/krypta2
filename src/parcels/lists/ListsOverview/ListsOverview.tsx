import {Divider, Group, Loader, SimpleGrid, Stack} from '@mantine/core';
import {useCallback, useEffect, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {fetchLists} from '@/parcels/lists/api.ts';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {ListRenderer} from '@/parcels/lists/ListsOverview/ListRenderer/ListRenderer.tsx';
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
  const [listsData, setListsData] = useState<UserListResponse | undefined>(undefined);
  const userLists = (listsData?.items ?? []) as UserListWithResources[];
  const [isLoading, setIsLoading] = useState(false);

  const noti = useGourmetNotification();

  const refetchLists = useCallback(() => {
    if (!user?.id) return;
    setIsLoading(true);
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
    });
  }, [user?.id, search.sortBy, search.sortDir, search.tcg, noti.show]);

  useEffect(() => {
    refetchLists();
  }, [refetchLists]);

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
            onSuccess={() => {
              refetchLists();
            }}
          />
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <DesktopListOverviewSettings />

      <Stack mt={'xl'}>
        <SimpleGrid cols={2} spacing={'2.5rem'}>
          {userLists.length === 0 && isLoading && <Loader color="var(--gourmet-blue-1)" size={'sm'} />}
          {userLists.map((list) => {
            return (
              <ListRenderer
                key={list.list.id}
                tcg={tcg}
                listWithResources={list}
                isLoading={isLoading}
                onCreate={() => {
                  refetchLists();
                }}
                onDelete={() => {
                  refetchLists();
                }}
              />
            );
          })}
        </SimpleGrid>
      </Stack>
    </div>
  );
}
