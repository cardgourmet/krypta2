import { SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { GridListRenderer } from '@/parcels/lists/ListsOverview/ListRenderer/GridListRenderer.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';

export function ListsOverviewGrid({
  isLoading,
  isPreviewsLoading,
  listsWithoutResources,
  listsWithResources,
}: {
  isLoading: boolean;
  isPreviewsLoading: boolean;
  listsWithoutResources: UserListWithResources[];
  listsWithResources: UserListWithResources[];
}) {
  const smallScreen = useMediaQuery('(max-width: 830px)');
  const { setLists } = useUserLists();

  const entries = useMemo(() => {
    return listsWithoutResources.map((list) => {
      const withResources = listsWithResources.find((l) => l.list.id === list.list.id);

      return (
        <GridListRenderer
          key={list.list.id}
          listWithResources={withResources ?? list}
          isLoading={isLoading || isPreviewsLoading}
          onUpdate={(list) => {
            const newLists: UserListWithResources[] = [];
            listsWithoutResources.forEach((l) => {
              if (l.list.id === list.id) {
                newLists.push({ list: list, resources: l.resources, size: l.size });
              } else {
                newLists.push(l);
              }
            });
            setLists(newLists);
          }}
          onDelete={(id) => {
            const list = listsWithoutResources.find((l) => l.list.id === id);
            if (!list) return;

            const newLists = [...listsWithoutResources.filter((l) => l.list.id !== id)];
            setLists(newLists);
          }}
        />
      );
    });
  }, [isLoading, isPreviewsLoading, listsWithResources, listsWithoutResources, setLists]);

  return (
    <SimpleGrid cols={smallScreen ? 1 : 2} spacing={'0.75rem'}>
      {entries}
    </SimpleGrid>
  );
}
