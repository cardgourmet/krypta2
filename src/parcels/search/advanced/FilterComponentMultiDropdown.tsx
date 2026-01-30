import { MultiSelect, type MultiSelectProps } from '@mantine/core';
import styles from './mantineStyles.module.css';

export function FilterComponentMultiDropdown(props: MultiSelectProps) {
  return (
    <MultiSelect
      classNames={{
        root: styles.multiSelectRoot,
        input: styles.multiSelectInput,
        pill: styles.multiSelectPill,
        option: styles.multiSelectOption,
      }}
      {...props}
    />
  );
}
