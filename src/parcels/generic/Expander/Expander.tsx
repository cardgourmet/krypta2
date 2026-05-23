import { UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { useId, useState } from 'react';
import { Hyperlink } from '../Hyperlink/Hyperlink';
import styles from './Expander.module.css';
import type { ExpanderProps } from './types';

export const Expander = ({
  children,
  className,
  defaultValue = false,
  expanded,
  id: _id,
  renderLabel,
  ...props
}: ExpanderProps) => {
  const [isExpanded, setExpanded] = useState(defaultValue);

  const randomId = useId();
  const id = _id ?? randomId;

  return (
    <div>
      <div
        aria-hidden={!(expanded ?? isExpanded)}
        className={clsx(styles.base, (expanded ?? isExpanded) && styles.isExpanded, className)}
        id={id}
        {...props}
      >
        <div className={styles.content}>{children}</div>
      </div>

      {typeof expanded === 'undefined' && (
        <Hyperlink
          asChild
          className={styles.toggle}
          initialUnderline={false}
          size="sm"
          trailingIcon={<IconChevronDown />}
        >
          <UnstyledButton
            aria-controls={id}
            aria-expanded={isExpanded}
            onClick={() => setExpanded((expanded) => !expanded)}
          >
            {renderLabel?.(isExpanded) ?? `${isExpanded ? 'Weniger' : 'Mehr'} anzeigen`}
          </UnstyledButton>
        </Hyperlink>
      )}
    </div>
  );
};
