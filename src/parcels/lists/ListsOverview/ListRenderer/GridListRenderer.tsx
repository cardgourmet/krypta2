import {Center, Group, Loader, Stack} from '@mantine/core';
import {IconCards, IconSearch} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {ListElementHeader} from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import {RendererCardResources} from '@/parcels/lists/ListsOverview/ListRenderer/RendererCardResources/RendererCardResources.tsx';
import {RendererSearchResources} from '@/parcels/lists/ListsOverview/ListRenderer/RendererSearchResources/RendererSearchResources.tsx';
import type {UserList, UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './GridListRenderer.module.css';

export function GridListRenderer({
  tcg,
  listWithResources,
  isLoading,
  onUpdate,
  onDelete,
}: {
  tcg: Tcg;
  listWithResources: UserListWithResources;
  isLoading: boolean;
  onUpdate?: (list: UserList) => void;
  onDelete?: (id: string) => void;
}) {
  const { t, i18n } = useTranslation('lists');
  const { list, size, resources: allResources } = listWithResources;

  const searchResources = allResources?.user_search ?? [];
  const cardResources = allResources?.card ?? [];

  return (
    <Stack key={list.id} gap={'0.5rem'}>
      <ListElementHeader list={list} onCreate={onUpdate} onDelete={onDelete} />

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
          <Center>
            <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
              {t('listEmpty')}
            </GourmetText>
          </Center>
        )}
        {(size ?? 0) > 0 && (
          <Stack>
            {isLoading && (
              <Center>
                <Loader color="var(--gourmet-blue-1)" size={'sm'} />
              </Center>
            )}

            {!isLoading && (
              <>
                {searchResources.length === 0 && cardResources.length === 0 && (
                  <Center>
                    <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
                      {t('noResources')}
                    </GourmetText>
                  </Center>
                )}
                {searchResources.length > 0 && (
                  <Group wrap={'nowrap'} gap={'0'} align={'start'}>
                    <div
                      style={{
                        justifySelf: 'start',
                        height: '100%',
                        flexShrink: 0,
                        color: list.color ?? '',
                        marginRight: '1rem',
                      }}
                    >
                      <Center className={styles.resourceIcon}>
                        <IconSearch size={20} />
                      </Center>
                    </div>
                    <RendererSearchResources tcg={tcg} resources={searchResources} />
                  </Group>
                )}
                {cardResources.length > 0 && (
                  <Group wrap={'nowrap'} h={'8rem'} gap={'0'} align={'start'}>
                    <div
                      style={{
                        justifySelf: 'start',
                        height: '100%',
                        flexShrink: 0,
                        color: list.color ?? '',
                        marginRight: '1rem',
                      }}
                    >
                      <Center className={styles.resourceIcon}>
                        <IconCards size={20} />
                      </Center>
                    </div>
                    <Group wrap={'nowrap'} h={'100%'} gap={'0.25rem'}>
                      <RendererCardResources tcg={tcg} resources={cardResources} />
                    </Group>
                  </Group>
                )}
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
