export type SortDirection = 'auto' | 'asc' | 'desc';
export function isSortDirection(direction: string): direction is SortDirection {
  return direction === 'auto' || direction === 'desc' || direction === 'asc';
}
export const sortDirectionElements: Record<SortDirection, string> = {
  auto: 'Automatisch',
  asc: 'Aufsteigend',
  desc: 'Absteigend',
};
export const sortDirectionDefault: SortDirection = 'auto';

export type CardAmount = '60' | '48' | '36' | '24' | '12';
export function isCardAmount(d: string): d is CardAmount {
  return d === '60' || d === '48' || d === '36' || d === '24' || d === '12';
}
export const cardAmountElements: Record<CardAmount, string> = {
  '60': '60 Karten',
  '48': '48 Karten',
  '36': '36 Karten',
  '24': '24 Karten',
  '12': '12 Karten',
};
export const cardAmountDefault: CardAmount = '60';

export type CardDisplayMode = 'grid' | 'table';
export function isCardDisplayMode(s: string): s is CardDisplayMode {
  return s === 'grid' || s === 'table';
}
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
