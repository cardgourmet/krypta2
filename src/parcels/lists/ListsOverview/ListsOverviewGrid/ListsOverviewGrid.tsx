import { SimpleGrid, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { USER_LIMIT_LISTS } from '@/parcels/auth/api.ts';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { NewGridListRenderer } from '@/parcels/lists/ListsOverview/ListRenderer/NewGridListRenderer.tsx';
import { GridEntryCreateList } from '@/parcels/lists/ListsOverview/ListsOverviewGrid/GridEntryCreateList.tsx';
import { WarningBanner } from '@/parcels/lists/ListsOverview/ListsOverviewGrid/WarningBanner.tsx';
import type { UserList, UserListWithResources } from '@/parcels/lists/types.ts';

export function ListsOverviewGrid({
  isLoading,
  isPreviewsLoading,
  listsWithoutResources,
  listsWithResources,
  onCreate,
}: {
  isLoading: boolean;
  isPreviewsLoading: boolean;
  listsWithoutResources: UserListWithResources[];
  listsWithResources: UserListWithResources[];
  onCreate: (list: UserList) => void;
}) {
  const smallScreen = useMediaQuery('(max-width: 830px)');
  const { updateLists, removeLists } = useActiveLists();

  const { user } = useAuth();
  const listLimitUsage = listsWithResources.length;
  const listLimitMax = (user?.limits[USER_LIMIT_LISTS] ?? 0) + 1;

  const newEntries = useMemo(() => {
    return listsWithoutResources.map((list) => {
      const withResources = listsWithResources.find((l) => l.list.id === list.list.id);

      return (
        <NewGridListRenderer
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

  // TODO: show loading ghosts

  return (
    <Stack>
      <SimpleGrid cols={smallScreen ? 1 : 2} spacing={'0.75rem'}>
        {newEntries}

        {listLimitUsage < listLimitMax && <GridEntryCreateList onSuccess={onCreate} />}
      </SimpleGrid>
      {listLimitUsage >= listLimitMax && <WarningBanner usage={listLimitUsage} max={listLimitMax} />}
    </Stack>
  );
}
