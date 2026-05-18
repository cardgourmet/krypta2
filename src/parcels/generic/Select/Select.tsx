import { Select as MantineSelect } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useId } from 'react';
import { SelectOption } from '../SelectOption/SelectOption';
import { Typeset } from '../Typeset/Typeset';
import styles from './Select.module.css';
import type { SelectProps } from './types';

export const Select = ({ checkIconPosition = 'right', id: _id, label, optionDecorations, ...props }: SelectProps) => {
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

      <MantineSelect
        checkIconPosition={checkIconPosition}
        className={styles.box}
        classNames={{ dropdown: styles.dropdown, input: styles.input, option: styles.option }}
        comboboxProps={{
          offset: 4,
          position: 'bottom',
          withArrow: false,
          withinPortal: false,
        }}
        id={id}
        renderOption={(item) => {
          const decoration = optionDecorations?.[item.option.value];
          return (
            <SelectOption checked={item.checked ?? false} {...decoration}>
              {item.option.label}
            </SelectOption>
          );
        }}
        rightSection={<IconChevronDown className={styles.chevron} height={16} width={16} />}
        withScrollArea
        {...props}
      />
    </div>
  );
};
