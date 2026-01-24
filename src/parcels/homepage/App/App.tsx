import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { Footer } from '@/parcels/homepage/Footer/Footer.tsx';
import Navbar from '@/parcels/homepage/Navbar/Navbar.tsx';
import Sidebar from '@/parcels/homepage/Sidebar/Sidebar.tsx';
import SearchCacheProvider from '@/parcels/search/SearchCacheProvider.tsx';
import SearchHistoryProvider from '@/parcels/search/SearchHistoryProvider.tsx';
import styles from './App.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchCacheProvider>
      <SearchHistoryProvider>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Navbar setSidebarOpen={setSidebarOpen} />

        <div className={styles.mainContent}>
          <Outlet />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </SearchHistoryProvider>
    </SearchCacheProvider>
  );
}

export default App;
