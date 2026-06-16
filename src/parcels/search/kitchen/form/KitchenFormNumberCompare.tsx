import { Group, NumberInput, Stack } from '@mantine/core';
import { useContext } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import { SearchKitchenContext2 } from '@/parcels/search/kitchen/overview/SearchKitchenOverview.tsx';
import styles from '@/parcels/search/kitchen/styled/mantineStyles.module.css';
import { StyledSelect } from '@/parcels/search/kitchen/styled/StyledSelect.tsx';

type NumberCompareValue = {
  value: number | string;
  operator: string;
};

export function KitchenFormNumberCompare({ k }: KitchenFormProps<NumberCompareValue>) {
  const { t } = useTranslation('kitchen', { keyPrefix: 'numberCompare' });
  const form2 = useContext(SearchKitchenContext2);

  return (
    <Stack>
      <Group>
        <Controller
          control={form2?.control}
          render={(f) => {
            return (
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
                {...f.field}
              />
            );
          }}
          name={`${k}.operator`}
        />
        <Controller
          control={form2?.control}
          render={(f) => {
            return <NumberInput classNames={{ input: styles.numberInputInput }} allowNegative={false} {...f.field} />;
          }}
          name={`${k}.value`}
        />
      </Group>
    </Stack>
  );
}
