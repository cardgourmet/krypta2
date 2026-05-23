import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';

export type HyperlinkProps = Composable<
  'a',
  {
    className?: string;
    initialUnderline?: boolean;
    leadingIcon?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    trailingIcon?: ReactNode;
  }
>;
