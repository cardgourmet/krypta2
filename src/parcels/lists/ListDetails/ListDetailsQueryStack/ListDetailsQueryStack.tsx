import { Group, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ListDetailsCardGridSelectionOverlay } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGridSelectionOverlay.tsx';
import { SearchRenderer } from '@/parcels/lists/ListDetails/ListDetailsQueryStack/SearchRenderer.tsx';
import type { UserList, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import type { components } from '@/schema/api';

type SearchResource = {
  listResource: components['schemas']['UserListResource'];
  otherListResources?: components['schemas']['UserListResource'][] | null;
  resourceData: components['schemas']['JsonObject'];
};

export function ListDetailsQueryStack({
  owner,
  list,
  sortedSearchResources,
  setSearchResources,
  listWithResources,
  onRemoveFromList,
  onAddToList,
}: {
  owner: DataUser;
  list: UserList;
  listWithResources: UserListWithResources;
  sortedSearchResources: SearchResource[];
  setSearchResources: (searchResources: SearchResource[]) => void;
  onRemoveFromList?: (res: UserListResource, data: SearchResource) => void;
  onAddToList?: (res: UserListResource, data: SearchResource) => void;
}) {
  const { t } = useTranslation('lists');

  return (
    <Stack>
      <Group gap={'0.5rem'}>
        <IconSearch size={22} color={listWithResources.list.color ?? 'var(--gourmet-neutral-9)'} />
        <GourmetText cgmff={'title'} fz={'h3'} c={listWithResources.list.color ?? 'var(--gourmet-neutral-9)'}>
          {t('details.savedSearches')}
        </GourmetText>
        <GourmetText cgmff={'ui'}>({sortedSearchResources.length})</GourmetText>
      </Group>

      <Stack gap={'0.5rem'} pos={'relative'} p={'0.5rem'}>
        {sortedSearchResources.map((data, index) => {
          return (
            <SearchRenderer
              owner={owner}
              index={index}
              key={data.listResource.resourceId}
              list={listWithResources}
              data={data}
              onAddToList={(res) => {
                if (onAddToList) onAddToList(res, data);
              }}
              onRemoveFromList={(listId) => {
                if (onRemoveFromList) onRemoveFromList(data.listResource, data);
                if (listId !== list.id) return;

                const newSearchResources = [...sortedSearchResources];
                for (let i = 0; i < newSearchResources.length; i++) {
                  if (newSearchResources[i].listResource.resourceId === data.listResource.resourceId) {
                    newSearchResources.splice(i, 1);
                    break;
                  }
                }

                setSearchResources(newSearchResources);
              }}
            />
          );
        })}

        <ListDetailsCardGridSelectionOverlay />
      </Stack>
    </Stack>
  );
}
