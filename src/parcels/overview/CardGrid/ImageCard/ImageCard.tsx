import {Link} from '@tanstack/react-router';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/ImageCard/createProps.ts';
import {FlipButton} from '@/parcels/overview/CardGrid/ImageCard/FlipButton/FlipButton.tsx';
import {FlipImage} from '@/parcels/overview/CardGrid/ImageCard/FlipImage/FlipImage.tsx';
import {ToolsOverlay} from '@/parcels/overview/CardGrid/ImageCard/ToolsOverlay/ToolsOverlay.tsx';
import {type MtgOverviewWorkAmbient, useMtgOverviewWorkContext} from '@/parcels/overview/MtgOverviewWorkContext.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import type {MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import type {PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  tcg: Tcg;
  card: MtgSearchDataCard | DlcSearchDataCard | PcgSearchDataCard;
  index: number;
}

export default function ImageCard({ tcg, card, index }: ImageCardProps) {
  const workContext = useMtgOverviewWorkContext();
  const isSelectionMode = (workContext?.data?.selection?.elementIds?.length ?? 0) > 0;

  const prop: CardProperties = useMemo(() => {
    return createProps(tcg, card) as CardProperties;
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

  const isSelected = useMemo(() => {
    if (!workContext?.data?.selection) return;
    const selectedElements = workContext.data.selection.elementIds;
    if (selectedElements.length === 0) {
      return false;
    }

    return selectedElements.includes(prop.id);
  }, [workContext?.data?.selection, prop.id]);
  const [checked, setChecked] = useState<boolean>(isSelected ?? false);
  const setSelection = useCallback(
    (select: boolean) => {
      setChecked(select);

      if (select) workContext?.addSelection([prop.id], index, prop.id);
      else workContext?.removeSelection([prop.id]);
    },
    [index, prop.id, workContext?.addSelection, workContext?.removeSelection],
  );
  const setMultiSelection = useCallback(
    (ids: string[]) => {
      setChecked(true);

      workContext?.addSelection([...ids], index, prop.id);
    },
    [index, prop.id, workContext?.addSelection],
  );

  useEffect(() => {
    if (!workContext?.data?.selection?.elementIds) {
      setChecked(false);
      return;
    }
    if (!checked && workContext.data.selection.elementIds.includes(prop.id)) {
      setChecked(true);
      return;
    }
    if (checked && !workContext.data.selection.elementIds.includes(prop.id)) {
      setChecked(false);
      return;
    }
  }, [workContext?.data?.selection?.elementIds, checked, prop.id]);

  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <div className={styles.card}>
      <Link
        to={`/$tcg/sets/$setCode/$collectorNumber/{-$any}`}
        params={{
          tcg: tcg,
          setCode: prop.setCode?.toLowerCase() as string,
          collectorNumber: prop.collectorNumber?.toLowerCase() as string,
          any: slugify(prop.name ?? ''),
        }}
        preload={false}
        data-selected={checked}
        disabled={isSelectionMode}
        data-disabled={isSelectionMode}
        onClick={(event) => {
          if (!isSelectionMode) return;
          event.preventDefault();

          // if shift key, calculate range of cards to add (never remove!)
          const anchorIndex = workContext?.data?.selection?.anchorIndex;
          if (event.shiftKey && anchorIndex !== undefined && anchorIndex > -1) {
            const ids = getIdsInRange(anchorIndex, index, workContext!);
            setMultiSelection(ids);
            return;
          }

          setSelection(!checked);
        }}
        className={`${styles.cardLink} ${isSelectionMode && !isSelected ? styles.cardLinkSelectable : ''}`}
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

          <div className={isSelectionMode ? styles.cardSelectionOverlay : ''} data-selected={isSelected}>
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

      {imageLoaded && backfaceImageLoaded && (
        <ToolsOverlay
          checked={checked}
          isSelectionMode={isSelectionMode}
          setSelection={setSelection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
        />
      )}

      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />
      )}
    </div>
  );
}

function getIdsInRange(anchorIndex: number, currentIndex: number, workContext: MtgOverviewWorkAmbient): string[] {
  const fromIndex = anchorIndex < currentIndex ? anchorIndex : currentIndex;
  const toIndex = anchorIndex < currentIndex ? currentIndex : anchorIndex;

  const ids = [] as string[];
  workContext.data.search.result.data.items.forEach((item, index) => {
    if (index >= fromIndex && index <= toIndex) {
      ids.push(item.card.id);
    }
  });

  return ids;
}
