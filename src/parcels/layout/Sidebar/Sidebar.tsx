import { IconZoomScan } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { use } from 'react';
import type { Extend, Structure } from '@/parcels/composition/extend';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Logo } from '@/parcels/Logo';
import { useIsOnOverview } from '@/parcels/overview/cards/CardOverview/useIsOnOverview';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore';
import { SidecarContext } from '@/parcels/sidecar/Sidecar.context';
import { TcgSidebarItem } from '@/parcels/tcg/TcgSidebarItem';
import styles from './Sidebar.module.css';

export const Sidebar = ({ className }: Extend<Structure>) => {
  const isOnOverview = useIsOnOverview();
  const sidecar = use(SidecarContext);
  const workMeta = useOverviewWorkStore((state) => state.data?.meta);

  return (
    <nav className={clsx(styles.base, className)}>
      <div className={styles.logoContainer}>
        <Link className={styles.logoLink} title="Start" to="/">
          <Logo height={40} width={40} />
        </Link>
      </div>

      <div className={styles.tcgsContainer}>
        <TcgSidebarItem tcg="mtg" />
        <TcgSidebarItem tcg="pcg" />
        <TcgSidebarItem tcg="dlc" />
      </div>

      {!isOnOverview && (workMeta?.rawElements.length ?? 0) > 0 && (
        <div className={styles.contextContainer}>
          <ActionButton
            accent="complementary"
            className={styles.sidecarButton}
            onClick={() => sidecar.setActive(!sidecar.isActive)}
            variant={sidecar.isActive ? 'primary' : 'secondary'}
          >
            <IconZoomScan />
          </ActionButton>
        </div>
      )}

      <div className={styles.brandContainer}>
        <div className={styles.brand}>
          <span style={{ display: 'none', letterSpacing: '0.1em' }}>Cardgourmet</span>{' '}
          <Badge color="purple">Beta</Badge>
        </div>
      </div>
    </nav>
  );
};
