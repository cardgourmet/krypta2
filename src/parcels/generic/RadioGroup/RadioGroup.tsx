import { VisuallyHidden } from '@mantine/core';
import clsx from 'clsx';
import { createContext, use, useId } from 'react';
import { Typeset } from '../Typeset/Typeset';
import styles from './RadioGroup.module.css';
import type { RadioGroupContextValue, RadioGroupItemProps, RadioGroupProps } from './types';

const RadioGroupContext = createContext<RadioGroupContextValue>({ name: '', required: false });

const Root = ({
  children,
  className,
  label,
  name: _name,
  orientation = 'vertical',
  required = false,
  ...props
}: RadioGroupProps) => {
  const labelId = useId();
  const randomName = useId();
  const name = _name ?? randomName;

  return (
    <RadioGroupContext value={{ name, required }}>
      <div className={styles.base}>
        {label && (
          <Typeset id={labelId} size="sm" weight={500}>
            {label}
            {required && (
              <span aria-hidden style={{ color: 'var(--cgm-color-complementary)', marginLeft: '0.125rem' }}>
                *
              </span>
            )}
          </Typeset>
        )}

        <div
          aria-labelledby={label ? labelId : undefined}
          aria-orientation={orientation}
          className={clsx(styles.group, className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </div>
    </RadioGroupContext>
  );
};

export const RadioGroupItem = ({ children, className, hint, ...props }: RadioGroupItemProps) => {
  const { name } = use(RadioGroupContext);

  return (
    <label className={clsx(styles.item, className)} {...props}>
      <VisuallyHidden>
        <input className={styles.input} name={name} type="radio" />
      </VisuallyHidden>

      <div className={styles.indicator}></div>

      <div>
        <Typeset block size="sm" weight={500}>
          {children}
        </Typeset>

        {hint && (
          <Typeset block size="sm" variant="tertiary">
            {hint}
          </Typeset>
        )}
      </div>
    </label>
  );
};

RadioGroupItem.displayName = 'RadioGroup.Item';

export const RadioGroup = Object.assign(Root, {
  displayName: 'RadioGroup',
  Item: RadioGroupItem,
});
