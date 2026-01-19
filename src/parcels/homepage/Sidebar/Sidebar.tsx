import { useMediaQuery } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { Logo } from '@/parcels/Logo.tsx';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import { useTcg } from '@/parcels/tcg/useTcg.ts';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const tcg = useTcg();
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
            to="/mtg"
            className={`${styles.mobileSidebarLink} ${tcg === 'mtg' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <MTGIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Magic: The Gathering</p>
          </Link>
          <Link
            to="/pcg"
            className={`${styles.mobileSidebarLink} ${tcg === 'pcg' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <PCGIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Pokémon Card Game</p>
          </Link>
          <Link
            to="/dlc"
            className={`${styles.mobileSidebarLink} ${tcg === 'dlc' ? styles.active : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <DLCIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Disney Lorcana</p>
          </Link>
        </div>
      </nav>

      {!smallScreen && (
        <nav className={styles.sidebar}>
          <Link to="/" className={styles.sidebarLogo}>
            <Logo height={30} width={30} style={{ color: '#b6c2cf' }} />
          </Link>

          <div>
            <Link to="/mtg" className={`${styles.sidebarButton}`} data-state={tcg === 'mtg' ? 'enabled' : ''}>
              <MTGIcon height={24} width={24} />
            </Link>
            <Link to="/pcg" className={styles.sidebarButton} data-state={tcg === 'pcg' ? 'enabled' : ''}>
              <PCGIcon height={24} width={24} />
            </Link>
            <Link to="/dlc" className={styles.sidebarButton} data-state={tcg === 'dlc' ? 'enabled' : ''}>
              <DLCIcon height={24} width={24} />
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
