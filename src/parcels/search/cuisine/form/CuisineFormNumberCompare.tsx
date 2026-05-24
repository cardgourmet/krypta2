import { Group, NumberInput, Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import type { CuisineFormProps } from '@/parcels/search/cuisine/form/types.ts';
import { SearchCuisineContext } from '@/parcels/search/cuisine/overview/SearchCuisineOverview.tsx';
import styles from '@/parcels/search/cuisine/styled/mantineStyles.module.css';
import { StyledSelect } from '@/parcels/search/cuisine/styled/StyledSelect.tsx';

type NumberCompareProps = CuisineFormProps & {};

export function CuisineFormNumberCompare({ k }: NumberCompareProps) {
  const { t } = useTranslation('cuisine', { keyPrefix: 'numberCompare' });
  const form = useContext(SearchCuisineContext) as UseFormReturnType<unknown>;

  return (
    <Stack>
      <Group>
        <StyledSelect
          data={[
            { value: '=', label: t('=') },
            { value: '<', label: t('<') },
            { value: '<=', label: t('<=') },
            { value: '>', label: t('>') },
            { value: '>=', label: t('>=') },
          ]}
          allowDeselect={false}
          withCheckIcon={false}
          style={{ width: '12rem' }}
          key={form.key(`${k}.operator`)}
          {...form?.getInputProps(`${k}.operator`)}
        />
        <NumberInput
          classNames={{ input: styles.numberInputInput }}
          allowNegative={false}
          key={form.key(`${k}.value`)}
          {...form?.getInputProps(`${k}.value`)}
        />
      </Group>
    </Stack>
  );
}
