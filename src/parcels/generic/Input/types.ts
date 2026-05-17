import type { ReactNode } from 'react';
import type { Extend } from '@/parcels/composition/extend';

export type InputProps = Extend<
  'input',
  {
    errorMessage?: string;
    hint?: ReactNode;
    label?: ReactNode;
  }
>;
