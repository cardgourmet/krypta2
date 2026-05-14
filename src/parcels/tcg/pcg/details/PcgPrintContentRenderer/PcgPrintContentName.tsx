import { Group, Stack, Text } from '@mantine/core';
import type { ReactElement } from 'react';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import { PcgSymbolSVG } from '@/parcels/tcg/pcg/details/PcgSymbolSVG.tsx';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';

export function PcgPrintContentName({ card }: { card: PcgDataCard }) {
  const trans = card.print.translations.en;

  return (
    <Group align={'start'} justify={'space-between'} style={{ width: '100%' }} wrap={'nowrap'}>
      <Stack gap={'0.1rem'}>
        <Text
          ff={'var(--cgm-content-font-family)'}
          fw={'bold'}
          fz={'1.1rem'}
          c={'var(--gourmet-neutral-9)'}
          style={{ flexGrow: 1 }}
        >
          {renderName(trans.name, card)}
        </Text>
      </Stack>
      <Group gap={'0.5rem'} wrap={'nowrap'} align={'start'}>
        {card.hp && (
          <Group gap={'0.1rem'} wrap={'nowrap'}>
            <Text fz={'0.75rem'} ff={'var(--cgm-content-font-family)'}>
              HP
            </Text>
            <Text ff={'var(--cgm-content-font-family)'}>{card.hp}</Text>
          </Group>
        )}
        {card.types.length > 0 && (
          <Group align={'start'}>
            {card.types.map((t) => (
              <PcgSymbolSVG key={t} symbol={t} size={22} />
            ))}
          </Group>
        )}
      </Group>
    </Group>
  );
}

function renderName(name: string, _: PcgDataCard): ReactElement {
  return <span>{renderRichPcgText(name, true)}</span>;
}
