import {createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {fetchLists} from '@/parcels/lists/api.ts';
import type {UserListWithResources} from '@/parcels/lists/types.ts';

export function ListsContextProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [lists, setLists] = useState<UserListWithResources[]>([]);

  const refetchLists = useCallback(() => {
    const id = auth.user?.id;
    if (!id) {
      setLists([]);
      return;
    }

    fetchLists(id, undefined, undefined, undefined, 10_000, true).then((res) => {
      if (res.error) {
        console.error('Error while fetching user lists', res.error);
        return;
      }

      setLists(res.data?.items ?? []);
    });
  }, [auth.user?.id]);

  useEffect(() => {
    refetchLists();
  }, [refetchLists]);

  const listsData = useMemo(() => {
    return {
      lists: lists,
      refetchLists,
    } as ListsData;
  }, [lists, refetchLists]);
  return <ListsContext.Provider value={listsData}>{children}</ListsContext.Provider>;
}

export type ListsData = {
  lists: UserListWithResources[];
  refetchLists: () => void;
};

export const ListsContext = createContext<ListsData | null>(null);

export function useUserLists(): ListsData {
  return useContext(ListsContext) as ListsData;
}
