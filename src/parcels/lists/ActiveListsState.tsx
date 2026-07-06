import { useCallback, useMemo } from 'react';
import { create } from 'zustand/react';
import { groupBy } from '@/parcels/groupBy.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { ResolvedUserListResource, UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';

export const CONTEXT_LIST_MAIN = 'main';

type ActiveListsState = {
  activeListsByContext: Record<string, UserListWithResources[]>;
  actions: ActiveListsStateActions;
};

type ActiveListsStateActions = {
  setLists: (context: string, data: UserListWithResources[]) => void;
  setResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => void;
  addResources: (context: string, rawLists: UserListWithResources[], res: UserListResource[], sync?: boolean) => void;
  removeResources: (ressourceIds: string[]) => void;

  removeLists: (listIds: string[]) => void;
  addLists: (lists: UserListWithResources[]) => void;
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
        const currentListIds = new Set(current[context].map((i) => i.list.id) ?? []);
        const toAppend = lists.filter((l) => !currentListIds.has(l.list.id));

        newData[context] = [...current[context], ...toAppend];
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
      const targetContexts = sync ? new Set([...Object.keys(get().activeListsByContext), context]) : new Set([context]);
      console.log('addResources', targetContexts, get().activeListsByContext);

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

      console.log('removedResources', Object.keys(current), newData);

      set({
        activeListsByContext: newData,
      });
    },
  },
}));

export function useActiveLists(context: string) {
  const { lists } = useUserLists();

  const allActiveLists = useActiveListsState((s) => s.activeListsByContext[context]) ?? [];
  const { setResources, addResources, removeResources } = useActiveListsState((s) => s.actions);

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

  return {
    activeLists: allActiveLists,
    setResources: setResourcesContext,
    addResources: addResourcesContext,
    removeResources: removeResourcesContext,
  };
}

export function useActiveListsResource(context: string, resourceId?: string) {
  const { activeLists } = useActiveLists(context);
  const existsInLists = useMemo(() => {
    // console.log('existsInLists (UPDATE)', resourceId, activeLists);
    return activeLists.filter((list) => {
      if (!resourceId) return false;
      if (!list.resources) return false;

      return Object.values(list.resources)?.some((l) => l.find((res) => res.listResource.resourceId === resourceId));
    });
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

    console.log('removeResourcesByIds', resourceIds, activeList.list.id, keys, newResources);

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
