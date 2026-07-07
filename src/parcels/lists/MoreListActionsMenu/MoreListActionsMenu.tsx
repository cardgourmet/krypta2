import type { MenuProps } from '@mantine/core';
import type { Dispatch, PropsWithChildren, ReactElement, Ref, SetStateAction } from 'react';
import { MoreActionsMenu } from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.tsx';
import { useListActionItems } from '@/parcels/lists/ListActionItems/useListActionItems.tsx';
import type { UserListResource } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type MoreListActionsMenuProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  menuOpened?: boolean;
  setMenuOpened?: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
  onAddedToList?: (res: UserListResource) => void;
  onRemovedFromList?: (listId: string) => void;
  type: 'card' | 'user_search';
  activeListContext?: string;
  menuProps?: MenuProps;
} & { ref?: Ref<HTMLDivElement> };

export function MoreListActionsMenu({
  tcg,
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
  activeListContext,
  menuProps,
}: PropsWithChildren<MoreListActionsMenuProps>) {
  const { modal, entries } = useListActionItems({
    tcg,
    resourceId,
    rawResourceId,
    onAddedToList: onAddedToList,
    onRemovedFromList: onRemovedFromList,
    type,
    ref,
    activeListContext,
  });

  return (
    <>
      {modal}

      <MoreActionsMenu
        target={target}
        menuOpened={menuOpened}
        setMenuOpened={setMenuOpened}
        ref={ref}
        menuProps={menuProps}
      >
        {entries}
        {children}
      </MoreActionsMenu>
    </>
  );
}
