import { UnstyledButton } from '@mantine/core';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from '@/parcels/homepage/Sidebar/Sidebar.module.css';

export function BetaButtonSide() {
  return (
    <UnstyledButton>
      <GourmetText
        cgmff={'ui'}
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          textTransform: 'uppercase',
          letterSpacing: '0.1rem',
        }}
        fw={500}
      >
        Cardgourmet <span className={styles.rainbowText}>BETA</span>
      </GourmetText>
    </UnstyledButton>
  );
}
