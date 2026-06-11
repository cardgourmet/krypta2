import type { Dispatch, PropsWithChildren, ReactElement, Ref, SetStateAction } from 'react';
import { MoreActionsMenu } from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.tsx';
import { useListActionItems } from '@/parcels/lists/ListActionItems/useListActionItems.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type ListDetailsActionMenuProps = {
  tcg: Tcg;
  listContext: UserListWithResources;
  resourceId?: string;
  rawResourceId: string;
  menuOpened?: boolean;
  setMenuOpened?: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
  type: 'card' | 'user_search';
} & { ref?: Ref<HTMLDivElement> };

export function ListDetailsActionMenu({
  tcg,
  listContext,
  resourceId,
  rawResourceId,
  menuOpened,
  setMenuOpened,
  target,
  onSearchSaved,
  onRemoveFromList,
  type,
  children,
  ref,
}: PropsWithChildren<ListDetailsActionMenuProps>) {
  const { modal, entries } = useListActionItems({
    tcg,
    resourceId,
    rawResourceId,
    onAddedToList: onSearchSaved,
    onRemovedFromList: onRemoveFromList,
    type,
    ref,
    listContext,
  });

  return (
    <>
      {modal}

      <MoreActionsMenu target={target} menuOpened={menuOpened} setMenuOpened={setMenuOpened} ref={ref}>
        {entries}
        {children}
      </MoreActionsMenu>
    </>
  );
}
