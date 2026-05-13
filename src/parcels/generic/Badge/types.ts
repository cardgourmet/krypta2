import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';

export type BadgeProps = Composable<
  'span',
  {
    className?: string;
    color?: 'red' | 'orange' | 'yellow' | 'lime' | 'green' | 'teal' | 'blue' | 'purple' | 'magenta';
    leadingIcon?: ReactNode;
    shape?: 'pill' | 'rectangular';
    size?: 'sm' | 'md' | 'lg';
    trailingIcon?: ReactNode;
  }
>;
