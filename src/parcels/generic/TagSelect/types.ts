import type { MultiSelect } from '@mantine/core';
import type { ReactNode } from 'react';
import type { Extend } from '@/parcels/composition/extend';

export type TagSelectProps = Omit<
  Extend<typeof MultiSelect, { hint?: ReactNode; label?: ReactNode }>,
  'classNames' | 'comboboxProps' | 'labelProps' | 'rightSection' | 'withScrollArea'
>;
