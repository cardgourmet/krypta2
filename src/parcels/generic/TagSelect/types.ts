import type { MultiSelect } from '@mantine/core';
import type { ReactNode } from 'react';
import type { Extend } from '@/parcels/composition/extend';
import type { SelectOptionProps } from '../SelectOption/types';

export type TagSelectProps = Omit<
  Extend<
    typeof MultiSelect,
    {
      hint?: ReactNode;
      label?: ReactNode;
      optionDecorations?: Record<
        string,
        Pick<SelectOptionProps, 'description' | 'icon' | 'supportingText'> | undefined
      >;
    }
  >,
  'classNames' | 'comboboxProps' | 'labelProps' | 'renderOption' | 'rightSection' | 'withScrollArea'
>;
