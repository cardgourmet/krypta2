import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {Activity, useEffect, useMemo, useRef, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/ImageCard/createProps.ts';
import {FlipButton} from '@/parcels/overview/CardGrid/ImageCard/FlipButton/FlipButton.tsx';
import {FlipImage} from '@/parcels/overview/CardGrid/ImageCard/FlipImage/FlipImage.tsx';
import {MoreActionsMenu} from '@/parcels/overview/CardGrid/ImageCard/MoreActionsMenu/MoreActionsMenu.tsx';
import {ToolsOverlay} from '@/parcels/overview/CardGrid/ImageCard/ToolsOverlay/ToolsOverlay.tsx';
import type {TcgOverviewWorkSpace} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import {useSelectionIntegration} from '@/parcels/selection/useSelectionIntegration.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import {slugify} from '@/parcels/slugify.ts';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ImageCard.module.css';

interface ImageCardProps {
  tcg: Tcg;
  card: TcgSearchDataCard;
  index: number;
  toolsEnabled: boolean;
}

export default function ImageCard({ tcg, card, index, toolsEnabled }: ImageCardProps) {
  const isTouchDevice = useMediaQuery('(hover: none)');
  const workContext = useTcgOverviewWorkContext();

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

  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: prop.id,
    index,
  });

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

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

          // if shift key, calculate range of cards to add or remove
          const anchorIndex = workContext?.data?.selection?.anchorIndex;
          if (event.shiftKey && anchorIndex !== undefined && anchorIndex > -1) {
            const ids = getIdsInRange(anchorIndex, index, workContext!);
            setMultiSelection(ids, !checked);
            return;
          }

          setSelection(!checked);
        }}
        tabIndex={isSelectionMode ? 0 : undefined}
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

      {toolsEnabled && isTouchDevice && imageLoaded && backfaceImageLoaded && (
        <Group p={'0.5rem'} justify={'space-between'}>
          <Checkbox
            style={{ pointerEvents: 'auto' }}
            onChange={(event) => setSelection(event.currentTarget.checked)}
            color={'var(--gourmet-orange-1)'}
            checked={checked}
            wrapperProps={{
              'data-menu-opened': menuOpened,
            }}
          />
          <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>
            <MoreActionsMenu
              menuOpened={menuOpened}
              setMenuOpened={setMenuOpened}
              submenuOpened={submenuOpened}
              setSubmenuOpened={setSubmenuOpened}
              target={
                <ActionIcon
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setMenuOpened((v) => !v)}
                  color="var(--gourmet-neutral-dark-4)"
                  size={'1.25rem'}
                  data-menu-opened={menuOpened}
                >
                  <IconDotsVertical size={16} />
                </ActionIcon>
              }
            />
          </Activity>
        </Group>
      )}

      {toolsEnabled && !isTouchDevice && imageLoaded && backfaceImageLoaded && (
        <ToolsOverlay
          checked={checked}
          isSelectionMode={isSelectionMode}
          setSelection={setSelection}
          menuOpened={menuOpened}
          setMenuOpened={setMenuOpened}
          submenuOpened={submenuOpened}
          setSubmenuOpened={setSubmenuOpened}
        />
      )}

      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />
      )}
    </div>
  );
}

function getIdsInRange(anchorIndex: number, currentIndex: number, workContext: TcgOverviewWorkSpace): string[] {
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
