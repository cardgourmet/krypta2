import { NavigationProgress, nprogress } from '@mantine/nprogress';
import { Outlet, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Footer } from '@/parcels/homepage/Footer/Footer.tsx';
import Navbar from '@/parcels/homepage/Navbar/Navbar.tsx';
import Sidebar from '@/parcels/homepage/Sidebar/Sidebar.tsx';
import { WorkMenu } from '@/parcels/homepage/Sidebar/WorkMenu/WorkMenu.tsx';
import { useIsOnOverview } from '@/parcels/overview/cards/CardOverview/useIsOnOverview.ts';
import SearchHistoryProvider from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import { useOverviewWorkMenuStore, useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import TcgProvider from '@/parcels/tcg/TcgProvider.tsx';
import styles from './App.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const router = useRouter();
  router.subscribe('onBeforeLoad', ({ fromLocation, pathChanged }) => {
    fromLocation && pathChanged && nprogress.start();
  });
  router.subscribe('onLoad', () => {
    nprogress.complete();
  });

  const workMenuOpen = useOverviewWorkMenuStore((state) => state.menuOpened);
  const workQuerySettings = useOverviewWorkStore((state) => state.data?.meta?.other?.querySettings);
  const isOnOverview = useIsOnOverview();
  const isWorkActive = workQuerySettings !== undefined;

  return (
    <TcgProvider>
      <SearchHistoryProvider>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar setSidebarOpen={setSidebarOpen} />
        <NavigationProgress />

        <div>
          {!isOnOverview && isWorkActive && <WorkMenu />}

          <div className={styles.mainContent}>
            <div className={styles.content} data-work={workMenuOpen}>
              <Outlet />
            </div>
          </div>
          <div className={styles.footer}>
            <Footer />
          </div>
        </div>
      </SearchHistoryProvider>
    </TcgProvider>
  );
}

export default App;
