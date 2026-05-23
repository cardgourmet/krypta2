import clsx from 'clsx';
import styles from './FeaturedIcon.module.css';
import type { FeaturedIconProps } from './types';

export const FeaturedIcon = ({
  children,
  className,
  size = 'md',
  variant = 'primary',
  accent = variant === 'outline' ? 'brand' : 'neutral',
  ...props
}: FeaturedIconProps) => {
  return (
    <span
      aria-hidden
      className={clsx(styles.base, className)}
      data-cgm-accent={accent}
      data-cgm-size={size}
      data-cgm-variant={variant}
      {...props}
    >
      {children}
    </span>
  );
};
