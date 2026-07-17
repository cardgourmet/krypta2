import { usePrevious } from '@mantine/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand/react';
import { groupBy } from '@/parcels/groupBy.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';

export const CONTEXT_LIST_MAIN = 'main';
export const CONTEXT_LIST_NAV = 'nav';

type ActiveListsState = {
  activeListsByContext: Record<string, UserListWithResources[]>;
  actions: ActiveListsStateActions;
};

type ActiveListsStateActions = {
  setLists: (context: string, lists: UserListWithResources[]) => void;
  setResources: (
    context: string,
    rawLists: UserListWithResources[],
    res: UserListResource[],
    sync?: boolean,
  ) => UserListWithResources[];
  addResources: (
    context: string,
    rawLists: UserListWithResources[],
    res: UserListResource[],
    sync?: boolean,
  ) => UserListWithResources[];
  removeResources: (ressourceIds: string[], listIds?: string[]) => UserListWithResources[];

  removeLists: (listIds: string[]) => void;
  addLists: (lists: UserListWithResources[]) => void;
  updateLists: (list: UserListWithResources[]) => void;
};

/**
 * The difference between "active" lists and normal user lists here is that "active" lists
 * are lists that have their list resources array filled with elements that match the current context.
 * The normal user lists are just an array of all lists the user has, but without any resources in them to conserve memory space.
 *
 * For example: While searching through the card overview we put all resources that are part of any list into the active lists.
 */
