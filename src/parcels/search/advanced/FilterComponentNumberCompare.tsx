import { Group, NumberInput, Stack } from '@mantine/core';
import { FilterComponentDropdown } from '@/parcels/search/advanced/FilterComponentDropdown.tsx';
import styles from './mantineStyles.module.css';

export function FilterComponentNumberCompare() {
  return (
    <Stack>
      <Group>
        <FilterComponentDropdown
          data={['gleich', 'kleiner als', 'kleiner oder gleich', 'größer als', 'größer oder gleich']}
          defaultValue={'gleich'}
          allowDeselect={false}
          withCheckIcon={false}
          style={{ width: '12rem' }}
        />
        <NumberInput classNames={{ input: styles.numberInputInput }} allowNegative={false} />
      </Group>
    </Stack>
  );
}
