import {Menu} from '@mantine/core';
import type {Dispatch, PropsWithChildren, SetStateAction} from 'react';
import {ViewSelectionPages} from '@/parcels/selection/OverviewSelectionDisplay/ViewSelectionMenu/ViewSelectionPages/ViewSelectionPages.tsx';
import styles from './ViewSelectionMenu.module.css';

export function ViewSelectionMenu({
  menuOpened,
  setMenuOpened,
  setDropdown,
  children,
}: {
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  setDropdown: Dispatch<SetStateAction<HTMLDivElement | null>>;
} & PropsWithChildren) {
  return (
    <Menu
      shadow="md"
      width={'min(42rem, 95dvw)'}
      position={'top'}
      opened={menuOpened}
      transitionProps={{ transition: 'fade-up', duration: 150 }}
      floatingStrategy={'fixed'}
    >
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown className={styles.menuDropdown} ref={setDropdown}>
        <ViewSelectionPages setMenuOpened={setMenuOpened} />
      </Menu.Dropdown>
    </Menu>
  );
}
