import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import Navbar from '@/components/home/Navbar/Navbar.tsx';
import SearchHistoryProvider from '@/components/home/SearchHistoryProvider/SearchHistoryProvider.tsx';
import Sidebar from '@/components/home/Sidebar/Sidebar.tsx';
import styles from './App.module.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchHistoryProvider>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </SearchHistoryProvider>
  );
}

export default App;
