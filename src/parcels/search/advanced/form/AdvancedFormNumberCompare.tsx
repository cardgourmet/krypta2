import {Group, NumberInput, Stack} from '@mantine/core';
import type {UseFormReturnType} from '@mantine/form';
import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import type {AdvancedFormProps} from '@/parcels/search/advanced/form/types.ts';
import {AdvancedFilterContext} from '@/parcels/search/advanced/overview/AdvancedFiltersOverview.tsx';
import styles from '@/parcels/search/advanced/styled/mantineStyles.module.css';
import {StyledSelect} from '@/parcels/search/advanced/styled/StyledSelect.tsx';

type NumberCompareProps = AdvancedFormProps & {};

export function AdvancedFormNumberCompare({ k }: NumberCompareProps) {
  const { t } = useTranslation('advanced', { keyPrefix: 'numberCompare' });
  const form = useContext(AdvancedFilterContext) as UseFormReturnType<unknown>;

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
