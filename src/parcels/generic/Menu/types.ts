import type { ReactNode } from 'react';
import type { Composable, Extend } from '@/parcels/composition/extend';

export type MenuProps = Extend<'div', { fullTriggerWidth?: boolean }>;

export type MenuDropdownItemProps = Composable<
  'div',
  {
    icon?: ReactNode;
    disabled?: boolean;
  }
>;

export type MenuDropdownRadioItemProps = {
  children?: ReactNode;
  icon?: ReactNode;
  value: string;
};

export type MenuDropdownSeparator = {};
