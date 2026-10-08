import { nprogress } from '@mantine/nprogress';
import { useRouter } from '@tanstack/react-router';
import clsx from 'clsx';
import { use } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext';
import { EmailChangedBanner } from '@/parcels/layout/Banner/EmailChangedBanner/EmailChangedBanner';
import { UnverifiedBanner } from '@/parcels/layout/Banner/UnverifiedBanner/UnverifiedBanner';
import { VerifiedBanner } from '@/parcels/layout/Banner/VerifiedBanner/VerifiedBanner';
import { CurrentSearchSidecar } from '@/parcels/search/CurrentSearchSidecar/CurrentSearchSidecar';
import { SidecarContext } from '@/parcels/sidecar/Sidecar.context';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore';
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

  // const isOnOverview = useIsOnOverview();
  // const workQuerySettings = useOverviewWorkStore((state) => state.data?.meta?.other?.querySettings);
  // const isWorkActive = workQuerySettings !== undefined;

  const { user } = useAuth();
  const emailWasChanged = useLocalUserStateStore((state) => state.emailWasChanged);
  const wasVerified = useLocalUserStateStore((state) => state.wasVerified);

  return (
    <div className={clsx(styles.base, sidecar.isActive && styles.sidecarInline)}>
      {emailWasChanged && <EmailChangedBanner />}
      {wasVerified && <VerifiedBanner />}
      {!wasVerified && user?.state === 'unverified' && <UnverifiedBanner user={user} />}

      <Navbar className={styles.mainNavbar} />
      <Sidebar className={styles.sideNavbar} />

      {/* {!isOnOverview && isWorkActive && <WorkMenu />} */}

      <div className={styles.sidecarArea}>
        <div className={clsx(styles.sidecarHost)}>
          <aside className={clsx(styles.sidecarContainer, sidecar.isActive && styles.isActive)}>
            <CurrentSearchSidecar />
          </aside>
        </div>
      </div>

      <main className={styles.content}>
        <div className={styles.transitionPageWrapper}>{children}</div>
      </main>

      <Footer className={styles.footer} />
    </div>
  );
};
