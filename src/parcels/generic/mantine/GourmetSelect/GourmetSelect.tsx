import { Group, Select, type SelectProps } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './GourmetSelect.module.css';

export function GourmetSelect(props: SelectProps) {
  return (
    <Select
      {...props}
      classNames={{ root: styles.select }}
      renderOption={({ option, checked }) => {
        return (
          <Group justify={'space-between'} w={'100%'}>
            <GourmetText cgmc={checked ? 'neutral-9' : 'neutral-7'} cgmff={'ui'} fw={checked ? '500' : ''}>
              {option.label}
            </GourmetText>
            {checked && <IconCheck size={20} />}
          </Group>
        );
      }}
      rightSection={<IconChevronDown size={18} />}
    />
  );
}
