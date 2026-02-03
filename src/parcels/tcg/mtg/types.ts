import { z } from 'zod';
import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';
import {
  type DisplayMode,
  displayModes,
  type PageSize,
  pageSizes,
  type SortDirection,
  sortDirections,
} from '@/parcels/tcg/types.ts';

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

export const mtgSearchParamsDefaults = {
  query: '',
  page: 1,
  pageSize: '60' as PageSize,
  sortDirection: 'auto' as SortDirection,
  cardDisplayMode: 'grid' as DisplayMode,
  sortBy: 'name' as MtgSortBy,
};

export const mtgSearchParamsSchema = z.object({
  query: z.string().catch(mtgSearchParamsDefaults.query),
  page: z.number().catch(mtgSearchParamsDefaults.page),
  pageSize: z.enum(pageSizes).catch(mtgSearchParamsDefaults.pageSize),
  sortDirection: z.enum(sortDirections).catch(mtgSearchParamsDefaults.sortDirection),
  cardDisplayMode: z.enum(displayModes).catch(mtgSearchParamsDefaults.cardDisplayMode),
  sortBy: z.enum(mtgSortBys).catch(mtgSearchParamsDefaults.sortBy),
});

export type MtgSearchParams = CardSearchParams & {
  sortBy?: MtgSortBy;
};

export type MtgSearchQuerySettings = CardSearchQuerySettings<MtgSearchParams>;
export type MtgSearchDisplaySettings = CardSearchDisplaySettings<MtgSearchParams>;
