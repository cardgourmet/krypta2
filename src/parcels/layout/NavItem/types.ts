import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';

export type NavItemProps = Composable<
  'a',
  {
    className?: string;
    hasDropdown?: boolean;
    hasExpander?: boolean;
    icon?: ReactNode;
    label: ReactNode;
  }
>;
