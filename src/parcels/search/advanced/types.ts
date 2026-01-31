import type { ReactElement } from 'react';

export type AdvancedFilterCategory = {
  icon: ReactElement;
  filters: AdvancedFilter[];
};
export type AdvancedFilter = {
  key: string;
  title: string;
  description?: string;
  filter?: string | string[];
  component: ReactElement;
};
