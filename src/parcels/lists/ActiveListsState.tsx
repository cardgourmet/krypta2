import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand/react';
import { groupBy } from '@/parcels/groupBy.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

type ActiveListsState = {
  activeListsByContext: Record<string, UserListWithResources[]>;
  actions: ActiveListsStateActions;
};

type ActiveListsStateActions = {
  setLists: (context: string, data: UserListWithResources[]) => void;
  removeLists: (listIds: string[]) => void;
  setResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => void;
  addResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => void;
  removeResources: (ressourceIds: string[]) => void;
  addLists: (lists: UserListWithResources[]) => void;
};

export const useActiveListsState = create<ActiveListsState>((set, get) => ({
  activeListsByContext: {},
  actions: {
    setLists: (context, res) => {
      const current = get().activeListsByContext;
      const newData = {
        ...current,
        [context]: res,
      };

      set({
        activeListsByContext: newData,
      });
    },
    removeLists: (listIds) => {
      const newData = { ...get().activeListsByContext };
      for (const context of Object.keys(newData)) {
        newData.context = newData[context].filter((i) => listIds.includes(i.list.id));
      }

      set({
        activeListsByContext: newData,
      });
    },
    addLists: (lists: UserListWithResources[]) => {
      const current = get().activeListsByContext;

      const newData: Record<string, UserListWithResources[]> = {};
      for (const context of Object.keys(current)) {
        newData[context] = [...current[context], ...lists];
      }

      set({
        activeListsByContext: newData,
      });
    },
    setResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => {
      const newContextData = combineResources(rawLists, res, false);

      const targetContexts = sync ? new Set(Object.keys(get().activeListsByContext) + context) : new Set([context]);
      for (const targetContext of targetContexts) {
        get().actions.setLists(targetContext, newContextData);
      }
    },
    addResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => {
      const targetContexts = sync ? new Set(Object.keys(get().activeListsByContext) + context) : new Set([context]);

      for (const targetContext of targetContexts) {
        const currentContextData = get().activeListsByContext[targetContext];
        if (!currentContextData) {
          get().actions.setResources(targetContext, rawLists, res);
          continue;
        }

        const newContextData = combineResources(currentContextData, res, true);
        get().actions.setLists(targetContext, newContextData);
      }
    },
    removeResources: (ressourceIds: string[]) => {
      const current = get().activeListsByContext;
      const newData: Record<string, UserListWithResources[]> = {};

      for (const context of Object.keys(current)) {
        newData[context] = removeResourcesByIds(current[context], ressourceIds);
      }

      set({
        activeListsByContext: newData,
      });
    },
  },
}));

export function useActiveLists(context: string) {
  const { lists } = useUserLists();
  const previousLists = usePrevious(lists);

  const allActiveLists = useActiveListsState((s) => s.activeListsByContext);
  const { removeLists, addLists, setResources, addResources, removeResources } = useActiveListsState((s) => s.actions);

  const setResourcesContext = useCallback(
    (res: UserListResource[], sync?: boolean) => {
      setResources(context, lists, res, sync);
    },
    [context, lists, setResources],
  );
  const addResourcesContext = useCallback(
    (res: UserListResource[], sync?: boolean) => {
      addResources(context, lists, res, sync);
    },
    [addResources, context, lists],
  );
  const removeResourcesContext = useCallback(
    (resourceIds: string[]) => {
      removeResources(resourceIds);
    },
    [removeResources],
  );

  // effect: when lists gets updated
  useEffect(() => {
    const previousListIds = previousLists?.map((l) => l.list.id) ?? [];
    const previousListIdsSet = new Set(previousListIds);
    const newListIds = lists?.map((l) => l.list.id) ?? [];
    const newListIdsSet = new Set(newListIds);

    const addedListIds = newListIds.filter((id) => !previousListIdsSet.has(id));
    const removedListIds = previousListIds.filter((id) => !newListIdsSet.has(id));
    if (removedListIds.length === 0 && addedListIds.length === 0) {
      // nothing changed
      return;
    }

    if (removedListIds.length > 0) {
      removeLists(removedListIds);
    }
    if (addedListIds.length > 0) {
      const listsToAdd = addedListIds
        .map((listId) => lists.find((l) => l.list.id === listId))
        .filter((l) => l !== undefined);

      addLists(listsToAdd);
    }
  }, [lists, previousLists, removeLists, addLists]);

  return {
    activeLists: allActiveLists[context] ?? [],
    setResources: setResourcesContext,
    addResources: addResourcesContext,
    removeResources: removeResourcesContext,
  };
}

export function useActiveListsRessource(context: string, resourceId?: string) {
  const { activeLists } = useActiveLists(context);
  const existsInLists = useMemo(() => {
    return activeLists
      .filter((list) => {
        if (!resourceId) return false;
        if (!list.resources) return false;

        return Object.values(list.resources)?.some((l) => l.find((res) => res.listResource.resourceId === resourceId));
      })
      .map((l) => l.list.id);
  }, [activeLists, resourceId]);

  return { activeLists, existsInLists };
}

export function removeResourcesByIds(lists: UserListWithResources[], resourceIds: string[]): UserListWithResources[] {
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

export function combineResources(lists: UserListWithResources[], resources: UserListResource[], append?: boolean) {
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
      const allValues = Object.values(list.resources);
      const existingIds = new Set(allValues.flatMap((r) => r.map((r2) => r2.listResource.resourceId)));
      const toAppend = listResources.filter((r) => !existingIds.has(r.listResource.resourceId));

      const val = allValues.flat();
      allListResources = [...val, ...toAppend];
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
