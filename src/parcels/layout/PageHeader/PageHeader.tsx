import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import Breadcrumbs from '@/parcels/homepage/Breadcrumbs/Breadcrumbs';
import styles from './PageHeader.module.css';

export const PageHeader = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <header className={styles.base}>
      <div className={styles.maxWidthContainer}>
        {/* <div className={styles.breadcrumbs}>
          <Logo height={24} width={24} />
          <IconSlash size={16} />
          Profil
          <IconSlash size={16} />
          Deine Listen
        </div> */}
        <Breadcrumbs subpage="" withoutTitle />

        <div className={styles.titleContainer}>
          <Typeset asChild className={styles.title} variant="primary" weight={650}>
            <h1>{pageTitle}</h1>
          </Typeset>
        </div>
      </div>
    </header>
  );
};
