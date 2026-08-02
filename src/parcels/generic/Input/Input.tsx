import clsx from 'clsx';
import { useId } from 'react';
import { Typeset } from '../Typeset/Typeset';
import styles from './Input.module.css';
import type { InputProps } from './types';

export const Input = ({
  'aria-describedby': ariaDescribedBy,
  className,
  error,
  hint,
  id: _id,
  label,
  leadingSlot,
  style,
  ...props
}: InputProps) => {
  const errorId = useId();
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

      <div className={clsx(styles.box, className)} style={style}>
        {leadingSlot}
        <input
          aria-describedby={[!!error && errorId, !!hint && hintId, ariaDescribedBy].filter(Boolean).join(' ')}
          aria-invalid={!!error}
          className={styles.input}
          id={id}
          {...props}
        />
      </div>

      {error && (
        <Typeset className={styles.errorMessage} id={errorId} size="sm">
          {error}
        </Typeset>
      )}

      {hint && (
        <Typeset id={hintId} size="sm" variant="tertiary">
          {hint}
        </Typeset>
      )}
    </div>
  );
};
