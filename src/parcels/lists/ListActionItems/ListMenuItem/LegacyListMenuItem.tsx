import type { MenuItemProps } from '@mantine/core';
import { type ReactElement, useMemo } from 'react';
import { ListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { OptionalTcgProps } from '@/parcels/tcg/TcgProps.ts';

export type ListMenuItemResourceProps = {
  resourceId: string;
  type?: 'card' | 'user_search';
  raw?: boolean;
  onSuccess?: (res?: UserListResource) => void;
};

export type LegacyListMenuItemProps = {
  resourceIds: string[];
  type: 'card' | 'user_search';
  action: 'add' | 'remove';
  listWithResources: UserListWithResources;

  icon?: ReactElement;
  buttonText?: string;
  raw?: boolean;
  onSuccess?: (res?: UserListResource[]) => void;
} & MenuItemProps &
  OptionalTcgProps;

export function LegacyListMenuItem({
  resourceIds,
  tcg,
  listWithResources,
  type,
  raw,
  disabled,
  ...others
}: LegacyListMenuItemProps) {
  const actionableResources = useMemo(() => {
    return resourceIds.map((res) => ({
      id: res,
      game: tcg,
      resourceType: type,
      isRaw: raw,
    }));
  }, [raw, resourceIds, tcg, type]);

  return <ListMenuItem actionableResources={actionableResources} listWithResources={listWithResources} {...others} />;
}
