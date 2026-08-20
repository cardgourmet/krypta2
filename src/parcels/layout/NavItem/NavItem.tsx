import { Slot, Slottable } from '@radix-ui/react-slot';
import { IconChevronDown } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { decorateSlottable } from '@/parcels/composition/decorateSlottable';
import { Expander } from '@/parcels/generic/Expander/Expander';
import styles from './NavItem.module.css';
import type { NavItemProps } from './types';

export const NavItem = ({
  asChild,
  children,
  className,
  hasDropdown = false,
  icon,
  subitems,
  ...props
}: NavItemProps) => {
  const [isExpanded, setExpanded] = useState(false);

  const Component = asChild ? Slot : 'a';

  if (subitems) {
    return (
      <>
        <button
          className={clsx(styles.base, className)}
          {...(props as object)}
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          {icon && <div className={styles.iconContainer}>{icon}</div>}

          <span style={{ lineHeight: 1.25 }}>{children}</span>

          <div className={styles.iconContainer} style={{ marginLeft: 'auto' }}>
            <IconChevronDown className={clsx(isExpanded && styles.flip)} />
          </div>
        </button>

        <Expander className={styles.nestedContent} expanded={isExpanded}>
          {subitems}
        </Expander>
      </>
    );
  }

  return (
    <Component className={clsx(styles.base, className)} {...props}>
      {icon && <div className={styles.iconContainer}>{icon}</div>}

      {children && (
        <Slottable>
          {decorateSlottable(asChild, children, (children) => (
            <span style={{ lineHeight: 1.25 }}>{children}</span>
          ))}
        </Slottable>
      )}

      {hasDropdown && (
        <div className={styles.iconContainer} style={{ marginLeft: 'auto' }}>
          <IconChevronDown />
        </div>
      )}
    </Component>
  );
};
