import type { Extend, Structure } from '@/parcels/composition/extend';
import type { TcgDataSet } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';

export type SetBannerProps = Extend<Structure, { set: TcgDataSet; tcg: Tcg }>;
