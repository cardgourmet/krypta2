import type { Extend, Structure } from '@/parcels/composition/extend';
import type { TcgDataSet } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';

export type SetCardProps = Extend<Structure, { set: TcgDataSet; tcg: Tcg }>;
