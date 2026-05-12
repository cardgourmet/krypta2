import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';
import type { Accent } from '@/styles/accents';

export type ButtonProps = Composable<
  'button',
  {
    accent?: Accent;
    className?: string;
    disabled?: boolean;
    leadingIcon?: ReactNode;
    size?: 'sm' | 'md';
    trailingIcon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
  }
>;
