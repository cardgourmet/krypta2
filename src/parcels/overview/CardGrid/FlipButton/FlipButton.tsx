import {Container} from '@mantine/core';
import {IconRefresh} from '@tabler/icons-react';
import type {RefObject} from 'react';
import styles from '@/parcels/overview/CardGrid/ImageCard/ImageCard.module.css';

export function FlipButton({
  flipped,
  setFlipped,
  flipRef,
}: {
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  flipRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <Container top={'20%'} right={'8%'} pos={'absolute'} p={0}>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          const newFlipped = !flipped;

          flipRef.current?.setAttribute('flipped', `${newFlipped}`);
          setFlipped(newFlipped);
        }}
        className={styles.refreshButton}
        style={{ pointerEvents: 'auto' }}
      >
        <IconRefresh />
      </button>
    </Container>
  );
}
