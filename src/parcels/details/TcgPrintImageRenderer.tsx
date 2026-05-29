import { Center, Group, Image, Stack, type StackProps } from '@mantine/core';
import { IconArrowRight, IconRefresh } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlippableCard } from '@/parcels/details/FlippableCard/FlippableCard.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { backupImageUrl } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { DlcDataPrint } from '@/parcels/tcg/dlc/api.ts';
import { dlcSearchParamsDefaults } from '@/parcels/tcg/dlc/types.ts';
import type { MtgDataPrint } from '@/parcels/tcg/mtg/api.ts';
import { mtgSearchParamsDefaults } from '@/parcels/tcg/mtg/types.ts';
import type { PcgDataPrint } from '@/parcels/tcg/pcg/api.ts';
import { pcgSearchParamsDefaults } from '@/parcels/tcg/pcg/types.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Button } from '../generic/Button/Button';

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

  return (
    <Stack {...others}>
      <FlippableCard
        frontUrl={frontUrl ?? ''}
        backUrl={backUrl ?? undefined}
        backupUrl={backupImageUrl}
        flipRef={flipRef}
      />
      {backUrl && (
        <Button
          leadingIcon={<IconRefresh />}
          onClick={() => {
            const newFlipped = !flipped;

            flipRef.current?.setAttribute('flipped', `${newFlipped}`);
            setFlipped(newFlipped);
          }}
          size="sm"
          style={{ width: 'min(100%, 18rem)' }}
          variant="secondary"
        >
          Transform
        </Button>
      )}

      {otherPrints.length > 0 && (
        <Group gap={'0.5rem'} maw={'18rem'} w={'100%'}>
          {otherPrints.slice(0, 7).map((print) => {
            return (
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
            );
          })}
          {otherPrints.length > 7 && (
            <div
              style={{
                width: '4rem',
                borderRadius: '4px',
                border: '1px solid var(--gourmet-neutral-3)',
                height: '89px',
              }}
            >
              <Center w={'100%'} h={'100%'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                  +{otherPrints.length - 7}
                </GourmetText>
              </Center>
            </div>
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
