import { Group, Stack, Text } from '@mantine/core';
import { PcgSymbolSVG } from '@/parcels/tcg/pcg/details/PcgSymbolSVG.tsx';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';
import type { components as c } from '@/schema/api';

export function PcgPrintContentAttack({ attack }: { attack: c['schemas']['PcgCardAttack'] }) {
  return (
    <Stack key={attack.name} gap={'0.25rem'}>
      <Group gap={12}>
        {attack.cost.length > 0 && attack.cost[0] !== 'free' && (
          <Group gap={'0.25rem'} wrap={'nowrap'}>
            {attack.cost.map((t, index) => (
              <PcgSymbolSVG key={`${t}_${index}`} symbol={t} size={18} />
            ))}
          </Group>
        )}
        <Text ff={'var(--cgm-content-font-family)'} fw="bold" style={{ flexGrow: 1 }}>
          {attack.name}
        </Text>
        <Text ff={'var(--cgm-content-font-family)'} fw="bold">
          {attack.damage?.replace('x', '×')}
        </Text>
      </Group>
      <Text ff={'var(--cgm-content-font-family)'}>{renderRichPcgText(attack.text ?? '', true)}</Text>
    </Stack>
  );
}
