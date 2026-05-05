import {PasswordInput, type PasswordInputProps} from '@mantine/core';
import styles from './GourmetPasswordInput.module.css';

export function GourmetPasswordInput(props: PasswordInputProps) {
  return <PasswordInput {...props} classNames={{ root: styles.textInput, error: styles.error }} />;
}
