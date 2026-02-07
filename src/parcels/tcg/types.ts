export const sortDirections = ['asc', 'desc', 'auto'] as const;
export type SortDirection = (typeof sortDirections)[number];

export const displayModes = ['grid', 'table'] as const;
export type DisplayMode = (typeof displayModes)[number];

export type TcgCardQuery = {
  mode?: string;
  query?: string;
  pageSize?: number;
  page?: number;
  sortDirection?: 'asc' | 'desc';
  lang?: string;
  displayLanguage?: string;
  flags?: string;
  allowedFilters?: string;
  forbiddenFilters?: string;
  allowedValueTypes?: string;
  retries?: string;
};

export const filterOperatorsRegex = '[=:><]';
export const filterOperators = [':', '>=', '>', '<=', '<', '='] as const;
export type TcgFilterOperator = (typeof filterOperators)[number];
