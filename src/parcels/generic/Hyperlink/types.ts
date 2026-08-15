import type { ReactNode } from 'react';
import type { Composable } from '@/parcels/composition/extend';
import type { Accent } from '@/styles/accents';

export type HyperlinkProps = Composable<
  'a',
  {
    accent?: Accent;
    className?: string;
    initialUnderline?: boolean;
    leadingIcon?: ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    trailingIcon?: ReactNode;
  }
>;
