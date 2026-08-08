import { Center, Drawer, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconZoomScan } from '@tabler/icons-react';
import { useState } from 'react';
import styles from '@/parcels/homepage/Sidebar/Sidebar.module.css';
import { WorkMenu } from '@/parcels/homepage/Sidebar/WorkMenu/WorkMenu.tsx';
import { useOverviewWorkMenuStore } from '@/parcels/selection/useOverviewWorkStore.ts';

export function WorkMenuButton() {
  const smallScreen = useMediaQuery('(max-width: 800px)');

  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);
  const openWorkMenu = useOverviewWorkMenuStore((state) => state.setMenuOpened);

  const [workDrawerOpen, setWorkDrawerOpen] = useState(false);

  return (
    <>
      <Drawer
        position={'left'}
        size="100%"
        opened={workDrawerOpen}
        onClose={() => setWorkDrawerOpen(false)}
        withCloseButton={true}
      >
        <WorkMenu mobile onSwitch={() => setWorkDrawerOpen(false)} />
      </Drawer>

      <UnstyledButton
        className={styles.workButton}
        onClick={() => (smallScreen ? setWorkDrawerOpen(true) : openWorkMenu(!workMenuOpen))}
        data-work={smallScreen ? workDrawerOpen : workMenuOpen}
      >
        <Center>
          <IconZoomScan color={'var(--gourmet-neutral-1'} />
        </Center>
      </UnstyledButton>
    </>
  );
}
