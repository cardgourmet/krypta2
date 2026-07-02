import type { Extend, Structure } from '@/parcels/composition/extend';
import type { AnyPrint } from '../types';

export type BasicCardProps = Extend<
  Structure,
  {
    print: AnyPrint;
  }
>;
