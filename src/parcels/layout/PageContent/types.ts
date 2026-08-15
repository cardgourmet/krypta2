import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type PageContentProps = Extend<
  StructureWithChildren,
  {
    headerSlot?: ReactNode;
    fullWidth?: boolean;
  }
>;
