import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type InputProps = Extend<
  'input',
  {
    error?: string;
    hint?: ReactNode;
    label?: ReactNode;
    leadingSlot?: ReactNode;
    trailingSlot?: ReactNode;
  }
>;

export type InputIconProps = Extend<StructureWithChildren>;
