import { Group, SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCards } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import CardRenderer from '@/parcels/lists/ListDetails/CardRenderer.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import { Route } from '@/routes/me/lists/$listId.tsx';
import type { components } from '@/schema/api';

export function ListDetailsCardGrid({
  list,
  sortedCardResoures,
  cardResources,
  setCardResources,
  listWithResources,
}: {
  list: UserList;
  sortedCardResoures: {
    listResource: components['schemas']['UserListResource'];
    resourceData: components['schemas']['JsonObject'];
  }[];
  cardResources: ResolvedUserListResource[];
  setCardResources: (cardResources: ResolvedUserListResource[]) => void;
  listWithResources: UserListWithResources;
}) {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const { tcg } = useTcg();

  const smallScreen = useMediaQuery('(max-width: 1100px)');
  const smallerScreen = useMediaQuery('(max-width: 930px)');
  const smallestScreen = useMediaQuery('(max-width: 750px)');
  const tinyScreen = useMediaQuery('(max-width: 565px)');

  return (
    <Stack>
      <Group gap={'0.5rem'}>
        <IconCards size={22} color={list.color ?? 'var(--gourmet-neutral-9)'} />
        <GourmetText cgmff={'title'} c={list.color ?? 'var(--gourmet-neutral-9)'} fz={'h3'}>
          {t('details.cards')}
        </GourmetText>
        <GourmetText cgmff={'ui'}>({sortedCardResoures.length})</GourmetText>
      </Group>

      <SimpleGrid cols={tinyScreen ? 2 : smallestScreen ? 3 : smallerScreen ? 4 : smallScreen ? 5 : 6}>
        {sortedCardResoures.map((data) => {
          return (
            <CardRenderer
              key={data.listResource.resourceId}
              list={listWithResources}
              tcg={search.tcg ?? tcg}
              data={data}
              onRemoveFromList={(listId) => {
                if (listId !== list.id) return;

                const newCardResources = [...cardResources];
                for (let i = 0; i < newCardResources.length; i++) {
                  if (newCardResources[i].listResource.resourceId === data.listResource.resourceId) {
                    newCardResources.splice(i, 1);
                    break;
                  }
                }

                setCardResources(newCardResources);
              }}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
