import type { ReactElement } from 'react';

export type KitchenFilterCategory = {
  icon: ReactElement;
  filters: KitchenFilter[];
};
export type KitchenFilter = {
  key: string;
  title: string;
  description?: string;
  filter?: string | string[];
  component: ReactElement;
};
