import { Checkbox, type CheckboxProps } from '@mantine/core';
import styles from './mantineStyles.module.css';

export function FilterComponentCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      classNames={{
        root: styles.checkboxRoot,
        input: styles.checkboxInput,
        label: styles.checkboxLabel,
      }}
      {...props}
    />
  );
}
