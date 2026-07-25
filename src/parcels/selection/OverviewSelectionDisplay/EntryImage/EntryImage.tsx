import { UnstyledButton } from '@mantine/core';
import { useRef, useState } from 'react';
import { type CardProperties, createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { FlipButton } from '@/parcels/overview/cards/CardGrid/FlipButton/FlipButton.tsx';
import { FlipImage } from '@/parcels/overview/cards/CardGrid/FlipImage/FlipImage.tsx';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './EntryImage.module.css';

export function EntryImage({ tcg, entry }: { tcg: Tcg; entry: TcgSearchDataCard }) {
  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);
  const prop = createProps(tcg, entry) as CardProperties;

  const imageRef = useRef<HTMLImageElement>(null);
  const backfaceImageRef = useRef<HTMLImageElement>(null);
  const setSelectionWithCheck = useOverviewWorkStore((state) => state.setSelectionWithCheck);

  return (
    <div className={styles.card}>
      <div style={{ width: '100%', height: '100%' }}>
        <UnstyledButton
          style={{ display: 'flex', width: '100%', height: '100%' }}
          onClick={() => {
            setSelectionWithCheck([entry.card.print.id], false);
          }}
        >
          <FlipImage
            frontFace={{
              imageRef: imageRef,
              name: prop.name,
              thumbnailUrl: prop.thumbnailUrl ?? prop.backupImageUrl,
              backupImageUrl: prop.backupImageUrl,
              setImageLoaded: () => {},
            }}
            backFace={{
              imageRef: backfaceImageRef,
              name: prop.name,
              thumbnailUrl: prop.backfaceThumbnailUrl ?? prop.backupImageUrl,
              backupImageUrl: prop.backupImageUrl,
              setImageLoaded: () => {},
            }}
            flipRef={flipRef}
          />
        </UnstyledButton>
      </div>

      {prop.backfaceThumbnailUrl && <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />}
    </div>
  );
}
