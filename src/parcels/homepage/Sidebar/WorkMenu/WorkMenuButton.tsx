import { Center, UnstyledButton } from '@mantine/core';
import { IconZoomScan } from '@tabler/icons-react';
import styles from '@/parcels/homepage/Sidebar/Sidebar.module.css';
import { useOverviewWorkMenuStore } from '@/parcels/selection/useOverviewWorkStore.ts';

export function WorkMenuButton() {
  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);
  const openWorkMenu = useOverviewWorkMenuStore((state) => state.setMenuOpened);

  return (
    <UnstyledButton className={styles.workButton} onClick={() => openWorkMenu(!workMenuOpen)} data-work={workMenuOpen}>
      <Center>
        <IconZoomScan color={'var(--gourmet-neutral-1'} />
      </Center>
    </UnstyledButton>
  );
}
