import { nprogress } from '@mantine/nprogress';
import { useRouter } from '@tanstack/react-router';
import { WorkMenu } from '@/parcels/homepage/Sidebar/WorkMenu/WorkMenu';
import { useIsOnOverview } from '@/parcels/overview/cards/CardOverview/useIsOnOverview';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore';
import { Footer } from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar';
import styles from './AppFrame.module.css';
import type { AppFrameProps } from './types';

export const AppFrame = ({ children }: AppFrameProps) => {
  const router = useRouter();

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
    <div className={styles.base}>
      <Navbar className={styles.mainNavbar} />
      <Sidebar className={styles.sideNavbar} />

      {!isOnOverview && isWorkActive && <WorkMenu />}

      <main className={styles.content}>
        <div className={styles.transitionPageWrapper}>{children}</div>
      </main>

      <Footer />
    </div>
  );
};
