import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import type { Ref } from 'react';
import styles from './GourmetPasswordInput.module.css';

export function GourmetPasswordInput({
  ref,
  validated,
  ...props
}: PasswordInputProps & { validated?: boolean; ref?: Ref<HTMLInputElement> | undefined }) {
  return (
    <PasswordInput
      {...props}
      classNames={{ root: styles.textInput, error: styles.error }}
      ref={ref}
      data-validated={validated}
    />
  );
}
