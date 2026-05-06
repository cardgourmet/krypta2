import type {Dispatch, PropsWithChildren, ReactElement, Ref, SetStateAction} from 'react';
import {MoreActionsMenu} from '@/parcels/generic/MoreActionsMenu/MoreActionsMenu.tsx';
import {useListActionItems} from '@/parcels/lists/ListActionItems/useListActionItems.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

type MoreListActionsMenuProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  menuOpened?: boolean;
  setMenuOpened?: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
  type: 'card' | 'user_search';
} & { ref?: Ref<HTMLDivElement> };

export function MoreListActionsMenu({
  tcg,
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
}: PropsWithChildren<MoreListActionsMenuProps>) {
  const { modal, entries } = useListActionItems({
    tcg,
    resourceId,
    rawResourceId,
    onSearchSaved,
    onRemoveFromList,
    type,
    ref,
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
