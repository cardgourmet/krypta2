import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';
import type { TypesetProps } from '../Typeset/types';

export type KickerProps = Extend<
  StructureWithChildren,
  Pick<TypesetProps, 'size' | 'variant' | 'weight'> & {
    leadingIcon?: ReactNode;
  }
>;
