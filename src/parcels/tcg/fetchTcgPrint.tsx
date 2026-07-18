import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { fetchDlcPrint, fetchDlcPrintUser } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgPrint, fetchMtgPrintUser, type MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgPrint, fetchPcgPrintUser } from '@/parcels/tcg/pcg/api.ts';
import type { TcgDataCard, TcgDataCardUser } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export async function fetchTcgPrint(
  tcg: Tcg,
  setCode: string,
  collectorNumber: string,
  userId?: string,
): Promise<GourmetApiResponse<TcgDataCardUser> | null> {
  let findPrint: GourmetApiResponse<TcgDataCard | TcgDataCardUser>;

  if (tcg === 'mtg') {
    if (userId) findPrint = await fetchMtgPrintUser(setCode, collectorNumber);
    else findPrint = await fetchMtgPrint(setCode, collectorNumber);
  } else if (tcg === 'pcg') {
    if (userId) findPrint = await fetchPcgPrintUser(setCode, collectorNumber);
    else findPrint = await fetchPcgPrint(setCode, collectorNumber);
  } else if (tcg === 'dlc') {
    if (userId) findPrint = await fetchDlcPrintUser(setCode, collectorNumber);
    else findPrint = await fetchDlcPrint(setCode, collectorNumber);
  } else {
    return null;
  }

  if (findPrint.error || !findPrint.data) {
    return { error: findPrint.error };
  }
  if (userId) {
    const data = (findPrint as GourmetApiResponse<TcgDataCardUser>).data!;
    return {
      data: data,
      error: findPrint.error,
    };
  }

  const data = (findPrint as GourmetApiResponse<TcgDataCard>).data!;
  return {
    data: {
      card: data as MtgDataCard,
      listResources: null,
    },
    error: findPrint.error,
  };
}
