import { Slot, Slottable } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { decorateSlottable } from '@/parcels/composition/decorateSlottable';
import type { ComponentIdentity } from '@/parcels/composition/withPropsApplied';
import { maybe } from '@/utils/maybe';
import styles from './Button.module.css';
import type { ButtonProps } from './types';

export const Button = ({
  asChild,
  children,
  className,
  disabled = false,
  leadingIcon,
  size = 'md',
  trailingIcon,
  variant = 'primary',
  accent = variant === 'primary' ? 'brand' : 'neutral',
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={clsx(styles.base, className)}
      data-cgm-accent={accent}
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

export type ButtonIdentity = ComponentIdentity<ButtonProps, 'button'>;
Button.identity = undefined! as ButtonIdentity;
