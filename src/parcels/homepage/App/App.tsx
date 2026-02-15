import {NavigationProgress, nprogress} from '@mantine/nprogress';
import {Outlet, useRouter} from '@tanstack/react-router';
import {useState} from 'react';
import {Footer} from '@/parcels/homepage/Footer/Footer.tsx';
import Navbar from '@/parcels/homepage/Navbar/Navbar.tsx';
import Sidebar from '@/parcels/homepage/Sidebar/Sidebar.tsx';
import SearchCacheProvider from '@/parcels/search/bar/SearchCacheProvider/SearchCacheProvider.tsx';
import SearchHistoryProvider from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
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

  return (
    <TcgProvider>
      <SearchCacheProvider>
        <SearchHistoryProvider>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <Navbar setSidebarOpen={setSidebarOpen} />
          <NavigationProgress />

          <div className={styles.mainContent}>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
          <div className={styles.footer}>
            <Footer />
          </div>
        </SearchHistoryProvider>
      </SearchCacheProvider>
    </TcgProvider>
  );
}

export default App;
