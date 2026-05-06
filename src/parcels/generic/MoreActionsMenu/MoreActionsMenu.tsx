import { Menu } from '@mantine/core';
import {
  type Dispatch,
  type PropsWithChildren,
  type ReactElement,
  type Ref,
  type SetStateAction,
  useState,
} from 'react';
import styles from './MoreActionsMenu.module.css';

type MoreActionsMenuProps = {
  menuOpened?: boolean;
  setMenuOpened?: Dispatch<SetStateAction<boolean>>;
  target: ReactElement;
} & { ref?: Ref<HTMLDivElement> };

export function MoreActionsMenu({
  menuOpened,
  setMenuOpened,
  target,
  children,
  ref,
}: PropsWithChildren<MoreActionsMenuProps>) {
  const [backupMenuOpened, setBackupMenuOpened] = useState(false);

  return (
    <Menu
      width={260}
      position="top"
      opened={menuOpened ?? backupMenuOpened}
      onChange={setMenuOpened ?? setBackupMenuOpened}
      withArrow
      classNames={{ dropdown: styles.menuDropdown }}
    >
      <Menu.Target>{target}</Menu.Target>

      <Menu.Dropdown ref={ref}>{children}</Menu.Dropdown>
    </Menu>
  );
}
