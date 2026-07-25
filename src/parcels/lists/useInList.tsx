import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import type { DataAuthUser } from '@/parcels/auth/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';

const defaultLimits = {
  lists: 10,
  list_resources_per_list: 100,
  list_resources_total: 1000,
  reports_pending: 10,
};
type UserLimits = Record<keyof typeof defaultLimits, number>;

export function useUserLimits(user?: DataAuthUser) {
  return useMemo(() => {
    return (user?.limits ?? defaultLimits) as UserLimits;
  }, [user?.limits]);
}

export type LimitUsage = {
  limit: keyof typeof defaultLimits;
  max: number;
  usage: number;
};

export function useCheckUserLimits() {
  const { t } = useTranslation('lists', { keyPrefix: 'limits' });

  const { user } = useAuth();
  const { lists } = useUserLists();
  const limits = useUserLimits(user);

  const generateExceededTooltip = useCallback(
    (limitUsage?: LimitUsage) => {
      if (!limitUsage) return '';

      switch (limitUsage.limit) {
        case 'lists':
          return t('listLimitUsage', { amount: limitUsage.usage, max: limitUsage.max });
        case 'list_resources_total':
          return t('listTotalResourceLimitUsage', { amount: limitUsage.usage, max: limitUsage.max });
        case 'list_resources_per_list':
          return t('listResourceLimitUsage', { amount: limitUsage.usage, max: limitUsage.max });
      }
      return '';
    },
    [t],
  );

  const checkListCreateExceeded = useCallback(
    (amount: number) => {
      if (lists.length + amount > limits.lists + 1) {
        return {
          limit: 'lists',
          max: limits.lists + 1, // +1 because of favorites
          usage: lists.length,
        } as LimitUsage;
      }
      return null;
    },
    [limits.lists, lists],
  );
  const checkListAddExceeded = useCallback(
    (list: UserListWithResources, amount: number) => {
      if ((list.size ?? 0) + amount > limits.list_resources_per_list) {
        return {
          limit: 'list_resources_per_list',
          max: limits.list_resources_per_list,
          usage: list.size ?? 0,
        } as LimitUsage;
      }

      const allowedLists = lists.filter((l) => l.size !== undefined && list.size !== null);
      let sum = 0;
      allowedLists.forEach((l) => {
        sum += l.size!;
      });
      if (sum + amount > limits.list_resources_total) {
        return {
          limit: 'list_resources_total',
          max: limits.list_resources_total,
          usage: sum,
        } as LimitUsage;
      }

      return null;
    },
    [limits.list_resources_total, lists, limits.list_resources_per_list],
  );

  return {
    checkListCreateExceeded,
    checkListAddExceeded,
    generateExceededTooltip,
  };
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
