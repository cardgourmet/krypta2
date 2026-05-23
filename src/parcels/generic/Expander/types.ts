import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type ExpanderProps = Extend<
  StructureWithChildren,
  {
    defaultValue?: boolean;
    expanded?: boolean;
    renderLabel?: (isExpanded: boolean) => ReactNode;
  }
>;
