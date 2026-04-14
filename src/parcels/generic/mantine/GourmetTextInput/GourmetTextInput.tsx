import {TextInput, type TextInputProps} from '@mantine/core';
import styles from './GourmetTextInput.module.css';

export function GourmetTextInput(props: TextInputProps) {
  return <TextInput {...props} classNames={{ root: styles.textInput, error: styles.error }} />;
}
