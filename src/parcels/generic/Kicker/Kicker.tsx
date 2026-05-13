import clsx from 'clsx';
import { Typeset } from '../Typeset/Typeset';
import styles from './Kicker.module.css';
import type { KickerProps } from './types';

export const Kicker = ({
  children,
  className,
  leadingIcon,
  size = 'sm',
  weight = 600,
  variant = 'tertiary',
  ...props
}: KickerProps) => {
  return (
    <Typeset asChild className={clsx(styles.base, className)} size={size} weight={weight} variant={variant} {...props}>
      <div>
        {leadingIcon && (
          <div aria-hidden className={styles.iconContainer}>
            {leadingIcon}
          </div>
        )}

        <span>{children}</span>
      </div>
    </Typeset>
  );
};
