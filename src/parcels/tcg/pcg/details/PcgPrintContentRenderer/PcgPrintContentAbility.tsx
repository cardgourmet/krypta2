import { Group, Stack, Text } from '@mantine/core';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';
import type { components as c } from '@/schema/api';

export function PcgPrintContentAbility({ ability }: { ability: c['schemas']['PcgCardAbility'] }) {
  return (
    <Stack key={ability.name} gap={'0.25rem'}>
      <Group>
        <Text
          ff={'var(--cgm-content-font-family)'}
          fz={'sm'}
          style={{
            border: '1px solid var(--gourmet-red-01)',
            borderRadius: '0.5rem',
          }}
          c={'var(--gourmet-red-01)'}
          p={'0.15rem 0.75rem'}
        >
          Ability
        </Text>
        <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-red-01)'}>
          {ability.name}
        </Text>
      </Group>
      <Text ff={'var(--cgm-content-font-family)'}>{renderRichPcgText(ability.text ?? '', true)}</Text>
    </Stack>
  );
}
