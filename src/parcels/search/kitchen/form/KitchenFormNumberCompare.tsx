import { Group, NumberInput, Stack } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import styles from '@/parcels/search/kitchen/styled/mantineStyles.module.css';
import { StyledSelect } from '@/parcels/search/kitchen/styled/StyledSelect.tsx';

type NumberCompareProps = KitchenFormProps & {};

export function KitchenFormNumberCompare({ k }: NumberCompareProps) {
  const { t } = useTranslation('cuisine', { keyPrefix: 'numberCompare' });
  const form = useContext(SearchKitchenContext) as UseFormReturnType<unknown>;

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
