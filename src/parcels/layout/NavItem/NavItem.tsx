import { Slot, Slottable } from '@radix-ui/react-slot';
import { IconChevronDown } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { Expander } from '@/parcels/generic/Expander/Expander';
import styles from './NavItem.module.css';
import type { NavItemProps } from './types';

export const NavItem = ({
  asChild,
  children,
  className,
  hasDropdown = false,
  hasExpander = false,
  icon,
  label,
  ...props
}: NavItemProps) => {
  const [isExpanded, setExpanded] = useState(false);

  const Component = asChild ? Slot : 'a';

  if (children && hasExpander) {
    return (
      <>
        <button
          className={clsx(styles.base, className)}
          {...(props as object)}
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          {icon && <div className={styles.iconContainer}>{icon}</div>}

          <span style={{ lineHeight: 1 }}>{label}</span>

          <div className={styles.iconContainer} style={{ marginLeft: 'auto' }}>
            <IconChevronDown />
          </div>
        </button>

        <Expander className={styles.nestedContent} expanded={isExpanded}>
          {children}
        </Expander>
      </>
    );
  }

  return (
    <Component className={clsx(styles.base, className)} {...props}>
      {icon && <div className={styles.iconContainer}>{icon}</div>}
      <span>{label}</span>

      {children && <Slottable>{children}</Slottable>}

      {hasDropdown && (
        <div className={styles.iconContainer} style={{ marginLeft: 'auto' }}>
          <IconChevronDown />
        </div>
      )}
    </Component>
  );
};
