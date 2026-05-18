import { IconCheck } from '@tabler/icons-react';
import clsx from 'clsx';
import { Typeset } from '../Typeset/Typeset';
import styles from './SelectOption.module.css';
import type { SelectOptionProps } from './types';

export const SelectOption = ({
  checked,
  children,
  className,
  description,
  icon,
  supportingText,
  ...props
}: SelectOptionProps) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      {icon && (
        <div aria-hidden className={styles.iconContainer}>
          {icon}
        </div>
      )}

      <div>
        <Typeset block size="sm" weight={500}>
          {children}
          {supportingText && (
            <Typeset style={{ marginLeft: '0.375rem' }} variant="secondary" weight={400}>
              {supportingText}
            </Typeset>
          )}
        </Typeset>

        {description && (
          <Typeset block size="sm" variant="tertiary">
            {description}
          </Typeset>
        )}
      </div>

      {checked && (
        <div aria-hidden className={clsx(styles.checkmark, styles.iconContainer)}>
          <IconCheck />
        </div>
      )}
    </div>
  );
};
