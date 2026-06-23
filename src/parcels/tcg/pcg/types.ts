import type {
  CardSearchDisplaySettings,
  CardSearchParams,
  CardSearchQuerySettings,
} from '@/parcels/overview/cards/types.ts';
import type { DisplayMode, SortDirection } from '@/parcels/tcg/types.ts';

export const pcgSortBys = ['name', 'rarity', 'set', 'type', 'health', 'released'] as const;
export type PcgSortBy = (typeof pcgSortBys)[number];

export const pcgUniqueBys = ['cards', 'prints'];
export type PcgUniqueBy = (typeof pcgUniqueBys)[number];

export const pcgSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as PcgUniqueBy,
  sortBy: 'name' as PcgSortBy,
  random: false,
};

export type PcgSearchParams = CardSearchParams & {
  uniqueBy?: PcgUniqueBy;
  sortBy?: PcgSortBy;
};

export type PcgSearchQuerySettings = CardSearchQuerySettings<PcgSearchParams>;
export type PcgSearchDisplaySettings = CardSearchDisplaySettings<PcgSearchParams>;
