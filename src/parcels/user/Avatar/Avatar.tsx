import { clsx } from 'clsx';
import { maybe } from '@/utils/maybe';
import styles from './Avatar.module.css';
import type { AvatarProps } from './types';

export const Avatar = ({ alt, className, size, src, style, ...props }: AvatarProps) => {
  return (
    <figure
      className={clsx(styles.base, className)}
      style={{ ...style, ...maybe('height', `${size}rem`, typeof size !== 'undefined') }}
      {...props}
    >
      <img alt={alt} className={styles.image} src={src} />
    </figure>
  );
};
