import type { DisplayMode, SortDirection } from '@/parcels/tcg/types.ts';

export type CardSearchParams = {
  query?: string;
  page?: number;
  sortDirection?: SortDirection;
  display?: DisplayMode;
};

export type CardSearchQuerySettings<T extends CardSearchParams> = Required<Omit<T, 'display'>>;
export type CardSearchDisplaySettings<T extends CardSearchParams> = Required<Pick<T, 'display'>>;
