import { Loader, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { GridListRenderer } from '@/parcels/lists/ListsOverview/ListRenderer/GridListRenderer.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { ListPreviewCard } from '../../ListPreviewCard/ListPreviewCard';

export function ListsOverviewGrid({
  isLoading,
  isPreviewsLoading,
  userLists,
}: {
  isLoading: boolean;
  isPreviewsLoading: boolean;
  userLists: UserListWithResources[];
}) {
  const smallScreen = useMediaQuery('(max-width: 830px)');
  const { lists: localUserLists, setLists } = useUserLists();

  return (
    <>
      <SimpleGrid cols={3} spacing="1rem">
        {userLists.map((list) => (
          <ListPreviewCard key={list.list.id} {...list} />
        ))}
      </SimpleGrid>

      <SimpleGrid cols={smallScreen ? 1 : 2} spacing={'2.5rem'}>
        {userLists.length === 0 && isLoading && <Loader color="var(--gourmet-blue-1)" size={'sm'} />}
        {userLists.map((list) => {
          return (
            <GridListRenderer
              key={list.list.id}
              listWithResources={list}
              isLoading={isLoading || isPreviewsLoading}
              onUpdate={(list) => {
                const newLists: UserListWithResources[] = [];
                localUserLists.forEach((l) => {
                  if (l.list.id === list.id) {
                    newLists.push({ list: list, resources: l.resources, size: l.size });
                  } else {
                    newLists.push(l);
                  }
                });
                setLists(newLists);
              }}
              onDelete={(id) => {
                const list = localUserLists.find((l) => l.list.id === id);
                if (!list) return;

                const newLists = [...localUserLists.filter((l) => l.list.id !== id)];
                setLists(newLists);
              }}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}
