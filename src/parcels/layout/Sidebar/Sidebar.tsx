import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import type { Extend, Structure } from '@/parcels/composition/extend';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { WorkMenuButton } from '@/parcels/homepage/Sidebar/WorkMenu/WorkMenuButton';
import { Logo } from '@/parcels/Logo';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore';
import { TcgSidebarItem } from '@/parcels/tcg/TcgSidebarItem';
import styles from './Sidebar.module.css';

export const Sidebar = ({ className }: Extend<Structure>) => {
  const workMeta = useOverviewWorkStore((state) => state.data?.meta);

  return (
    <nav className={clsx(styles.base, className)}>
      <div className={styles.logoContainer}>
        <Link className={styles.logoLink} title="Start" to="/">
          <Logo height={40} width={40} />
        </Link>
      </div>

      {!!workMeta?.rawElements.length && (
        <div className={styles.contextContainer}>
          <WorkMenuButton />
        </div>
      )}

      <div className={styles.tcgsContainer}>
        <TcgSidebarItem tcg="mtg" />
        <TcgSidebarItem tcg="pcg" />
        <TcgSidebarItem tcg="dlc" />
      </div>

      <div className={styles.brandContainer}>
        <div className={styles.brand}>
          <span style={{ display: 'none', letterSpacing: '0.1em' }}>Cardgourmet</span>{' '}
          <Badge color="purple">Beta</Badge>
        </div>
      </div>
    </nav>
  );
};
