import { Select, type SelectProps } from '@mantine/core';
import styles from './mantineStyles.module.css';

export function StyledSelect(props: SelectProps) {
  return (
    <Select
      classNames={{
        root: styles.selectRoot,
        input: styles.selectInput,
        option: styles.selectOption,
      }}
      {...props}
    />
  );
}
