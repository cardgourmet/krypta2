import { nprogress } from '@mantine/nprogress';
import { useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import { use } from 'react';
import { WorkMenu } from '@/parcels/homepage/Sidebar/WorkMenu/WorkMenu';
import { useIsOnOverview } from '@/parcels/overview/cards/CardOverview/useIsOnOverview';
import { CurrentSearchSidecar } from '@/parcels/search/CurrentSearchSidecar/CurrentSearchSidecar';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore';
import { SidecarContext } from '@/parcels/sidecar/Sidecar.context';
import { Footer } from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar';
import styles from './AppFrame.module.css';
import type { AppFrameProps } from './types';

export const AppFrame = ({ children }: AppFrameProps) => {
  const router = useRouter();
  const sidecar = use(SidecarContext);

  router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
    if (fromLocation && pathChanged) nprogress.start();
  });

  router.subscribe('onLoad', () => {
    nprogress.complete();
  });

  const isOnOverview = useIsOnOverview();
  const workQuerySettings = useOverviewWorkStore((state) => state.data?.meta?.other?.querySettings);
  const isWorkActive = workQuerySettings !== undefined;

  return (
    <div className={clsx(styles.base, sidecar.isActive && styles.sidecarInline)}>
      <Navbar className={styles.mainNavbar} />
      <Sidebar className={styles.sideNavbar} />

      {!isOnOverview && isWorkActive && <WorkMenu />}

      <aside className={clsx(styles.sidecarHost)}>
        <div className={clsx(styles.sidecarContainer, sidecar.isActive && styles.isActive)}>
          <CurrentSearchSidecar />
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.transitionPageWrapper}>{children}</div>
      </main>

      <Footer className={styles.footer} />
    </div>
  );
};
