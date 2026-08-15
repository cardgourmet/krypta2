import { Group, Menu, type MenuItemProps } from '@mantine/core';
import { IconChevronRight, IconList, IconMinus, IconPlus } from '@tabler/icons-react';
import type { ComponentPropsWithRef } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { IconWithOverlayIcon } from '@/parcels/lists/IconWithOverlayIcon/IconWithOverlayIcon.tsx';
import styles from './MenuItemWithListIcon.module.css';

export function MenuItemWithListIcon({
  buttonText,
  action,
  ref,
  className,
  ...others
}: { buttonText: string; action: 'add' | 'remove' } & MenuItemProps & ComponentPropsWithRef<'button'>) {
  return (
    <Menu.Item closeMenuOnClick={false} className={`${styles.menuItem} ${className}`} ref={ref} {...others}>
      <Group justify={'space-between'}>
        <Group gap={'0.5rem'}>
          <IconWithOverlayIcon
            icon={<IconList size={18} />}
            overlayIcon={
              action === 'remove' ? (
                <IconMinus size={14} color={'var(--gourmet-red-01)'} />
              ) : (
                <IconPlus size={14} color={'var(--gourmet-green-1)'} />
              )
            }
          />
          <GourmetText cgmff={'ui'}>{buttonText}</GourmetText>
        </Group>
        <IconChevronRight size={18} />
      </Group>
    </Menu.Item>
  );
}
