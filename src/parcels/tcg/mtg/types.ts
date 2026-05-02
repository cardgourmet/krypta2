import type {CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings,} from '@/parcels/overview/cards/types.ts';
import type {DisplayMode, SortDirection} from '@/parcels/tcg/types.ts';

export const mtgSortBys = [
  'name',
  'released',
  'set',
  'rarity',
  'cmc',
  'power',
  'toughness',
  'defense',
  'loyalty',
  'color',
  'usd',
  'tix',
  'eur',
  'edhrec',
] as const;
export type MtgSortBy = (typeof mtgSortBys)[number];

export const mtgUniqueBys = ['cards', 'prints', 'faces', 'printfaces'];
export type MtgUniqueBy = (typeof mtgUniqueBys)[number];

export const mtgSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as MtgUniqueBy,
  sortBy: 'name' as MtgSortBy,
};

export type MtgSearchParams = CardSearchParams & {
  uniqueBy?: MtgUniqueBy;
  sortBy?: MtgSortBy;
};

export type MtgSearchQuerySettings = CardSearchQuerySettings<MtgSearchParams>;
export type MtgSearchDisplaySettings = CardSearchDisplaySettings<MtgSearchParams>;
