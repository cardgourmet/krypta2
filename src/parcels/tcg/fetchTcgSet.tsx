import { fetchDlcSet } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgSet } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgSet } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export async function fetchTcgSet(tcg: Tcg, setId: string) {
  return tcg === 'mtg' ? await fetchMtgSet(setId) : tcg === 'dlc' ? await fetchDlcSet(setId) : await fetchPcgSet(setId);
}
