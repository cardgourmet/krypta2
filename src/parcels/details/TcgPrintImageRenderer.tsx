import { Center, Group, Image, Stack, type StackProps, UnstyledButton } from '@mantine/core';
import { IconArrowRight, IconBrush, IconRefresh, IconRotate2, IconRotateClockwise2 } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlippableCard } from '@/parcels/details/FlippableCard/FlippableCard.tsx';
import { CursorImageHover } from '@/parcels/generic/CursorImageHover/CursorImageHover.tsx';
import { getImagesByTcgPrintRef } from '@/parcels/generic/CursorImageHover/getImagesByTcgCard.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { backupImageUrl } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { DlcDataCard, DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { dlcSearchParamsDefaults } from '@/parcels/tcg/dlc/types.ts';
import type { MtgDataCard, MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import { mtgSearchParamsDefaults } from '@/parcels/tcg/mtg/types.ts';
import type { PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import { pcgSearchParamsDefaults } from '@/parcels/tcg/pcg/types.ts';
import { type TcgDataCard, type TcgDataPrint, tcgSearchParamsDefaults } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Button } from '../generic/Button/Button';
import styles from './TcgPrintImageRenderer.module.css';

export function TcgPrintImageRenderer({
  tcg,
  card,
  lang,
  ...others
}: { tcg: Tcg; card: TcgDataCard; lang?: string } & StackProps) {
  const { t } = useTranslation('details');
  const printLanguage = lang ?? 'en';

  const frontUrl = useMemo(() => {
    if (tcg === 'mtg') return (card.print as MtgDataPrint).faces[0].translations?.[printLanguage].imageUrls?.full ?? '';
    else if (tcg === 'pcg') return (card.print as PcgDataPrint).translations?.[printLanguage].imageUrls?.full ?? '';
    else if (tcg === 'dlc') return (card.print as DlcDataPrint).translations?.[printLanguage].imageUrls?.full ?? '';
    return undefined;
  }, [tcg, card, printLanguage]);
  const backUrl = useMemo(() => {
    if (tcg === 'mtg')
      return (card.print as MtgDataPrint).faces[1]?.translations?.[printLanguage]?.imageUrls?.full ?? '';
    return undefined;
  }, [tcg, card, printLanguage]);

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const otherPrints = card.allPrints
    .filter((c) => {
      return c.id !== card.print.id;
    })
    .sort((a, b) => {
      const releaseA = new Date(a.releaseDate ?? '').getTime();
      const releaseB = new Date(b.releaseDate ?? '').getTime();

      return (releaseA - releaseB) * -1;
    });
  const searchParamsDefault = useMemo(() => {
    return tcg === 'mtg' ? mtgSearchParamsDefaults : tcg === 'dlc' ? dlcSearchParamsDefaults : pcgSearchParamsDefaults;
  }, [tcg]);

  const [rotated, setRotated] = useState(false);
  const isRotateable = useMemo(() => {
    if (tcg === 'mtg') {
      const rotateableMtgTypes = ['siege'];
      const c = card as MtgDataCard;

      return rotateableMtgTypes.some((t) => c.print.faces[0]?.subTypes.includes(t));
    } else if (tcg === 'dlc') {
      const rotateableDlcTypes = ['location'];
      const c = card as DlcDataCard;

      return rotateableDlcTypes.some((t) => c.classifications.includes(t));
    }

    return false;
  }, [tcg, card]);

  const printArtists = useMemo(() => {
    if (tcg === 'pcg') {
      return (card.print as PcgDataPrint).illustrators;
    }
    return [(card.print as Exclude<TcgDataPrint, PcgDataPrint>).artist];
  }, [card.print, tcg]);

  return (
    <Stack {...others}>
      <Stack gap={0}>
        <FlippableCard
          frontUrl={frontUrl ?? ''}
          backUrl={backUrl ?? undefined}
          backupUrl={backupImageUrl}
          flipRef={flipRef}
          cardRef={cardRef}
        />

        <Group gap={'0.25rem'} justify={'end'} mr={'0.5rem'}>
          <IconBrush size={16} color={'var(--gourmet-neutral-5)'} />

          <Link
            to={'/$tcg/cards'}
            params={{
              tcg: tcg,
            }}
            search={{
              ...tcgSearchParamsDefaults,
              query: `artist="${printArtists}"`,
            }}
            style={{
              textDecoration: 'none',
            }}
          >
            <GourmetText c={'var(--gourmet-neutral-5)'} fz={'0.9rem'}>
              {printArtists}
            </GourmetText>
          </Link>
        </Group>
      </Stack>

      {(backUrl || isRotateable) && (
        <Group w={'100%'} gap={'0.25rem'} wrap={'nowrap'}>
          {backUrl && (
            <Button
              leadingIcon={<IconRefresh />}
              onClick={() => {
                const newFlipped = !flipped;

                flipRef.current?.setAttribute('flipped', `${newFlipped}`);
                setFlipped(newFlipped);
              }}
              style={{ width: '100%' }}
              size="sm"
              variant="secondary"
            >
              Transform
            </Button>
          )}
          {isRotateable && (
            <Button
              leadingIcon={rotated ? <IconRotate2 /> : <IconRotateClockwise2 />}
              onClick={() => {
                const newRotated = !rotated;

                cardRef.current?.setAttribute('data-rotated', `${newRotated}`);
                setRotated(newRotated);
              }}
              style={{ width: '100%' }}
              size="sm"
              variant="secondary"
            >
              Rotate
            </Button>
          )}
        </Group>
      )}

      {otherPrints.length > 0 && (
        <Group gap={'0.5rem'} maw={'18rem'} w={'100%'}>
          {otherPrints.slice(0, 7).map((print) => {
            return (
              <CursorImageHover key={print.id} images={getImagesByTcgPrintRef(print, card.name)}>
                <Link
                  key={print.id}
                  to={`/$tcg/sets/$setCode/$collectorNumber/{-$any}`}
                  params={{
                    tcg: tcg,
                    setCode: print.setCode?.toLowerCase() ?? '???',
                    collectorNumber: print.collectorNumber.toLowerCase(),
                    any: slugify(card.name),
                  }}
                >
                  <Image
                    key={print.id}
                    src={print.imageUrls?.full}
                    style={{ width: '4rem', borderRadius: '4px' }}
                    fallbackSrc={backupImageUrl}
                  />
                </Link>
              </CursorImageHover>
            );
          })}
          {otherPrints.length > 7 && (
            <UnstyledButton
              style={{
                width: '4rem',
                borderRadius: '4px',
                border: '1px solid var(--gourmet-neutral-3)',
                height: '89px',
              }}
              className={styles.moreReprintsButton}
              onClick={() => {
                // TODO: open modal to show all prints in a list (to switch to)
              }}
            >
              <Center w={'100%'} h={'100%'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                  +{otherPrints.length - 7}
                </GourmetText>
              </Center>
            </UnstyledButton>
          )}
        </Group>
      )}
      {card.allPrints.length > 1 && (
        <Button accent="brand" asChild size="sm" trailingIcon={<IconArrowRight />} variant="tertiary">
          <Link
            params={{
              tcg: tcg,
            }}
            search={{
              ...searchParamsDefault,
              query: `cardid:"${card.id}" include:extras`,
              uniqueBy: 'prints',
            }}
            style={{ marginLeft: '-0.5rem' }}
            to="/$tcg/cards"
          >
            {t('image.showAll', { count: card.allPrints.length })}
          </Link>
        </Button>
      )}
    </Stack>
  );
}
