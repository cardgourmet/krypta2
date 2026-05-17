import clsx from 'clsx';
import { useId } from 'react';
import { Typeset } from '../Typeset/Typeset';
import styles from './Input.module.css';
import type { InputProps } from './types';

export const Input = ({
  'aria-describedby': ariaDescribedBy,
  className,
  errorMessage,
  hint,
  id: _id,
  label,
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
        <input
          aria-describedby={[!!errorMessage && errorId, !!hint && hintId, ariaDescribedBy].filter(Boolean).join(' ')}
          aria-invalid={!!errorMessage}
          className={styles.input}
          id={id}
          {...props}
        />
      </div>

      {errorMessage && (
        <Typeset className={styles.errorMessage} id={errorId} size="sm">
          {errorMessage}
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
