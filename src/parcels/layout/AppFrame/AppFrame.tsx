import { Footer } from '../Footer/Footer';
import { Navbar } from '../Navbar/Navbar';
import { Sidebar } from '../Sidebar/Sidebar';
import styles from './AppFrame.module.css';
import type { AppFrameProps } from './types';

export const AppFrame = ({ children }: AppFrameProps) => {
  return (
    <div className={styles.base}>
      <Navbar className={styles.mainNavbar} />
      <Sidebar className={styles.sideNavbar} />

      <main className={styles.content}>{children}</main>

      <Footer />
    </div>
  );
};
