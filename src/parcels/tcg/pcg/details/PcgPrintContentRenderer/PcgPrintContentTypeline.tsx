import {Group, Text} from '@mantine/core';
import {Link} from '@tanstack/react-router';
import {capitalizeFirstLetter} from '@/parcels/capitalizeFirstLetter.ts';
import type {PcgDataCard} from '@/parcels/tcg/pcg/api.ts';
import {pcgSubtypesMapping} from '@/parcels/tcg/pcg/translations/subtypes.ts';
import {pcgSupertypesMapping} from '@/parcels/tcg/pcg/translations/supertypes.ts';
import {pcgSearchParamsDefaults} from '@/parcels/tcg/pcg/types.ts';
import type {components as c} from '@/schema/api';

export function PcgPrintContentTypeline({ card }: { card: PcgDataCard }) {
  return (
    <Group gap={'0.25rem'}>
      <Text ff={'var(--cgm-content-font-family)'}>{renderTypeline(card.superType, card.subTypes, 'en')}</Text>
      {card.evolvesFrom && (
        <>
          <Text ff={'var(--cgm-content-font-family)'}>—</Text>
          <Group gap={'0.25rem'}>
            <Text ff={'var(--cgm-content-font-family)'}>{capitalizeFirstLetter(card.evolutionStage ?? '')},</Text>
            <Text ff={'var(--cgm-content-font-family)'}>
              Evolves from{' '}
              <Link
                to={'/pcg/cards'}
                search={{
                  ...pcgSearchParamsDefaults,
                  query: `name:"${card.evolvesFrom}"`,
                }}
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--gourmet-blue-03)',
                  textUnderlineOffset: '2px',
                  color: 'inherit',
                }}
              >
                {card.evolvesFrom}
              </Link>
            </Text>
          </Group>
        </>
      )}
    </Group>
  );
}

function renderTypeline(
  supertype: c['schemas']['PcgDataCard']['superType'],
  subtypes: string[],
  _: 'en' | 'de',
): string {
  return [
    pcgSupertypesMapping[supertype] ?? supertype,
    ...subtypes.map((subtype) => pcgSubtypesMapping[subtype] ?? subtype),
  ].join(' ');
}
