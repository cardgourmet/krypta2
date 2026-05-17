import { MultiSelect } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { useId } from 'react';
import { Typeset } from '../Typeset/Typeset';
import styles from './TagSelect.module.css';
import type { TagSelectProps } from './types';

export const TagSelect = ({
  'aria-describedby': ariaDescribedBy,
  checkIconPosition = 'right',
  className,
  hint,
  id: _id,
  label,
  ...props
}: TagSelectProps) => {
  const hintId = useId();
  const randomId = useId();
  const id = _id ?? randomId;

  return (
    <div className={styles.base}>
      {label && (
        <Typeset asChild size="sm" weight={500}>
          <label htmlFor={id}>
            {label}
            {props.required && (
              <span aria-hidden style={{ color: 'var(--cgm-color-complementary)', marginLeft: '0.125rem' }}>
                *
              </span>
            )}
          </label>
        </Typeset>
      )}

      <MultiSelect
        aria-describedby={[!!hint && hintId, ariaDescribedBy].filter(Boolean).join(' ')}
        checkIconPosition={checkIconPosition}
        className={clsx(styles.box, className)}
        classNames={{
          dropdown: styles.dropdown,
          input: styles.input,
          inputField: styles.inputField,
          pill: styles.tag,
        }}
        comboboxProps={{
          offset: 4,
          position: 'bottom',
          withArrow: false,
          withinPortal: false,
        }}
        rightSection={<IconChevronDown className={styles.chevron} height={16} width={16} />}
        withScrollArea
        {...props}
      />

      {hint && (
        <Typeset id={hintId} size="sm" variant="tertiary">
          {hint}
        </Typeset>
      )}
    </div>
  );
};
