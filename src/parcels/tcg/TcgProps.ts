import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export type OptionalTcgProps = Partial<TcgProps>;
export type TcgProps = {
  tcg: Tcg;
};
