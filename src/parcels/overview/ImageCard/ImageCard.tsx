import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import type { DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  tcg: Tcg;
  card: MtgSearchDataCard | DlcSearchDataCard | PcgSearchDataCard;
}

type CardProperties = {
  id: string;
  name?: string;
  thumbnailUrl?: string;
  backfaceThumbnailUrl?: string;
  backupImageUrl: string;
};

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

export default function ImageCard({ tcg, card }: ImageCardProps) {
  const properties: CardProperties = useMemo(() => {
    if (tcg === 'dlc') {
      const dlcCard = card as DlcSearchDataCard;

      return {
        id: dlcCard.card.id,
        name: dlcCard.card.name,
        thumbnailUrl: dlcCard.card.print.translations?.en?.imageUrls?.thumbnail ?? '',
        backfaceThumbnailUrl: backupImageUrl,
        backupImageUrl: backupImageUrl,
      };
    } else if (tcg === 'pcg') {
      const pcgCard = card as PcgSearchDataCard;

      return {
        id: pcgCard.card.id,
        name: pcgCard.card.name,
        thumbnailUrl: pcgCard.card.print.translations.en?.imageUrls?.thumbnail ?? '',
        backfaceThumbnailUrl: backupImageUrl,
        backupImageUrl: backupImageUrl,
      };
    } else if (tcg === 'mtg') {
      const mtgCard = card as MtgSearchDataCard;
      const frontFace = mtgCard.card.print.faces[0]?.translations?.en;
      const backFace = mtgCard.card.print.faces[1]?.translations?.en;

      return {
        id: mtgCard.card.id,
        name: mtgCard.card.name,
        thumbnailUrl: frontFace?.imageUrls?.thumbnail ?? frontFace?.imageUrls?.full ?? '',
        backfaceThumbnailUrl: backFace?.imageUrls?.thumbnail ?? backFace?.imageUrls?.full ?? undefined,
        backupImageUrl: backupImageUrl,
      };
    }
    return {} as CardProperties;
  }, [tcg, card]);

  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const [backfaceImageLoaded, setBackfaceImageLoaded] = useState(false);
  const backfaceImageRef = useRef<HTMLImageElement>(null);

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: idgaf
  useEffect(() => {
    if (imageLoaded && backfaceImageLoaded) return;
    if (imageRef.current?.complete) {
      setImageLoaded(true);
    }
    if (!properties.backfaceThumbnailUrl || backfaceImageRef.current?.complete) {
      setBackfaceImageLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={properties.id} className={styles.card}>
      {properties.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <div key={`${properties.id}-overlay`} className={styles.contentOverlay}>
          <button
            type="button"
            onClick={() => {
              const newFlipped = !flipped;

              flipRef.current?.setAttribute('flipped', `${newFlipped}`);
              setFlipped(newFlipped);
            }}
          >
            <IconRefresh />
          </button>
        </div>
      )}
      <a href={`/dlc/cards/${properties.id}`}>
        {(!imageLoaded || !backfaceImageLoaded) && (
          <Skeleton
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              aspectRatio: 672 / 936,
              borderRadius: '15px',
            }}
            baseColor={'var(--gourmet-neutral-4)'}
            highlightColor={'var(--gourmet-neutral-5)'}
            height={'100%'}
            width={'100%'}
          />
        )}

        <div className={styles.flippableContent} ref={flipRef}>
          <div>
            <img
              ref={imageRef}
              alt={properties.name}
              src={
                properties.thumbnailUrl === ''
                  ? properties.backupImageUrl
                  : (properties.thumbnailUrl ?? properties.backupImageUrl)
              }
              loading={'lazy'}
              onError={(error) => {
                console.log(`Could not load image because: ${error}`);

                if (!imageRef.current) return;
                imageRef.current.src = properties.backupImageUrl;
              }}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </div>
          {properties.backfaceThumbnailUrl && (
            <div style={{ transform: 'rotateY(180deg)', height: '100%' }}>
              <img
                ref={backfaceImageRef}
                alt={properties.name}
                src={properties.backfaceThumbnailUrl}
                onError={(error) => {
                  console.log(`Could not load backface image because: ${error}`);

                  if (!backfaceImageRef.current) return;
                  backfaceImageRef.current.src = properties.backupImageUrl;
                }}
                onLoad={() => {
                  setBackfaceImageLoaded(true);
                }}
              />
            </div>
          )}
        </div>
      </a>
    </div>
  );
}
