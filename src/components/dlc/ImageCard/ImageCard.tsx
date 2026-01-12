import { IconRefresh } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  id: string;
  name?: string;
  thumbnailUrl?: string;
  backfaceThumbnailUrl?: string;
  backupImageUrl: string;
}

export default function ImageCard(props: ImageCardProps) {
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
    if (backfaceImageRef.current?.complete) {
      setBackfaceImageLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={props.id} className={styles.card}>
      {imageLoaded && backfaceImageLoaded && (
        <div key={`${props.id}-overlay`} className={styles.contentOverlay}>
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
      <a href={`/dlc/cards/${props.id}`}>
        {(!imageLoaded || !backfaceImageLoaded) && (
          <Skeleton
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              aspectRatio: 672 / 936,
              borderRadius: '15px',
            }}
            baseColor={'#444'}
            highlightColor={'#656565'}
            height={'100%'}
            width={'100%'}
          />
        )}

        <div className={styles.flippableContent} ref={flipRef}>
          <div>
            <img
              ref={imageRef}
              alt={props.name}
              src={props.thumbnailUrl}
              loading={'lazy'}
              onError={(error) => {
                console.log(`Could not load image because: ${error}`);

                if (!imageRef.current) return;
                imageRef.current.src = props.backupImageUrl;
              }}
              onLoad={() => {
                setImageLoaded(true);
              }}
            />
          </div>
          {props.backfaceThumbnailUrl && (
            <div style={{ transform: 'rotateY(180deg)' }}>
              <img
                ref={backfaceImageRef}
                alt={props.name}
                src={props.backfaceThumbnailUrl}
                onError={(error) => {
                  console.log(`Could not load backface image because: ${error}`);

                  if (!backfaceImageRef.current) return;
                  backfaceImageRef.current.src = props.backupImageUrl;
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
