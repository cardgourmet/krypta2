import type {CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings} from '@/parcels/overview/types.ts';
import type {DisplayMode, SortDirection} from '@/parcels/tcg/types.ts';

export const dlcSortBys = ['name', 'set', 'ink', 'strength', 'willpower', 'movement', 'released'] as const;
export type DlcSortBy = (typeof dlcSortBys)[number];

export const dlcUniqueBys = ['cards', 'prints'];
export type DlcUniqueBy = (typeof dlcUniqueBys)[number];

export const dlcSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as DlcUniqueBy,
  sortBy: 'name' as DlcSortBy,
};

export type DlcSearchParams = CardSearchParams & {
  uniqueBy?: DlcUniqueBy;
  sortBy?: DlcSortBy;
};

export type DlcSearchQuerySettings = CardSearchQuerySettings<DlcSearchParams>;
export type DlcSearchDisplaySettings = CardSearchDisplaySettings<DlcSearchParams>;
