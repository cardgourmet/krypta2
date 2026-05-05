import {Menu} from '@mantine/core';
import {type Dispatch, type PropsWithChildren, type ReactElement, type Ref, type SetStateAction, useState,} from 'react';
import {useListActionItems} from '@/parcels/lists/ListActionItems/UseListActionItems.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './MoreActionsMenu.module.css';

type MoreActionsMenuProps = {
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

export function MoreActionsMenu({
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
}: PropsWithChildren<MoreActionsMenuProps>) {
  const [backupMenuOpened, setBackupMenuOpened] = useState(false);
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

      <Menu
        width={260}
        position="top"
        opened={menuOpened ?? backupMenuOpened}
        onChange={setMenuOpened ?? setBackupMenuOpened}
        withArrow
        classNames={{ dropdown: styles.menuDropdown }}
      >
        <Menu.Target>{target}</Menu.Target>

        <Menu.Dropdown ref={ref}>
          {entries}
          {children}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
