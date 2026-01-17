import { z } from 'zod';
import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';

export const pcgPageSizes = ['60', '48', '36', '24', '12'] as const;
export type PcgPageSize = (typeof pcgPageSizes)[number];

export const pcgSortDirections = ['asc', 'desc', 'auto'] as const;
export type PcgSortDirection = (typeof pcgSortDirections)[number];

export const pcgDisplayModes = ['grid', 'table'] as const;
export type PcgDisplayMode = (typeof pcgDisplayModes)[number];

export const pcgSortBys = ['name', 'rarity', 'set', 'type', 'health', 'released'] as const;
export type PcgSortBy = (typeof pcgSortBys)[number];

export const pcgSearchParamsDefaults = {
  query: '',
  page: 1,
  pageSize: '60' as PcgPageSize,
  sortDirection: 'auto' as PcgSortDirection,
  cardDisplayMode: 'grid' as PcgDisplayMode,
  sortBy: 'name' as PcgSortBy,
};

export const pcgSearchParamsSchema = z.object({
  query: z.string().catch(pcgSearchParamsDefaults.query),
  page: z.number().catch(pcgSearchParamsDefaults.page),
  pageSize: z.enum(pcgPageSizes).catch(pcgSearchParamsDefaults.pageSize),
  sortDirection: z.enum(pcgSortDirections).catch(pcgSearchParamsDefaults.sortDirection),
  cardDisplayMode: z.enum(pcgDisplayModes).catch(pcgSearchParamsDefaults.cardDisplayMode),
  sortBy: z.enum(pcgSortBys).catch(pcgSearchParamsDefaults.sortBy),
});

export type PcgSearchParams = CardSearchParams & {
  sortBy?: PcgSortBy;
};

export type PcgSearchQuerySettings = CardSearchQuerySettings<PcgSearchParams>;
export type PcgSearchDisplaySettings = CardSearchDisplaySettings<PcgSearchParams>;
