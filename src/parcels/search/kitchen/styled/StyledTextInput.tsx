import { TextInput, type TextInputProps } from '@mantine/core';
import styles from './mantineStyles.module.css';

export function StyledTextInput(props: TextInputProps) {
  return (
    <TextInput
      classNames={{
        root: styles.textInputRoot,
        input: styles.textInputInput,
      }}
      {...props}
    />
  );
}
