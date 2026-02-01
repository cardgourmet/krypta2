import { useEffect, useState, useTransition } from 'react';
import { fetchDlcQueryExplain } from '@/parcels/tcg/dlc/api.ts';
import { fetchPcgQueryExplain } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useSearchExplanation(tcg: Tcg, query: string): [boolean, string | null] {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, startLoading] = useTransition();
  useEffect(() => {
    if (query.replaceAll(' ', '').length === 0) return;

    const abort = new AbortController();

    startLoading(async () => {
      if (tcg === 'dlc') {
        const res = await fetchDlcQueryExplain(query, abort);
        setExplanation(res.data?.data?.explanation ?? null);
      } else if (tcg === 'pcg') {
        const res = await fetchPcgQueryExplain(query, abort);
        setExplanation(res.data?.data?.explanation ?? null);
      }
    });

    return () => {
      abort.abort();
    };
  }, [tcg, query]);

  return [loading, explanation];
}
