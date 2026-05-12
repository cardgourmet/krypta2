import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';

export type ButtonProps = Composable<
  'button',
  {
    className?: string;
    destructive?: boolean;
    disabled?: boolean;
    leadingIcon?: ReactNode;
    size?: 'sm' | 'md';
    trailingIcon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
  }
>;
