import {Button, Group, Image, Stack, Text} from '@mantine/core';
import {IconArrowRight, IconRefresh} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useMemo, useRef, useState} from 'react';
import {FlippableCard} from '@/parcels/details/FlippableCard/FlippableCard.tsx';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcDataCard, DlcDataPrint} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataCard, MtgDataPrint} from '@/parcels/tcg/mtg/api.ts';
import type {PcgDataCard, PcgDataPrint} from '@/parcels/tcg/pcg/api.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

export function TcgPrintImageRenderer({ tcg, card }: { tcg: Tcg; card: MtgDataCard | PcgDataCard | DlcDataCard }) {
  const frontUrl = useMemo(() => {
    if (tcg === 'mtg') return (card.print as MtgDataPrint).faces[0].translations.en.imageUrls?.full ?? '';
    else if (tcg === 'pcg') return (card.print as PcgDataPrint).translations.en.imageUrls?.full ?? '';
    else if (tcg === 'dlc') return (card.print as DlcDataPrint).translations.en.imageUrls?.full ?? '';
    return undefined;
  }, [tcg, card]);
  const backUrl = useMemo(() => {
    if (tcg === 'mtg') return (card.print as MtgDataPrint).faces[1]?.translations?.en?.imageUrls?.full ?? '';
    return undefined;
  }, [tcg, card]);

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);

  const otherPrints = card.allPrints.filter((c) => {
    return c.id !== card.print.id && c.setCode === card.print.setCode;
  });

  return (
    <Stack>
      <FlippableCard
        frontUrl={frontUrl ?? ''}
        backUrl={backUrl ?? undefined}
        backupUrl={backupImageUrl}
        flipRef={flipRef}
      />
      {backUrl && (
        <Button
          onClick={() => {
            const newFlipped = !flipped;

            flipRef.current?.setAttribute('flipped', `${newFlipped}`);
            setFlipped(newFlipped);
          }}
          color={'var(--gourmet-neutral-2)'}
          c={'var(--gourmet-neutral-7)'}
        >
          <Group gap={'0.25rem'}>
            <IconRefresh size={18} />
            Transform
          </Group>
        </Button>
      )}

      {otherPrints.length > 0 && (
        <Group gap={'0.5rem'} maw={'18rem'} w={'100%'}>
          {otherPrints.map((print) => {
            return (
              <Link
                key={print.id}
                to={`/${tcg}/sets/$setCode/$collectorNumber/{-$any}`}
                params={{
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
        </Group>
      )}
      {card.allPrints.length > 1 && (
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <Group gap={'xs'}>
            <Text fz={'sm'} c={'var(--gourmet-blue-5)'}>
              Alle {card.allPrints.length} Prints ansehen
            </Text>
            <IconArrowRight style={{ color: 'var(--gourmet-blue-5)' }} size={'0.875rem'} />
          </Group>
        </Link>
      )}
    </Stack>
  );
}
