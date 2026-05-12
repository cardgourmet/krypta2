import { Slot, Slottable } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { decorateSlottable } from '@/parcels/composition/decorateSlottable';
import { maybe } from '@/utils/maybe';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

export const Button = ({
  asChild,
  children,
  className,
  destructive = false,
  disabled = false,
  leadingIcon,
  size = 'md',
  trailingIcon,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={clsx(styles.base, destructive && styles.isDestructive, className)}
      data-cgm-size={size}
      data-cgm-variant={variant}
      disabled={disabled}
      {...maybe('type', 'button' as const, !asChild)}
      {...props}
    >
      {leadingIcon && (
        <span aria-hidden className={styles.iconContainer}>
          {leadingIcon}
        </span>
      )}

      {children && (
        <Slottable>
          {decorateSlottable(asChild, children, (children) => (
            <span className={styles.content}>{children}</span>
          ))}
        </Slottable>
      )}

      {trailingIcon && (
        <span aria-hidden className={styles.iconContainer}>
          {trailingIcon}
        </span>
      )}
    </Component>
  );
};
