import {Center, Group, Stack} from '@mantine/core';
import {IconCards, IconSearch} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {ListElementHeader} from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type {ResolvedUserListResource, UserListWithResources} from '@/parcels/lists/types.ts';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {createProps} from '@/parcels/overview/CardGrid/ImageCardWithSelection/createProps.ts';
import {ImageCard} from '@/parcels/overview/ImageCard/ImageCard.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ListRenderer.module.css';

export function ListRenderer({ tcg, listWithResources }: { tcg: Tcg; listWithResources: UserListWithResources }) {
  const { t, i18n } = useTranslation('lists');
  const { list, size, resources: allResources } = listWithResources;

  const searchResources = allResources?.user_search ?? [];
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
              <Group wrap={'nowrap'}>
                <div style={{ justifySelf: 'start', height: '100%', flexShrink: 0, color: list.color ?? '' }}>
                  <Center className={styles.resourceIcon}>
                    <IconSearch size={20} />
                  </Center>
                </div>
                <SearchResourcesRenderer tcg={tcg} resources={searchResources} />
              </Group>
            )}
            {cardResources.length > 0 && (
              <Group wrap={'nowrap'} h={'5rem'}>
                <div style={{ justifySelf: 'start', height: '100%', flexShrink: 0, color: list.color ?? '' }}>
                  <Center className={styles.resourceIcon}>
                    <IconCards size={20} />
                  </Center>
                </div>
                <CardResourcesRenderer tcg={tcg} resources={cardResources} />
              </Group>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

function SearchResourcesRenderer({ resources }: { tcg: Tcg; resources: ResolvedUserListResource[] }) {
  return (
    <Stack style={{ wordBreak: 'break-all', height: '100%', overflowY: 'hidden' }}>
      {resources.map((resource) => (
        <Group key={resource.listResource.resourceId} h={'1.5rem'}>
          <div>{JSON.stringify(resource)}</div>
        </Group>
      ))}
    </Stack>
  );
}

function CardResourcesRenderer({ tcg, resources }: { tcg: Tcg; resources: ResolvedUserListResource[] }) {
  return (
    <>
      {resources.map((resource) => {
        const data = resource.resourceData as unknown as TcgDataCard;
        const prop = createProps(tcg, {
          card: data,
          preferredDisplayLanguage: 'en',
          preferredDisplayFaceIndex: 0,
        } as TcgSearchDataCard);

        return <ImageCard key={resource.listResource.resourceId} tcg={tcg} prop={prop} style={{ height: '100%' }} />;
      })}
    </>
  );
}
