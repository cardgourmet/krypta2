import { createTcgWorkStore } from '@/parcels/selection/createTcgWorkStore.tsx';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';

export const useOverviewWorkStore = createTcgWorkStore<TcgSearchDataCard, { query: string }>({
  shouldResetData: (meta0, meta1) => {
    return meta0.other.query !== meta1.other.query;
  },
  selectionLimit: 60,
});
