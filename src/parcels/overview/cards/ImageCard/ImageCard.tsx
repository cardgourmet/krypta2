import { Link } from '@tanstack/react-router';
import { type HTMLProps, type PropsWithChildren, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import type { CardProperties } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { FlipButton } from '@/parcels/overview/cards/CardGrid/FlipButton/FlipButton.tsx';
import { FlipImage } from '@/parcels/overview/cards/CardGrid/FlipImage/FlipImage.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ImageCard.module.css';

export function ImageCard({
  tcg,
  prop,
  children,
  linkProps,
  imageDivProps,
  ...others
}: PropsWithChildren<
  {
    tcg: Tcg;
    prop: CardProperties;
    linkProps?: Omit<HTMLProps<HTMLAnchorElement>, 'preload'>;
    imageDivProps?: HTMLProps<HTMLDivElement>;
  } & HTMLProps<HTMLDivElement>
>) {
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
    <div className={`${styles.card}`} {...others}>
      <Link
        to={'/$tcg/sets/$setCode/$collectorNumber/{-$any}'}
        params={{
          tcg: tcg,
          setCode: prop.setCode?.toLowerCase() as string,
          collectorNumber: prop.collectorNumber?.toLowerCase() as string,
          any: slugify(prop.name ?? ''),
        }}
        preload={false}
        className={`${styles.cardLink}`}
        {...linkProps}
      >
        <div>
          {(!imageLoaded || !backfaceImageLoaded) && (
            <Skeleton
              className={styles.cardSkeleton}
              baseColor={'var(--gourmet-neutral-4)'}
              highlightColor={'var(--gourmet-neutral-5)'}
              height={'100%'}
              width={'100%'}
            />
          )}

          <div {...imageDivProps}>
            <FlipImage
              frontFace={{
                imageRef: imageRef,
                name: prop.name,
                thumbnailUrl: prop.thumbnailUrl ?? prop.backupImageUrl,
                backupImageUrl: prop.backupImageUrl,
                setImageLoaded: setImageLoaded,
              }}
              backFace={{
                imageRef: backfaceImageRef,
                name: prop.name,
                thumbnailUrl: prop.backfaceThumbnailUrl ?? prop.backupImageUrl,
                backupImageUrl: prop.backupImageUrl,
                setImageLoaded: setBackfaceImageLoaded,
              }}
              flipRef={flipRef}
            />
          </div>
        </div>
      </Link>

      {imageLoaded && backfaceImageLoaded && children}

      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />
      )}
    </div>
  );
}
