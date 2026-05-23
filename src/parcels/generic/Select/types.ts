import type { Select } from '@mantine/core';
import type { ReactNode } from 'react';
import type { Extend } from '@/parcels/composition/extend';
import type { SelectOptionProps } from '../SelectOption/types';

export type SelectProps = Omit<
  Extend<
    typeof Select,
    {
      label?: ReactNode;
      optionDecorations?: Record<
        string,
        Pick<SelectOptionProps, 'description' | 'icon' | 'supportingText'> | undefined
      >;
    }
  >,
  'classNames' | 'comboboxProps' | 'labelProps' | 'renderOption' | 'rightSection' | 'withScrollArea'
>;
