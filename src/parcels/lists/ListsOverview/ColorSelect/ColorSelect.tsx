import {Group, UnstyledButton} from '@mantine/core';
import {useState} from 'react';
import styles from './ColorSelect.module.css';

export function ColorSelect({ value, onChange }: { value: string | undefined; onChange: (v?: string) => void }) {
  //const colors = ['FFADAD', 'FFD6A5', 'FDFFB6', 'CAFFBF', '9BF6FF', 'A0C4FF', 'BDB2FF', 'FFC6FF'];
  const colors = ['#e6261f', '#eb7532', '#f7d038', '#a3e048', '#49da9a', '#34bbe6', '#4355db', '#d23be7'];
  const [currentSelected, setCurrentSelected] = useState<string | undefined>(value);

  return (
    <Group gap={'0.5rem'}>
      {colors.map((color, i) => {
        const isSelected = currentSelected === color;

        return (
          <UnstyledButton
            onClick={() => {
              if (isSelected) {
                setCurrentSelected(undefined);
                onChange(undefined);
              } else {
                setCurrentSelected(color);
                onChange(color);
              }
            }}
            key={i}
            style={{ color: `${color}` }}
            className={styles.colorSelectButton}
            data-selected={isSelected}
          />
        );
      })}
    </Group>
  );
}
