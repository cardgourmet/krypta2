import type { SVGProps } from 'react';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgIcon({
  tcg,
  size,
  ...props
}: { tcg: Tcg; size?: number } & Omit<SVGProps<SVGSVGElement>, 'viewBox'>) {
  return (
    <>
      {tcg === 'mtg' && <MTGIcon height={size} width={size} {...props} />}
      {tcg === 'pcg' && <PCGIcon height={size} width={size} {...props} />}
      {tcg === 'dlc' && <DLCIcon height={size} width={size} {...props} />}
    </>
  );
}
