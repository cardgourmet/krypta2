import type { Extend } from '@/parcels/composition/extend';

export type InputProps = Extend<
  'input',
  {
    errorMessage?: string;
    hint?: string;
    label?: string;
  }
>;
