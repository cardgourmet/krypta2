import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';
import type { PcgCardSortBy } from '@/parcels/tcg/pcg/api.ts';

export type PcgCardSearchParams = CardSearchParams & {
  sortBy?: PcgCardSortBy;
};

export type PcgCardSearchQuerySettings = CardSearchQuerySettings<PcgCardSearchParams>;
export type PcgCardSearchDisplaySettings = CardSearchDisplaySettings<PcgCardSearchParams>;
