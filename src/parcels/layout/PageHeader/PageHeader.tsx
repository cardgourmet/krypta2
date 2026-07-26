import { IconPlus, IconSlash, IconSortDescending } from '@tabler/icons-react';
import { Button } from '@/parcels/generic/Button/Button';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Logo } from '@/parcels/Logo';
import styles from './PageHeader.module.css';

export const PageHeader = () => {
  return (
    <header className={styles.base}>
      <div className={styles.breadcrumbs}>
        <Logo height={24} width={24} />
        <IconSlash size={16} />
        Profil
        <IconSlash size={16} />
        Deine Listen
      </div>

      <div className={styles.titleContainer}>
        <Typeset asChild className={styles.title} variant="primary" weight={650}>
          <h1>Deine Listen</h1>
        </Typeset>

        <Button leadingIcon={<IconPlus />} size="sm">
          Neue Liste
        </Button>
      </div>

      <div className={styles.controlsContainer} style={{ paddingBlock: '0.5rem' }}>
        <Button leadingIcon={<IconSortDescending />} size="sm" variant="tertiary">
          Name
        </Button>
      </div>
    </header>
  );
};
