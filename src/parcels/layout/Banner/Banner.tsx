import { clsx } from 'clsx';
import styles from './Banner.module.css';
import type { BannerProps } from './types';

export const Banner = ({ children, className, ...props }: BannerProps) => {
  return (
    <div className={clsx(styles.base, className)} data-cgm-banner {...props}>
      {children}
    </div>
  );
};
