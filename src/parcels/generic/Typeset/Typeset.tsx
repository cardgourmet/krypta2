import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';
import styles from './Typeset.module.css';
import type { TypesetProps } from './types';

export const Typeset = ({
  asChild,
  block = false,
  children,
  className,
  size,
  style,
  variant = 'primary',
  weight,
  ...props
}: TypesetProps) => {
  const Component = asChild ? Slot : 'span';

  return (
    <Component
      className={clsx(styles.base, block && styles.isBlock, className)}
      data-cgm-size={size}
      data-cgm-variant={variant}
      style={{ '--typeset-weight': weight, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
};
