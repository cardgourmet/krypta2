import {z} from 'zod';
import type {CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings} from '@/parcels/overview/types.ts';
import {type DisplayMode, displayModes, type SortDirection, sortDirections} from '@/parcels/tcg/types.ts';

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

export const mtgSearchParamsSchema = z.object({
  query: z.string().catch(mtgSearchParamsDefaults.query),
  page: z.number().catch(mtgSearchParamsDefaults.page),
  sortDirection: z.enum(sortDirections).catch(mtgSearchParamsDefaults.sortDirection),
  display: z.enum(displayModes).catch(mtgSearchParamsDefaults.display),
  uniqueBy: z.enum(mtgUniqueBys).catch(mtgSearchParamsDefaults.uniqueBy),
  sortBy: z.enum(mtgSortBys).catch(mtgSearchParamsDefaults.sortBy),
});

export type MtgSearchParams = CardSearchParams & {
  uniqueBy?: MtgUniqueBy;
  sortBy?: MtgSortBy;
};

export type MtgSearchQuerySettings = CardSearchQuerySettings<MtgSearchParams>;
export type MtgSearchDisplaySettings = CardSearchDisplaySettings<MtgSearchParams>;