export const useActiveListsState = create<ActiveListsState>((set, get) => ({
  activeListsByContext: {},
  actions: {
    setLists: (context, lists) => {
      const current = get().activeListsByContext;
      const newData = {
        ...current,
      };
      newData[context] = lists;

      // also update other contexts with new size and updatedAt
      const otherContexts = Object.keys(current).filter((c) => c !== context);
      for (const otherContext of otherContexts) {
        const contextData = current[otherContext];
        newData[otherContext] = applySizeChange(contextData, lists);
      }

      set({
        activeListsByContext: newData,
      });
    },
    removeLists: (listIds) => {
      const newData = { ...get().activeListsByContext };
      for (const context of Object.keys(newData)) {
        newData.context = newData[context].filter((i) => !listIds.includes(i.list.id));
      }

      set({
        activeListsByContext: newData,
      });
    },
    addLists: (lists: UserListWithResources[]) => {
      const current = get().activeListsByContext;

      const newData: Record<string, UserListWithResources[]> = {};
      for (const context of Object.keys(current)) {
        const currentListIds = new Set(current[context].map((i) => i.list.id) ?? []);
        const toAppend = lists.filter((l) => !currentListIds.has(l.list.id));

        newData[context] = [...current[context], ...toAppend];
      }

      set({
        activeListsByContext: newData,
      });
    },
    updateLists: (lists: UserListWithResources[]) => {
      const current = get().activeListsByContext;

      const updateListIds = new Set(lists.map((l) => l.list.id));
      const newData: Record<string, UserListWithResources[]> = {};
      for (const context of Object.keys(current)) {
        const currentContextData = current[context];
        const newContextData: UserListWithResources[] = [];

        for (const currentList of currentContextData) {
          if (!updateListIds.has(currentList.list.id)) {
            newContextData.push(currentList);
            continue;
          }

          const updatedList = lists.find((l) => l.list.id === currentList.list.id);
          if (!updatedList) {
            newContextData.push(currentList);
            continue;
          }

          newContextData.push({
            ...currentList,
            list: updatedList.list,
          });
        }
        newData[context] = newContextData;
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

      return get().activeListsByContext[context];
    },
    addResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => {
      const allContexts = new Set([...Object.keys(get().activeListsByContext), context]);
      const targetContexts = sync ? allContexts : new Set([context]);

      const current = get().activeListsByContext;
      const newData = {
        ...current,
      };
      for (const targetContext of targetContexts) {
        const currentContextData = get().activeListsByContext[targetContext];
        if (!currentContextData) {
          get().actions.setResources(targetContext, rawLists, res);
          continue;
        }

        newData[context] = combineResources(currentContextData, res, true);
      }
      set({
        activeListsByContext: newData,
      });
      if (!sync) {
        // this will trigger a size sync between all lists
        get().actions.setLists(context, newData[context]);
      }

      return get().activeListsByContext[context];
    },
    removeResources: (ressourceIds: string[], listIds?: string[]) => {
      const current = get().activeListsByContext;

      const newData = {
        ...current,
      };
      for (const context of Object.keys(current)) {
        newData[context] = removeResourcesByIds(current[context], listIds, ressourceIds);
      }
      set({
        activeListsByContext: newData,
      });

      return Object.values(get().activeListsByContext)[0];
    },
  },
}));

export function useActiveLists(context?: string, resources?: UserListResource[]) {
  const { lists: userLists, setLists } = useUserLists();
  context = context ?? CONTEXT_LIST_MAIN;

  const allActiveLists = useActiveListsState((s) => s.activeListsByContext[context]) ?? [];
  const { setResources, addResources, removeResources, addLists, removeLists, updateLists } = useActiveListsState(
    (s) => s.actions,
  );

  const setResourcesContext = useCallback(
    (res: UserListResource[], sync?: boolean) => {
      setResources(context, userLists, res, sync);
    },
    [context, userLists, setResources],
  );
  const addResourcesContext = useCallback(
    (res: UserListResource[], sync?: boolean) => {
      const updatedLists = addResources(context, userLists, res, sync);
      const withoutResources = updatedLists.map((l) => ({ ...l, resources: null }));

      // apply updates to `setLists` (to update size and updatedAt)
      setLists(withoutResources);
    },
    [addResources, context, userLists, setLists],
  );
  const removeResourcesContext = useCallback(
    (resourceIds: string[], listIds?: string[]) => {
      const updatedLists = removeResources(resourceIds, listIds);
      const withoutResources = updatedLists.map((l) => ({ ...l, resources: null }));

      // apply updates to `setLists` (to update size and updatedAt)
      setLists(withoutResources);
    },
    [removeResources, setLists],
  );
  const addListsContext = useCallback(
    (lists: UserListWithResources[]) => {
      addLists(lists);

      const currentListIds = new Set(userLists.map((i) => i.list.id) ?? []);
      const toAppend = lists.filter((l) => !currentListIds.has(l.list.id));
      const newLists = [...userLists, ...toAppend];
      setLists(newLists);
    },
    [addLists, setLists, userLists],
  );
  const removeListsContext = useCallback(
    (listIds: string[]) => {
      removeLists(listIds);

      const newLists = userLists.filter((l) => !listIds.includes(l.list.id));
      setLists(newLists);
    },
    [removeLists, setLists, userLists],
  );
  const updateListsContext = useCallback(
    (lists: UserListWithResources[]) => {
      updateLists(lists);

      const updatedListIds = new Set(lists.map((i) => i.list.id));
      const newLists: UserListWithResources[] = [];
      userLists.forEach((userList) => {
        if (!updatedListIds.has(userList.list.id)) {
          newLists.push(userList);
          return;
        }

        const updatedList = lists.find((l) => l.list.id === userList.list.id);
        if (!updatedList) {
          newLists.push(userList);
          return;
        }
        newLists.push({ list: updatedList.list, resources: userList.resources, size: userList.size });
      });
      setLists(newLists);
    },
    [setLists, updateLists, userLists],
  );

  const previousResources = usePrevious(resources);
  useEffect(() => {
    if (resources === undefined) return;
    if (previousResources?.length === resources.length) return;

    setResourcesContext(resources);
  }, [setResourcesContext, resources, previousResources]);

  return {
    activeLists: allActiveLists,
    setResources: setResourcesContext,
    addResources: addResourcesContext,
    removeResources: removeResourcesContext,
    addLists: addListsContext,
    removeLists: removeListsContext,
    updateLists: updateListsContext,
  };
}

export function useActiveListsResource(context: string, resourceId?: string) {
  const { activeLists } = useActiveLists(context);
  const existsInLists = useMemo(() => {
    return activeLists.filter((list) => {
      if (!resourceId) return false;
      if (!list.resources) return false;

      return Object.values(list.resources)?.some((l) => l.find((res) => res.listResource.resourceId === resourceId));
    });
  }, [activeLists, resourceId]);

  return { activeLists, existsInLists };
}

function applySizeChange(
  prevLists: UserListWithResources[],
  updatedLists: UserListWithResources[],
): UserListWithResources[] {
  const newContextData: UserListWithResources[] = [];
  for (const updatedList of updatedLists) {
    const listData = prevLists.find((l) => l.list.id === updatedList.list.id);
    if (!listData) continue;

    const newListData = {
      ...listData,
      list: {
        ...listData.list,
        updatedAt: updatedList.list.updatedAt,
      },
      size: updatedList.size,
    };
    newContextData.push(newListData);
  }

  return newContextData;
}

function removeResourcesByIds(
  lists: UserListWithResources[],
  targetListIds: string[] | undefined,
  resourceIds: string[],
): UserListWithResources[] {
  const targetListsSet = targetListIds ? new Set(targetListIds) : undefined;

  const newActiveLists = [];
  for (const list of lists) {
    if (!list?.resources) {
      newActiveLists.push(list);
      continue;
    }
    if (targetListsSet && !targetListsSet.has(list.list.id)) {
      newActiveLists.push(list);
      continue;
    }

    const keys = Object.keys(list.resources);
    if (!keys) {
      newActiveLists.push(list);
      continue;
    }

    let removedCount = 0;
    const newResources: Record<string, ResolvedUserListResource[]> = {};
    keys.forEach((key) => {
      newResources[key] = list.resources![key].filter((r) => !resourceIds.includes(r.listResource.resourceId));

      const removed = list.resources![key].length - newResources[key].length;
      removedCount += removed;
    });
    if (removedCount === 0) {
      newActiveLists.push(list);
      continue;
    }

    const newActiveList: UserListWithResources = {
      list: {
        ...list.list,
        updatedAt: removedCount > 0 ? new Date().toISOString() : list.list.updatedAt,
      },
      resources: newResources,
      size: (list.size ?? 0) - removedCount,
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
      activeLists.push({ ...list });
      continue;
    }

    let addedCount = 0;
    let allListResources = listResources;
    if (append) {
      const allValues = Object.values(list.resources ?? []);
      const existingIds = new Set(allValues.flatMap((r) => r.map((r2) => r2.listResource.resourceId)));
      const toAppend = listResources.filter((r) => !existingIds.has(r.listResource.resourceId));

      addedCount = toAppend.length;
      const val = allValues.flat();
      allListResources = [...val, ...toAppend];
    }

    const tcgListResources = groupBy(allListResources, (r) => r.listResource.resourceType as string);
    const listWithResources: UserListWithResources = {
      list: {
        ...list.list,
        updatedAt: addedCount > 0 ? new Date().toISOString() : list.list.updatedAt,
      },
      size: (list.size ?? 0) + addedCount,
      resources: tcgListResources,
    };
    activeLists.push(listWithResources);
  }

  return activeLists;
}
