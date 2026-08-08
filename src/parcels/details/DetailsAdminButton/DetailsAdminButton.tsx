import { Center, UnstyledButton } from '@mantine/core';
import { IconTool } from '@tabler/icons-react';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './DetailsAdminButton.module.css';

export function DetailsAdminButton({ tcg, printId }: { tcg: Tcg; printId: string }) {
  return (
    <a href={`https://admin.cardgourmet.local/${tcg}/prints/${printId}`} target="_blank" rel="noopener noreferrer">
      <UnstyledButton className={styles.adminButton}>
        <Center>
          <IconTool color={'var(--gourmet-neutral-1'} />
        </Center>
      </UnstyledButton>
    </a>
  );
}
