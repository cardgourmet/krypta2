import type { Dispatch, PropsWithChildren, ReactElement, Ref, SetStateAction } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { MoreActionsMenu } from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.tsx';
import { useListActionItems } from '@/parcels/lists/ListActionItems/useListActionItems.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';

type ListDetailsActionMenuProps = {
  owner: DataUser;
  tcg: Tcg;
  listContext: UserListWithResources;
  resource?: TcgDataCard;
  resourceId?: string;
  rawResourceId: string;
  menuOpened?: boolean;
  setMenuOpened?: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
  onAddedToList?: (res: UserListResource) => void;
  onRemovedFromList?: (listId: string, resourceId?: string) => void;
  type: 'card' | 'user_search';
} & { ref?: Ref<HTMLDivElement> };

export function ListDetailsActionMenu({
  owner,
  tcg,
  listContext,
  resource,
  resourceId,
  rawResourceId,
  menuOpened,
  setMenuOpened,
  target,
  onAddedToList,
  onRemovedFromList,
  type,
  children,
  ref,
}: PropsWithChildren<ListDetailsActionMenuProps>) {
  const { user } = useAuth();
  const { modal, entries } = useListActionItems({
    tcg,
    resource,
    resourceId,
    rawResourceId,
    onAddedToList: onAddedToList,
    onRemovedFromList: onRemovedFromList,
    type,
    ref,
    listContext: user?.username !== owner?.username ? undefined : listContext,
  });

  return (
    <>
      {modal}

      <MoreActionsMenu target={target} menuOpened={menuOpened} setMenuOpened={setMenuOpened} ref={ref}>
        {user && entries}
        {children}
      </MoreActionsMenu>
    </>
  );
}
