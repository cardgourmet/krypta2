import { clsx } from 'clsx';
import styles from './PageContent.module.css';
import type { PageContentProps } from './types';

export const PageContent = ({ children, className, fullWidth = false, headerSlot, ...props }: PageContentProps) => {
  return (
    <div className={clsx(styles.base, fullWidth && styles.isFullWidth, className)} {...props}>
      {headerSlot}

      <div className={styles.paddingContainer}>
        <div className={styles.maxWidthContainer}>{children}</div>
      </div>
    </div>
  );
};
