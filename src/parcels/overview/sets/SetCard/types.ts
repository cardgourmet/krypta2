import type { Extend, Structure } from '@/parcels/composition/extend';
import type { TcgDataSet } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';

export type SetCardProps = Extend<Structure, { set: TcgDataSet; tcg: Tcg }>;
