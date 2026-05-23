import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/parcels/composition/extend';

export type RadioGroupContextValue = {
  name: string;
  required: boolean;
};

export type RadioGroupProps = Extend<
  StructureWithChildren,
  { label?: ReactNode; name?: string; orientation?: 'horizontal' | 'vertical'; required?: boolean }
>;

export type RadioGroupItemProps = Extend<StructureWithChildren, { hint?: ReactNode }>;
