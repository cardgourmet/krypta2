import {Drawer, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@tanstack/react-router';
import {useEffect, useRef} from 'react';
import {MobileSidebar} from '@/parcels/homepage/Sidebar/MobileSidebar.tsx';
import {Logo} from '@/parcels/Logo.tsx';
import {DLCIcon} from '@/parcels/tcg/dlc/Icon.tsx';
import {MTGIcon} from '@/parcels/tcg/mtg/Icon.tsx';
import {PCGIcon} from '@/parcels/tcg/pcg/Icon.tsx';
import {useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const tcg = useTcgByLocation();
  const smallScreen = useMediaQuery('(max-width: 800px)');

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((sidebarRef.current?.offsetLeft ?? -1) < 0) return;
      if (sidebarOpen && !sidebarRef.current?.contains(event.target as Element)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  return (
    <>
      <Drawer
        position={'left'}
        classNames={{
          content: styles.mobileSidebar,
        }}
        size="100%"
        opened={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        withCloseButton={false}
      >
        <MobileSidebar close={() => setSidebarOpen(false)} />
      </Drawer>

      {!smallScreen && (
        <nav className={styles.sidebar}>
          <Group classNames={{ root: styles.sidebarLogo }} justify={'center'} align={'center'} w={'100%'}>
            <Link to="/">
              <Logo height={42} width={42} style={{ color: 'var(--gourmet-neutral-9)' }} />
            </Link>
          </Group>

          <div>
            <Link
              to="/$tcg"
              params={{ tcg: 'mtg' }}
              className={`${styles.sidebarButton}`}
              data-state={tcg === 'mtg' ? 'enabled' : ''}
            >
              <MTGIcon height={24} width={24} />
            </Link>
            <Link
              to="/$tcg"
              params={{ tcg: 'pcg' }}
              className={styles.sidebarButton}
              data-state={tcg === 'pcg' ? 'enabled' : ''}
            >
              <PCGIcon height={24} width={24} />
            </Link>
            <Link
              to="/$tcg"
              params={{ tcg: 'dlc' }}
              className={styles.sidebarButton}
              data-state={tcg === 'dlc' ? 'enabled' : ''}
            >
              <DLCIcon height={24} width={24} />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
