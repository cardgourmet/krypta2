import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { groupBy } from '@/parcels/groupBy.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';

export function ActiveListsContextProvider({
  children,
  activeLists,
}: PropsWithChildren & { activeLists: UserListWithResources[] }) {
  const data = useMemo(() => {
    return {
      activeLists: activeLists,
    } as ActiveListsData;
  }, [activeLists]);

  return <ActiveListsContext.Provider value={data}>{children}</ActiveListsContext.Provider>;
}

export type ActiveListsData = {
  activeLists: UserListWithResources[];
};

export const ActiveListsContext = createContext<ActiveListsData | null>(null);

export function useActiveUserLists(): ActiveListsData {
  return useContext(ActiveListsContext) as ActiveListsData;
}

export function useActiveUserListResources() {
  const { lists } = useUserLists();
  const [activeLists, setActiveLists] = useState<UserListWithResources[]>([]);

  useEffect(() => {
    // check if lists have matching ids (i.e. if nothing has changed)
    if (lists.length === activeLists.length) {
      const listIds = new Set(lists.map((l) => l.list.id));
      const activeListIds = new Set(activeLists.map((l) => l.list.id));
      const haveSameIds =
        lists.every((l) => activeListIds.has(l.list.id)) && activeLists.every((l) => listIds.has(l.list.id));
      if (haveSameIds) return;
    }

    const newActive: UserListWithResources[] = [];
    for (const list of lists) {
      const currentActive = activeLists.find((l) => l.list.id === list.list.id);
      if (!currentActive) {
        newActive.push(list);
        continue;
      }

      // otherwise merge
      newActive.push({
        ...list,
        resources: currentActive.resources,
      });
    }
    setActiveLists(newActive);
  }, [lists, activeLists]);

  const setResources = useCallback(
    (resources: UserListResource[]) => {
      setActiveLists(combineResources(lists, resources, false));
    },
    [lists],
  );
  const addResources = useCallback(
    (resources: UserListResource[]) => {
      setActiveLists(combineResources(activeLists, resources, true));
    },
    [activeLists],
  );
  const removeResources = useCallback(
    (resourceIds: string[]) => {
      setActiveLists(removeResourcesByIds(activeLists, resourceIds));
    },
    [activeLists],
  );

  return { addResources, removeResources, setResources, activeLists };
}

function removeResourcesByIds(lists: UserListWithResources[], resourceIds: string[]): UserListWithResources[] {
  const newActiveLists = [];
  for (const activeList of lists) {
    if (!activeList?.resources) {
      newActiveLists.push(activeList);
      continue;
    }

    const keys = Object.keys(activeList.resources);
    if (!keys) {
      newActiveLists.push(activeList);
      continue;
    }

    const newResources: Record<string, ResolvedUserListResource[]> = {};
    keys.forEach((key) => {
      newResources[key] = activeList.resources![key].filter((r) => !resourceIds.includes(r.listResource.resourceId));
    });

    const newActiveList: UserListWithResources = {
      ...activeList,
      resources: newResources,
    };
    newActiveLists.push(newActiveList);
  }

  return newActiveLists;
}

function combineResources(lists: UserListWithResources[], resources: UserListResource[], append?: boolean) {
  const groupedByList = groupBy(resources, (r) => r.listId);
  const activeLists = [] as UserListWithResources[];
  for (const list of lists) {
    const listResources = groupedByList[list.list.id]?.map((r) => {
      return {
        listResource: r,
        resourceData: {},
      } as ResolvedUserListResource;
    });
    if (!listResources) {
      activeLists.push(list);
      continue;
    }

    let allListResources = listResources;
    if (append && list.resources) {
      const val = Object.values(list.resources).flat();
      allListResources = [...val, ...allListResources];
    }

    const tcgListResources = groupBy(allListResources, (r) => r.listResource.resourceType as string);
    const listWithResources: UserListWithResources = {
      list: list.list,
      size: list.size,
      resources: tcgListResources,
    };
    activeLists.push(listWithResources);
  }

  return activeLists;
}
