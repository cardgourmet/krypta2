import { Group, NumberInput, Stack } from '@mantine/core';
import { StyledSelect } from '@/parcels/search/advanced/styled/StyledSelect.tsx';
import styles from './mantineStyles.module.css';

export type NumberCompareOperator = '>=' | '>' | '<' | '<=' | '=';
type NumberCompareProps = {
  operator: NumberCompareOperator;
  onOperatorChange: (value: NumberCompareOperator) => void;
  value: number | string;
  onValueChange: (value: number | string) => void;
};

export function StyledNumberCompare({ operator, onOperatorChange, value, onValueChange }: NumberCompareProps) {
  return (
    <Stack>
      <Group>
        <StyledSelect
          data={[
            { value: '=', label: 'gleich' },
            { value: '<', label: 'kleiner als' },
            { value: '<=', label: 'kleiner oder gleich' },
            { value: '>', label: 'größer als' },
            { value: '>=', label: 'größer oder gleich' },
          ]}
          value={operator}
          onChange={(v) => {
            onOperatorChange(v as NumberCompareOperator);
          }}
          allowDeselect={false}
          withCheckIcon={false}
          style={{ width: '12rem' }}
        />
        <NumberInput
          classNames={{ input: styles.numberInputInput }}
          allowNegative={false}
          value={value}
          onChange={(value) => {
            onValueChange(value);
          }}
        />
      </Group>
    </Stack>
  );
}
