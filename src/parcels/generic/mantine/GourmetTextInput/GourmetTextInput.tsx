import {TextInput, type TextInputProps} from '@mantine/core';
import type {Ref} from 'react';
import styles from './GourmetTextInput.module.css';

export function GourmetTextInput({ ref, ...props }: TextInputProps & { ref: Ref<HTMLInputElement> | undefined }) {
  return <TextInput {...props} classNames={{ root: styles.textInput, error: styles.error }} ref={ref} />;
}
