import {
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@radix-ui/react-dropdown-menu';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { IconCheck } from '@tabler/icons-react';
import { clsx } from 'clsx';
import styles from './Menu.module.css';
import type { MenuDropdownItemProps, MenuDropdownRadioItemProps, MenuProps } from './types';

const Root = ({ children, className, fullTriggerWidth = false, ...props }: MenuProps) => {
  return (
    <div className={clsx(styles.base, className, fullTriggerWidth && styles.isFullTriggerWidth)} {...props}>
      {children}
    </div>
  );
};

export const MenuDropdownItem = ({ asChild, children, icon, ...props }: MenuDropdownItemProps) => {
  const Component = asChild ? Slot : 'div';

  return (
    <DropdownMenuItem asChild className={styles.item}>
      <Component {...props}>
        <div className={styles.decorator}>{icon && <div className={styles.iconContainer}>{icon}</div>}</div>

        <Slottable>{children}</Slottable>
      </Component>
    </DropdownMenuItem>
  );
};

MenuDropdownItem.displayName = 'Menu.DropdownItem';

export const MenuDropdownRadioItem = ({ children, value }: MenuDropdownRadioItemProps) => {
  return (
    <DropdownMenuRadioItem className={styles.item} value={value}>
      <div className={styles.decorator}>
        <DropdownMenuItemIndicator className={styles.iconContainer}>
          <IconCheck style={{ color: 'var(--cgm-color-brand)' }} />
        </DropdownMenuItemIndicator>
      </div>

      <span>{children}</span>
    </DropdownMenuRadioItem>
  );
};

MenuDropdownRadioItem.displayName = 'Menu.DropdownRadioItem';

export const MenuDropdownSeparator = () => {
  return <DropdownMenuSeparator className={styles.separator} />;
};

MenuDropdownSeparator.displayName = 'Menu.DropdownSeparator';

export const Menu = Object.assign(Root, {
  displayName: 'Menu',
  DropdownItem: MenuDropdownItem,
  DropdownRadioItem: MenuDropdownRadioItem,
  DropdownSeparator: MenuDropdownSeparator,
});
