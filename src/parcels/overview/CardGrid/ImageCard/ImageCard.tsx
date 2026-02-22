import {ActionIcon, Checkbox, Group, Overlay} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useEffect, useMemo, useRef, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import {FlipButton} from '@/parcels/overview/CardGrid/ImageCard/FlipButton/FlipButton.tsx';
import {FlipImage} from '@/parcels/overview/CardGrid/ImageCard/FlipImage/FlipImage.tsx';
import {MoreActionsMenu} from '@/parcels/overview/CardGrid/ImageCard/MoreActionsMenu/MoreActionsMenu.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import type {MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import type {PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
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
    return tcgMemo(tcg, card) as CardProperties;
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

  const [selected, setSelected] = useState<boolean>(false);
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
        data-selected={selected}
        className={styles.cardLink}
      >
        <div>
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

          <FlipImage
            frontFace={{
              imageRef: imageRef,
              name: prop.name,
              thumbnailUrl: prop.thumbnailUrl ?? prop.backupImageUrl,
              backupImageUrl: prop.backupImageUrl,
              setImageLoaded,
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
      </Link>

      {imageLoaded && backfaceImageLoaded && (
        <Overlay backgroundOpacity={0} style={{ pointerEvents: 'none' }}>
          <Group p={'1rem'} justify={'space-between'}>
            <Checkbox
              style={{ pointerEvents: 'auto' }}
              onChange={(event) => setSelected(event.currentTarget.checked)}
              color={'var(--gourmet-orange-1)'}
              checked={selected}
              classNames={{ root: styles.overlayCheckbox }}
              wrapperProps={{
                'data-menu-opened': menuOpened,
              }}
            />
            <MoreActionsMenu
              menuOpened={menuOpened}
              setMenuOpened={setMenuOpened}
              target={
                <ActionIcon
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setMenuOpened((v) => !v)}
                  color="var(--gourmet-neutral-dark-3)"
                  size={'1.25rem'}
                  classNames={{ root: styles.overlayMenuButton }}
                  data-menu-opened={menuOpened}
                >
                  <IconDotsVertical size={16} />
                </ActionIcon>
              }
            />
          </Group>
        </Overlay>
      )}

      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />
      )}
    </div>
  );
}

const tcgMemo = (tcg: Tcg, card: unknown) => {
  if (tcg === 'dlc') {
    const dlcCard = card as DlcSearchDataCard;

    return {
      id: dlcCard.card.id,
      name: dlcCard.card.name,
      thumbnailUrl: dlcCard.card.print.translations?.en?.imageUrls?.thumbnail ?? '',
      backfaceThumbnailUrl: undefined,
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
      backfaceThumbnailUrl: undefined,
      backupImageUrl: backupImageUrl,
      setCode: pcgCard.card.print.setCode ?? undefined,
      collectorNumber: pcgCard.card.print.collectorNumber,
    };
  } else if (tcg === 'mtg') {
    const mtgCard = card as MtgSearchDataCard;
    const frontFace = mtgCard.card.print.faces?.[0]?.translations?.en;
    const backFace = mtgCard.card.print.faces?.[1]?.translations?.en;

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
};
