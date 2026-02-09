import {Group, Stack, Text} from '@mantine/core';
import type {PcgDataCard} from '@/parcels/tcg/pcg/api.ts';
import {renderRichPcgText} from '@/parcels/tcg/pcg/renderRichText.tsx';

export function PcgPrintContentStats({ card }: { card: PcgDataCard }) {
  const stats = [
    {
      label: 'weakness',
      value:
        card.weaknessTypes.length > 0
          ? `${card.weaknessTypes.map((d) => `{${d}}`).join('')} ${card.weaknessModifier}`
          : undefined,
    },
    {
      label: 'resistance',
      value:
        card.resistanceTypes.length > 0
          ? `${card.resistanceTypes.map((d) => `{${d}}`).join('')} ${card.resistanceModifier}`
          : undefined,
    },
    {
      label: 'retreat',
      value: card.retreatCost
        ? Array.from(Array(card.retreatCost ?? 0).keys())
            .map(() => '{C}')
            .join('')
        : undefined,
    },
  ];

  return (
    <>
      {stats && (
        <Group>
          {stats
            .filter((s) => s.value !== undefined)
            .map((s) => {
              return (
                <Stack key={s.label} gap={'0.15rem'}>
                  <Text ff={'var(--cgm-content-font-family)'} fz={'xs'} c={'var(--gourmet-neutral-6)'}>
                    {s.label.toUpperCase()}
                  </Text>
                  <Text ff={'var(--cgm-content-font-family)'} fz={'md'} c={'var(--gourmet-neutral-9)'}>
                    {renderRichPcgText(s.value?.replace('x', '×') ?? '')}
                  </Text>
                </Stack>
              );
            })}
        </Group>
      )}
    </>
  );
}
