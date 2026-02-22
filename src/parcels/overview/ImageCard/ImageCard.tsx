import {ActionIcon, Checkbox, Container, Group, Menu, Overlay} from '@mantine/core';
import {IconDotsVertical, IconRefresh} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {type RefObject, useEffect, useMemo, useRef, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
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
              setImageLoaded,
            }}
            flipRef={flipRef}
          />
        </div>
      </Link>

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
          <Menu width={200} position="top-start" opened={menuOpened} onChange={setMenuOpened} withArrow>
            <Menu.Target>
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
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>Add to list</Menu.Item>
              <Menu.Item>Copy print link</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Overlay>

      {prop.backfaceThumbnailUrl && imageLoaded && backfaceImageLoaded && (
        <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />
      )}
    </div>
  );
}

function FlipImage({
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
            frontFace.imageRef.current.src = backupImageUrl;
          }}
          onLoad={() => {
            backFace.setImageLoaded(true);
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

function FlipButton({
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
