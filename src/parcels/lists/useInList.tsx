import { useCallback } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import type { DataAuthUser } from '@/parcels/auth/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';

type UserWithLimits = (DataAuthUser & { limits: object }) | undefined;
const defaultLimits = {
  lists: 10,
  list_resources_per_list: 100,
  list_resources_total: 1000,
  reports_pending: 10,
};
type UserLimits = Record<keyof typeof defaultLimits, number>;

export function useUserLimits(user?: DataAuthUser) {
  return ((user as UserWithLimits)?.limits ?? defaultLimits) as UserLimits;
}

export function useCheckListLimits() {
  const { user } = useAuth();
  const { lists } = useUserLists();
  const limits = useUserLimits(user);

  return useCallback(
    (list: UserListWithResources, amount: number) => {
      if (list.size === null || list.size === undefined) return false;
      if (list.size + amount > limits.list_resources_per_list) return false;

      const allowedLists = lists.filter((l) => l.size !== undefined && list.size !== null);
      if (allowedLists.length === 0) return false;
      let sum = amount;
      allowedLists.forEach((l) => {
        sum += l.size!;
      });
      return sum <= limits.list_resources_total;
    },
    [limits, lists],
  );
}
