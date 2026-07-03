import { Center, Group, Loader, Space, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { formatRelativeTimestamp } from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import { DeleteListButton } from '@/parcels/lists/ListsOverview/ListRenderer/DeleteListButton/DeleteListButton.tsx';
import { EditListButton } from '@/parcels/lists/ListsOverview/ListRenderer/EditListButton/EditListButton.tsx';
import { ListElementHeader } from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import { RendererCardResources } from '@/parcels/lists/ListsOverview/ListRenderer/RendererCardResources/RendererCardResources.tsx';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { SelectionProgress } from '@/parcels/selection/OverviewSelectionDisplay/SelectionProgress/SelectionProgress.tsx';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function GridListRenderer({
  listWithResources,
  onUpdate,
  onDelete,
}: {
  listWithResources: UserListWithResources;
  isLoading: boolean;
  onUpdate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t, i18n } = useTranslation('lists', { keyPrefix: 'overview' });
  const { list, size, resources: allResources } = listWithResources;

  const cardResources = allResources?.card ?? [];
  const shouldLoad = (size ?? 0) > 0 && !(cardResources.length > 0);

  return (
    <Stack
      key={list.id}
      gap={'0.5rem'}
      style={{
        border: '1px solid var(--gourmet-neutral-3)',
        borderRadius: '0.25rem',
        padding: '1rem',
      }}
    >
      <ListElementHeader list={list} />

      <Space h={'0.25rem'} />

      <Stack w={'100%'} gap={'0.25rem'}>
        <SelectionProgress sections={10} current={size ?? 0} max={100} withoutText />
        <Group justify={'space-between'}>
          <GourmetText cgmff={'ui'} cgmc={'neutral-7'}>
            {size}/100 {t('card.resources')}
          </GourmetText>

          <Group gap={'0.25rem'}>
            {(list.allowedTcgs?.length ?? 0) > 0 && (
              <>
                <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-6'}>
                  {t('card.allowed')}
                </GourmetText>
                <Group gap={'0.15rem'}>
                  {list.allowedTcgs?.map((tcg) => {
                    return (
                      <TcgIcon
                        key={tcg}
                        tcg={tcg as Tcg}
                        size={17}
                        style={{
                          color: 'var(--gourmet-neutral-6)',
                        }}
                      />
                    );
                  })}
                </Group>
              </>
            )}
            {(list.allowedTcgs?.length ?? 0) === 0 && (
              <GourmetText cgmff={'ui'} fz={'0.9rem'} cgmc={'neutral-6'}>
                {t('card.allowedAll')}
              </GourmetText>
            )}
          </Group>
        </Group>
      </Stack>

      <Stack mt={'0.75rem'} h={'100%'}>
        {(size ?? 0) === 0 && (
          <Center h={'100%'}>
            <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
              {t('card.listEmpty')}
            </GourmetText>
          </Center>
        )}
        {(size ?? 0) > 0 && (
          <Stack>
            {shouldLoad && (
              <Center>
                <Loader color="var(--gourmet-blue-1)" size={'sm'} />
              </Center>
            )}

            {!shouldLoad && (
              <>
                {cardResources.length === 0 && (
                  <Center>
                    <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                      {t('card.noResources')}
                    </GourmetText>
                  </Center>
                )}
                {cardResources.length > 0 && (
                  <Group gap={'0.2rem'} align={'start'}>
                    <RendererCardResources resources={cardResources} />
                  </Group>
                )}
              </>
            )}
          </Stack>
        )}

        <Group justify={'space-between'}>
          <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
            {t('card.lastUpdated')}{' '}
            <span title={new Date(list.updatedAt).toLocaleString()}>
              {formatRelativeTimestamp(list.updatedAt, i18n.language)}
            </span>
          </GourmetText>
          <Group gap={'0.25rem'} wrap={'nowrap'}>
            <EditListButton list={list} onSuccess={onUpdate} />
            <DeleteListButton list={list} onSuccess={onDelete} />
          </Group>
        </Group>
      </Stack>
    </Stack>
  );
}
