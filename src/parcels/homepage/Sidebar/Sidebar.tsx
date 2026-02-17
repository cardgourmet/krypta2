import {Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconX} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useEffect, useRef} from 'react';
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
  const smallScreen = useMediaQuery('(max-width: 720px)');

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
      <nav className={`${styles.mobileSidebar} ${sidebarOpen ? styles.shown : ''}`} ref={sidebarRef}>
        <div className={styles.mobileSidebarTop}>
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className={styles.mobileSidebarBottom}>
          <Link
            to="/$tcg"
            params={{ tcg: 'mtg' }}
            className={`${styles.mobileSidebarLink} ${tcg === 'mtg' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <MTGIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
            <p>Magic: The Gathering</p>
          </Link>
          <Link
            to="/$tcg"
            params={{ tcg: 'pcg' }}
            className={`${styles.mobileSidebarLink} ${tcg === 'pcg' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <PCGIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
            <p>Pokémon Card Game</p>
          </Link>
          <Link
            to="/$tcg"
            params={{ tcg: 'dlc' }}
            className={`${styles.mobileSidebarLink} ${tcg === 'dlc' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <DLCIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
            <p>Disney Lorcana</p>
          </Link>
        </div>
      </nav>

      {!smallScreen && (
        <nav className={styles.sidebar}>
          <Group classNames={{ root: styles.sidebarLogo }} justify={'center'} align={'center'} w={'100%'}>
            <Link to="/">
              <Logo height={42} width={42} style={{ color: 'var(--gourmet-blue-1)' }} />
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
