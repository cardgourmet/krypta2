import { SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { GridListRenderer } from '@/parcels/lists/ListsOverview/ListRenderer/GridListRenderer.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { ListPreviewCard } from '../../ListPreviewCard/ListPreviewCard';

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
  const { updateLists, removeLists } = useActiveLists();

  const entries = useMemo(() => {
    return listsWithoutResources.map((list) => {
      const withResources = listsWithResources.find((l) => l.list.id === list.list.id);

      return (
        <GridListRenderer
          key={list.list.id}
          listWithResources={withResources ?? list}
          isLoading={isLoading || isPreviewsLoading}
          onUpdate={(list) => {
            updateLists([{ list: list }]);
          }}
          onDelete={(id) => {
            const list = listsWithoutResources.find((l) => l.list.id === id);
            if (!list) return;

            removeLists([list.list.id]);
          }}
        />
      );
    });
  }, [isLoading, isPreviewsLoading, listsWithResources, listsWithoutResources, removeLists, updateLists]);

  return (
    <>
      <SimpleGrid cols={2} spacing="1rem">
        {listsWithoutResources.map((list) => (
          <ListPreviewCard key={list.list.id} {...list} />
        ))}
      </SimpleGrid>

      <SimpleGrid cols={smallScreen ? 1 : 2} spacing={'0.75rem'}>
        {entries}
      </SimpleGrid>
    </>
  );
}
