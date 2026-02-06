import { Button, Group, Image, Stack, Text } from '@mantine/core';
import { IconArrowRight, IconRefresh } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { slugify } from '@/parcels/slugify.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import { FlippableCard } from '@/routes/mtg/sets/$setCode/$collectorNumber/-components/FlippableCard.tsx';

export function MtgPrintImageRenderer({ card }: { card: MtgDataCard }) {
  const front = card.print.faces[0];
  const back = card.print.faces[1];

  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);

  const otherPrints = card.allPrints.filter((c) => c.id !== card.print.id && c.setCode === card.print.setCode);

  return (
    <Stack>
      <FlippableCard
        frontUrl={front.translations.en.imageUrls?.full ?? ''}
        backUrl={back?.translations?.en?.imageUrls?.full ?? undefined}
        flipRef={flipRef}
      />
      {back && (
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
                to={'/mtg/sets/$setCode/$collectorNumber/{-$any}'}
                params={{
                  setCode: print.setCode.toLowerCase(),
                  collectorNumber: print.collectorNumber.toLowerCase(),
                  any: slugify(card.name),
                }}
              >
                <Image key={print.id} src={print.imageUrls?.full} style={{ width: '4rem', borderRadius: '4px' }} />
              </Link>
            );
          })}
        </Group>
      )}
      {card.allPrints.length > 0 && (
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
