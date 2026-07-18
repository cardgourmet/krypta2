import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { useActiveListsState } from '@/parcels/lists/ActiveListsState.tsx';
import { fetchLists } from '@/parcels/lists/api.ts';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';

export function ListsContextProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [lists, setLists] = useState<UserListWithResources[]>([]);

  const allActiveLists = useActiveListsState((s) => s.activeListsByContext);
  const { removeLists, addLists } = useActiveListsState((s) => s.actions);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!lists) return;

    const previousLists = Object.values(allActiveLists).flat();

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
  }, [addLists, lists, removeLists]);

  const setListsSorted = useCallback((lists?: UserListWithResources[]) => {
    const sortedLists = lists ?? [];
    sortedLists.sort((a, b) => {
      const dateA = a.list.updatedAt ? new Date(a.list.updatedAt).getTime() : 0;
      const dateB = b.list.updatedAt ? new Date(b.list.updatedAt).getTime() : 0;
      return dateA - dateB;
    });

    setLists(sortedLists);
  }, []);
  const refetchLists = useCallback(() => {
    const id = auth.user?.id;
    if (!id || auth.user?.state !== 'verified') {
      setLists([]);
      return;
    }

    fetchLists(id, undefined, undefined).then((res) => {
      if (res.error) {
        sendErrorNotification(res.error);
        return;
      }

      const lists = res.data?.items ?? [];
      setListsSorted(lists);
    });
  }, [auth.user?.id, auth.user?.state, setListsSorted]);

  useEffect(() => {
    refetchLists();
  }, [refetchLists]);

  const listsData = useMemo(() => {
    return {
      lists: lists,
      setLists: setListsSorted,
      refetchLists,
    } as ListsData;
  }, [lists, refetchLists, setListsSorted]);
  return <ListsContext.Provider value={listsData}>{children}</ListsContext.Provider>;
}

export type ListsData = {
  lists: UserListWithResources[];
  setLists: (lists: UserListWithResources[]) => void;
  refetchLists: () => void;
};

export const ListsContext = createContext<ListsData | null>(null);

export function useUserLists(): ListsData {
  return useContext(ListsContext) as ListsData;
}
