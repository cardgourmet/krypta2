import type { CSSProperties } from 'react';
import type { Composable } from '@/parcels/composition/extend';

export type TypesetProps = Composable<
  'span',
  {
    block?: boolean;
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    style?: CSSProperties;
    variant?: 'primary' | 'secondary' | 'tertiary';
    weight?: number;
  }
>;
