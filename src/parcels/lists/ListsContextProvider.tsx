import {createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {fetchLists} from '@/parcels/lists/api.ts';
import type {UserListWithResources} from '@/parcels/lists/types.ts';

export function ListsContextProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [lists, setLists] = useState<UserListWithResources[]>([]);

  useEffect(() => {
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

  const listsData = useMemo(() => {
    return {
      lists: lists,
    } as ListsData;
  }, [lists]);
  return <ListsContext.Provider value={listsData}>{children}</ListsContext.Provider>;
}

export type ListsData = {
  lists: UserListWithResources[];
};

export const ListsContext = createContext<ListsData | null>(null);

export function useUserLists(): ListsData {
  return useContext(ListsContext) as ListsData;
}
