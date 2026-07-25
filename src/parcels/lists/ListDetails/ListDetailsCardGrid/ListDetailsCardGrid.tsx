import { Group, SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCards } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import CardRenderer from '@/parcels/lists/ListDetails/ListDetailsCardGrid/CardRenderer.tsx';
import { ListDetailsCardGridSelectionOverlay } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGridSelectionOverlay.tsx';
import type {
  ResolvedUserListResource,
  UserList,
  UserListResource,
  UserListWithResources,
} from '@/parcels/lists/types.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import type { components } from '@/schema/api';

type CardResource = {
  listResource: components['schemas']['UserListResource'];
  resourceData: components['schemas']['JsonObject'];
};

export function ListDetailsCardGrid({
  owner,
  list,
  sortedCardResoures,
  setCardResources,
  listWithResources,
  suggestAddCard,
  onRemoveFromList,
  onAddToList,
  selectionIndexShift,
}: {
  owner: DataUser;
  list: UserList;
  sortedCardResoures: CardResource[];
  setCardResources: (cardResources: ResolvedUserListResource[]) => void;
  listWithResources: UserListWithResources;
  suggestAddCard?: boolean;
  onRemoveFromList?: (res: UserListResource, data: CardResource) => void;
  onAddToList?: (res: UserListResource, data: CardResource) => void;
  selectionIndexShift: number;
}) {
  const { t } = useTranslation('lists');

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

      <SimpleGrid
        cols={tinyScreen ? 2 : smallestScreen ? 3 : smallerScreen ? 4 : smallScreen ? 5 : 6}
        style={{
          padding: '0.5rem',
          position: 'relative',
        }}
      >
        {sortedCardResoures.map((data, index) => {
          return (
            <CardRenderer
              index={index}
              selectionIndexShift={selectionIndexShift}
              owner={owner}
              key={data.listResource.resourceId}
              list={listWithResources}
              data={data}
              onAddToList={(res) => {
                if (onAddToList) onAddToList(res, data);
              }}
              onRemoveFromList={(listId) => {
                if (onRemoveFromList) onRemoveFromList(data.listResource, data);
                if (listId !== list.id) return;

                const newCardResources = [...sortedCardResoures];
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
        {suggestAddCard && <div style={{ border: '1px solid gray' }}>Add card</div>}

        <ListDetailsCardGridSelectionOverlay />
      </SimpleGrid>
    </Stack>
  );
}
