import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type SelectOptionProps = Extend<
  StructureWithChildren,
  {
    checked: boolean;
    description?: ReactNode;
    icon?: ReactNode;
    supportingText?: ReactNode;
  }
>;
