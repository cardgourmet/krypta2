import { Group, Stack, Text } from '@mantine/core';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';

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
                <Stack gap="0.125rem" key={s.label}>
                  <Kicker size="sm">{s.label}</Kicker>

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
