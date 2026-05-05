import {createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {fetchLists} from '@/parcels/lists/api.ts';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import {useGourmetNotification} from '@/parcels/notification/useGourmetNotification.ts';

export function ListsContextProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [lists, setLists] = useState<UserListWithResources[]>([]);
  const noti = useGourmetNotification();

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

    fetchLists(id, undefined, undefined, undefined, 10_000, true).then((res) => {
      if (res.error) {
        noti.show('Unknown error', `${res.error}`, 'error');
        return;
      }

      const lists = res.data?.items ?? [];
      setListsSorted(lists);
    });
  }, [auth.user, noti.show, setListsSorted]);

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
