import type { DisplayMode, SortDirection } from '@/parcels/tcg/types.ts';

export type CardSearchParams = {
  query?: string;
  page?: number;
  sortDirection?: SortDirection;
  cardDisplayMode?: DisplayMode;
};

export type CardSearchQuerySettings<T extends CardSearchParams> = Required<Omit<T, 'cardDisplayMode'>>;
export type CardSearchDisplaySettings<T extends CardSearchParams> = Required<Pick<T, 'cardDisplayMode'>>;
