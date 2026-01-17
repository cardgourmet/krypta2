export type SortDirection = 'auto' | 'asc' | 'desc';
export const sortDirectionElements: Record<SortDirection, string> = {
  auto: 'Automatisch',
  asc: 'Aufsteigend',
  desc: 'Absteigend',
};

export type CardAmount = '60' | '48' | '36' | '24' | '12';
export const cardAmountElements: Record<CardAmount, string> = {
  '60': '60 Karten',
  '48': '48 Karten',
  '36': '36 Karten',
  '24': '24 Karten',
  '12': '12 Karten',
};

export type CardDisplayMode = 'grid' | 'table';
export const cardDisplayModeElements: Record<CardDisplayMode, string> = {
  grid: 'Raster',
  table: 'Tabelle',
};
export const cardDisplayModeDefault: CardDisplayMode = 'grid';

export type CardSearchParams = {
  query?: string;
  page?: number;
  pageSize?: CardAmount;
  sortDirection?: SortDirection;
  cardDisplayMode?: CardDisplayMode;
};

export type CardSearchQuerySettings<T extends CardSearchParams> = Required<Omit<T, 'cardDisplayMode'>>;
export type CardSearchDisplaySettings<T extends CardSearchParams> = Required<Pick<T, 'cardDisplayMode'>>;
