import {Divider, Group, SimpleGrid, Stack} from '@mantine/core';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import type {fetchLists} from '@/parcels/lists/api.ts';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {ListRenderer} from '@/parcels/lists/ListsOverview/ListRenderer/ListRenderer.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export default function ListsOverview({ tcg, res }: { tcg: Tcg; res: Awaited<ReturnType<typeof fetchLists>> }) {
  const { data } = res;
  const { user } = useAuth();
  const userLists = data?.items as UserListWithResources[];

  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Listen',
      },
    ],
  });

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

          <CreateListButton />
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <DesktopListOverviewSettings />

      <Stack mt={'xl'}>
        <SimpleGrid cols={2} spacing={'2.5rem'}>
          {userLists.map((list) => {
            return <ListRenderer key={list.list.id} tcg={tcg} listWithResources={list} />;
          })}
        </SimpleGrid>
      </Stack>
    </div>
  );
}
