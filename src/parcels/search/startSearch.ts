import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useStartSearch(tcg: Tcg, query: string) {
  const navigate = useNavigate();
  return useCallback(() => {
    if (query.length === 0) return;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: `/${tcg}/cards`,
      search: (prev) => {
        return { ...prev, query: query } as Required<DlcSearchParams>;
      },
    });
  }, [query, tcg, navigate]);
}
