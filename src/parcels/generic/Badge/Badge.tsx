import { Slot, Slottable } from '@radix-ui/react-slot';
import clsx from 'clsx';
import { decorateSlottable } from '@/parcels/composition/decorateSlottable';
import styles from './Badge.module.css';
import type { BadgeProps } from './types';

export const Badge = ({
  asChild,
  children,
  className,
  color,
  interactive = false,
  leadingIcon,
  shape = 'rectangular',
  size = 'md',
  trailingIcon,
  ...props
}: BadgeProps) => {
  const Component = asChild ? Slot : 'span';

  return (
    <Component
      className={clsx(styles.base, interactive && styles.isInteractive, className)}
      data-cgm-color={color}
      data-cgm-shape={shape}
      data-cgm-size={size}
      {...props}
    >
      {leadingIcon && <span className={styles.iconContainer}>{leadingIcon}</span>}

      <Slottable>
        {decorateSlottable(asChild, children, (children) => (
          <span className={styles.content}>{children}</span>
        ))}
      </Slottable>

      {trailingIcon && <span className={styles.iconContainer}>{trailingIcon}</span>}
    </Component>
  );
};
