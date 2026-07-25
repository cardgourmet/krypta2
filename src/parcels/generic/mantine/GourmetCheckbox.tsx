import { Checkbox, type CheckboxProps } from '@mantine/core';
import styles from './GourmetCheckbox.module.css';

export function GourmetCheckbox(props: CheckboxProps) {
  return <Checkbox color={'var(--gourmet-blue-1)'} className={styles.checkbox} {...props} />;
}
