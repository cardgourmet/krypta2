import { MtgSetIcon } from '@/parcels/tcg/mtg/details/MtgPrintMetaRenderer/MtgPrintMetaRenderer.tsx';
import { PcgSetIcon } from '@/parcels/tcg/pcg/details/PcgSetIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgSetIcon({ tcg, setCode }: { tcg: Tcg; setCode: string }) {
  return (
    <>
      {tcg === 'mtg' && <MtgSetIcon setCode={setCode} />}
      {tcg === 'pcg' && <PcgSetIcon setCode={setCode} />}
    </>
  );
}
