import { UnstyledButton } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { Typeset } from '../Typeset/Typeset';
import styles from './Tag.module.css';
import type { TagProps } from './types';

export const Tag = ({ children, className, onRemove, ...props }: TagProps) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      <Typeset className={styles.content} size="sm" variant="secondary" weight={500}>
        {children}
      </Typeset>

      {onRemove && (
        <UnstyledButton className={styles.button} onClick={onRemove}>
          <IconX height={12} width={12} />
        </UnstyledButton>
      )}
    </div>
  );
};
