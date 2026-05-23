import { Slot, Slottable } from '@radix-ui/react-slot';
import clsx from 'clsx';
import styles from './Hyperlink.module.css';
import type { HyperlinkProps } from './types';

export const Hyperlink = ({
  asChild,
  children,
  className,
  initialUnderline = false,
  leadingIcon,
  size = 'md',
  trailingIcon,
  ...props
}: HyperlinkProps) => {
  const Component = asChild ? Slot : 'a';

  return (
    <Component
      className={clsx(styles.base, className, initialUnderline && styles.initialUnderline)}
      data-cgm-size={size}
      {...props}
    >
      {leadingIcon && (
        <span aria-hidden className={styles.leadingSlot}>
          {leadingIcon}
        </span>
      )}

      <Slottable>{children}</Slottable>

      {trailingIcon && (
        <span aria-hidden className={styles.trailingSlot}>
          {trailingIcon}
        </span>
      )}
    </Component>
  );
};
