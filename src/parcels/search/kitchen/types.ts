import type { ReactElement } from 'react';

export type CuisineFilterCategory = {
  icon: ReactElement;
  filters: CuisineFilter[];
};
export type CuisineFilter = {
  key: string;
  title: string;
  description?: string;
  filter?: string | string[];
  component: ReactElement;
};
