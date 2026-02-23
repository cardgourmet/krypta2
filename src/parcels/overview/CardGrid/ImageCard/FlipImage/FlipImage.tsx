import type {RefObject} from 'react';
import styles from '@/parcels/overview/CardGrid/ImageCard/ImageCard.module.css';

export function FlipImage({
  flipRef,
  frontFace,
  backFace,
}: {
  frontFace: {
    imageRef: RefObject<HTMLImageElement | null>;
    name?: string;
    thumbnailUrl: string;
    backupImageUrl: string;
    setImageLoaded: (loaded: boolean) => void;
  };
  backFace: {
    imageRef: RefObject<HTMLImageElement | null>;
    name?: string;
    thumbnailUrl: string;
    backupImageUrl: string;
    setImageLoaded: (loaded: boolean) => void;
  };
  flipRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className={styles.flippableContent} ref={flipRef}>
      <div>
        <img
          ref={frontFace.imageRef}
          alt={frontFace.name}
          src={
            frontFace.thumbnailUrl === ''
              ? frontFace.backupImageUrl
              : (frontFace.thumbnailUrl ?? frontFace.backupImageUrl)
          }
          loading={'lazy'}
          onError={(error) => {
            console.log(`Could not load image because: ${error}`);

            if (!frontFace.imageRef.current) return;
            frontFace.imageRef.current.src = frontFace.backupImageUrl;
          }}
          onLoad={() => {
            frontFace.setImageLoaded(true);
          }}
        />
      </div>
      {backFace.thumbnailUrl && (
        <div style={{ transform: 'rotateY(180deg)', height: '100%' }}>
          <img
            ref={backFace.imageRef}
            alt={backFace.name}
            src={backFace.thumbnailUrl}
            onError={(error) => {
              console.log(`Could not load backface image because: ${error}`);

              if (!backFace.imageRef.current) return;
              backFace.imageRef.current.src = backFace.backupImageUrl;
            }}
            onLoad={() => {
              backFace.setImageLoaded(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
