import {Center, Divider, Group, SimpleGrid, Stack} from '@mantine/core';
import {IconCards, IconSearch} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import type {fetchLists} from '@/parcels/lists/api.ts';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {ListElementHeader} from '@/parcels/lists/ListsOverview/ListElementHeader/ListElementHeader.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {Route} from '@/routes/me/lists';
import styles from './ListsOverview.module.css';

export default function ListsOverview({ res }: { res: Awaited<ReturnType<typeof fetchLists>> }) {
  const search = Route.useSearch();

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
        {search.display === 'grid' && (
          <SimpleGrid cols={2} spacing={'2.5rem'}>
            {userLists.map((list) => {
              return <ListRenderer key={list.list.id} listWithResources={list} />;
            })}
          </SimpleGrid>
        )}
      </Stack>
    </div>
  );
}

function ListRenderer({ listWithResources }: { listWithResources: UserListWithResources }) {
  const { t, i18n } = useTranslation('lists');
  const { list, size, resources: allResources } = listWithResources;

  const searchResources = allResources?.search ?? [];
  const cardResources = allResources?.card ?? [];

  return (
    <Stack key={list.id} gap={'0.5rem'}>
      <ListElementHeader list={list} />

      <Group justify={'space-between'}>
        <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
          {size}/100 Resources
        </GourmetText>
        <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
          {t('last-updated')}{' '}
          <span title={new Date(list.updatedAt).toLocaleString()}>
            {formatRelativeTimestamp(list.updatedAt, i18n.language)}
          </span>
        </GourmetText>
      </Group>

      <Stack mt={'0.75rem'}>
        {(size ?? 0) === 0 && (
          <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
            This list is empty.
          </GourmetText>
        )}
        {(size ?? 0) > 0 && (
          <Stack>
            {searchResources.length > 0 && (
              <Group wrap={'nowrap'} h={'5rem'}>
                <div style={{ justifySelf: 'start', height: '100%', flexShrink: 0, color: list.color ?? '' }}>
                  <Center className={styles.resourceIcon}>
                    <IconSearch size={22} />
                  </Center>
                </div>
                <div style={{ wordBreak: 'break-all', height: '100%', overflowY: 'hidden' }}>
                  <GourmetText>{JSON.stringify(searchResources)}</GourmetText>
                </div>
              </Group>
            )}
            {cardResources.length > 0 && (
              <Group wrap={'nowrap'} h={'5rem'}>
                <div style={{ justifySelf: 'start', height: '100%', flexShrink: 0, color: list.color ?? '' }}>
                  <Center className={styles.resourceIcon}>
                    <IconCards size={22} />
                  </Center>
                </div>
                <div style={{ wordBreak: 'break-all', height: '100%', overflowY: 'hidden' }}>
                  <GourmetText>{JSON.stringify(cardResources)}</GourmetText>
                </div>
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
