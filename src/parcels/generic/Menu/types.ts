import type { ReactNode } from 'react';
import type { Composable, Extend } from '@/parcels/composition/extend';

export type MenuProps = Extend<'div', { fullTriggerWidth?: boolean }>;

export type MenuDropdownItemProps = Composable<
  'div',
  {
    icon?: ReactNode;
  }
>;

export type MenuDropdownRadioItemProps = {
  children?: ReactNode;
  value: string;
};

export type MenuDropdownSeparator = {};
