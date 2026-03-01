import {Group, MultiSelect, type MultiSelectProps} from '@mantine/core';
import {IconCheck, IconChevronDown} from '@tabler/icons-react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import styles from './GourmetMultiSelect.module.css';

export function GourmetMultiSelect(props: MultiSelectProps) {
  return (
    <MultiSelect
      {...props}
      classNames={{ root: styles.multiSelect, pill: styles.multiSelectPill }}
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
