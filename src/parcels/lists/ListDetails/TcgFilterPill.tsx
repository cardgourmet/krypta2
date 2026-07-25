import { Group, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgFilterPill.module.css';

export function TcgFilterPill({
  tcg,
  size,
  state,
  onToggle,
  fallback,
}: {
  tcg: Tcg | 'all';
  size: number;
  state: boolean;
  onToggle: (selected: boolean) => void;
  fallback?: boolean;
}) {
  const [selected, setSelected] = useState(state);
  useEffect(() => {
    setSelected(state);
  }, [state]);

  return (
    <UnstyledButton
      className={styles.tcgPill}
      data-selected={selected}
      onClick={() => {
        if (selected && fallback) return;

        setSelected(!selected);
        onToggle(!selected);
      }}
    >
      <Group gap={'0.25rem'}>
        {tcg !== 'all' && (
          <TcgIcon
            tcg={tcg as Tcg}
            size={18}
            color={selected ? 'var(--gourmet-neutral-1)' : 'var(--gourmet-neutral-8)'}
          />
        )}

        <GourmetText style={{ textTransform: 'uppercase' }} cgmc={selected ? 'neutral-1' : 'neutral-8'}>
          {tcg}
        </GourmetText>
        <GourmetText cgmc={selected ? 'neutral-1' : 'neutral-8'}>({size})</GourmetText>
      </Group>
    </UnstyledButton>
  );
}
