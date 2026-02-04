import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { slugify } from '@/parcels/slugify.ts';
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

  setCode?: string;
  collectorNumber?: string;
};

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

export default function ImageCard({ tcg, card }: ImageCardProps) {
  const prop: CardProperties = useMemo(() => {
    if (tcg === 'dlc') {
      const dlcCard = card as DlcSearchDataCard;

      return {
        id: dlcCard.card.id,
        name: dlcCard.card.name,
        thumbnailUrl: dlcCard.card.print.translations?.en?.imageUrls?.thumbnail ?? '',
        backfaceThumbnailUrl: backupImageUrl,
        backupImageUrl: backupImageUrl,
        setCode: dlcCard.card.print.setCode,
        collectorNumber: dlcCard.card.print.collectorNumber,
      };
    } else if (tcg === 'pcg') {
      const pcgCard = card as PcgSearchDataCard;

      return {
        id: pcgCard.card.id,
        name: pcgCard.card.name,
        thumbnailUrl: pcgCard.card.print.translations.en?.imageUrls?.thumbnail ?? '',
        backfaceThumbnailUrl: backupImageUrl,
        backupImageUrl: backupImageUrl,
        setCode: pcgCard.card.print.setCode ?? undefined,
        collectorNumber: pcgCard.card.print.collectorNumber,
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
        setCode: mtgCard.card.print.setCode,
        collectorNumber: mtgCard.card.print.collectorNumber,
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
    if (!prop.backfaceThumbnailUrl || backfaceImageRef.current?.complete) {
      setBackfaceImageLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={prop.id} className={styles.card}>
      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <div key={`${prop.id}-overlay`} className={styles.contentOverlay}>
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
      <a
        href={`/${tcg}/sets/${prop.setCode?.toLowerCase()}/${prop.collectorNumber?.toLowerCase()}/${slugify(prop.name ?? '')}`}
      >
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
              alt={prop.name}
              src={prop.thumbnailUrl === '' ? prop.backupImageUrl : (prop.thumbnailUrl ?? prop.backupImageUrl)}
              loading={'lazy'}
              onError={(error) => {
                console.log(`Could not load image because: ${error}`);

                if (!imageRef.current) return;
                imageRef.current.src = prop.backupImageUrl;
              }}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </div>
          {prop.backfaceThumbnailUrl && (
            <div style={{ transform: 'rotateY(180deg)', height: '100%' }}>
              <img
                ref={backfaceImageRef}
                alt={prop.name}
                src={prop.backfaceThumbnailUrl}
                onError={(error) => {
                  console.log(`Could not load backface image because: ${error}`);

                  if (!backfaceImageRef.current) return;
                  backfaceImageRef.current.src = prop.backupImageUrl;
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
