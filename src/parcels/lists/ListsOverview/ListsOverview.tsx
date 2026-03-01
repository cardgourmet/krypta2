import {Divider, Group, SimpleGrid, Stack} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import type {fetchLists} from '@/parcels/lists/api.ts';
import CreateListButton from '@/parcels/lists/ListsOverview/CreateListButton/CreateListButton.tsx';
import {DesktopListOverviewSettings} from '@/parcels/lists/ListsOverview/DesktopListOverviewSettings/DesktopListOverviewSettings.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {ListElementHeader} from '@/parcels/lists/ListsOverview/ListElementHeader/ListElementHeader.tsx';
import type {UserListWithSize} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export default function ListsOverview({ res }: { res: Awaited<ReturnType<typeof fetchLists>> }) {
  const { t, i18n } = useTranslation('lists');

  const { data } = res;
  const { user } = useAuth();
  const userLists = data?.items as UserListWithSize[];

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
          {userLists.map(({ list }) => {
            return (
              <Stack key={list.id} gap={'0.5rem'}>
                <ListElementHeader list={list} />

                <Group justify={'end'}>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                    {t('last-updated')}{' '}
                    <span title={new Date(list.updatedAt).toLocaleString()}>
                      {formatRelativeTimestamp(list.updatedAt, i18n.language)}
                    </span>
                  </GourmetText>
                </Group>

                <div style={{ wordBreak: 'break-all' }}>
                  <GourmetText>{JSON.stringify(list)}</GourmetText>
                </div>
              </Stack>
            );
          })}
        </SimpleGrid>
      </Stack>
    </div>
  );
}
