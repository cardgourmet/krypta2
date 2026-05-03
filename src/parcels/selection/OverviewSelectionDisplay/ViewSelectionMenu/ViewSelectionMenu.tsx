import {Menu} from '@mantine/core';
import type {Dispatch, PropsWithChildren, SetStateAction} from 'react';
import {ViewSelectionPages} from '@/parcels/selection/OverviewSelectionDisplay/ViewSelectionMenu/ViewSelectionPages/ViewSelectionPages.tsx';
import styles from './ViewSelectionMenu.module.css';

export function ViewSelectionMenu({
  menuOpened,
  setMenuOpened,
  dropdownRef,
  children,
}: {
  menuOpened: boolean;
  setMenuOpened: Dispatch<SetStateAction<boolean>>;
  dropdownRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
} & PropsWithChildren) {
  return (
    <Menu
      shadow="md"
      width={'min(42rem, 95dvw)'}
      position={'top'}
      opened={menuOpened}
      transitionProps={{ transition: 'fade-up', duration: 50 }}
      floatingStrategy={'fixed'}
    >
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown className={styles.menuDropdown} ref={dropdownRef}>
        <ViewSelectionPages setMenuOpened={setMenuOpened} />
      </Menu.Dropdown>
    </Menu>
  );
}
