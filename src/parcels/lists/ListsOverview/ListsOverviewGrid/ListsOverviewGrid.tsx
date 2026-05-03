import {Loader, SimpleGrid} from '@mantine/core';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {GridListRenderer} from '@/parcels/lists/ListsOverview/ListRenderer/GridListRenderer.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function ListsOverviewGrid({
  tcg,
  isLoading,
  isPreviewsLoading,
  userLists,
}: {
  tcg: Tcg;
  isLoading: boolean;
  isPreviewsLoading: boolean;
  userLists: UserListWithResources[];
}) {
  const { lists: localUserLists, setLists } = useUserLists();

  return (
    <SimpleGrid cols={2} spacing={'2.5rem'}>
      {userLists.length === 0 && isLoading && <Loader color="var(--gourmet-blue-1)" size={'sm'} />}
      {userLists.map((list) => {
        return (
          <GridListRenderer
            key={list.list.id}
            tcg={tcg}
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
  );
}
