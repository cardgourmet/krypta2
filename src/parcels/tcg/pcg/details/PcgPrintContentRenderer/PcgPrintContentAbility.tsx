import { Group, Stack, Text } from '@mantine/core';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { renderRichPcgText } from '@/parcels/tcg/pcg/renderRichText.tsx';
import type { components as c } from '@/schema/api';

export function PcgPrintContentAbility({ ability }: { ability: c['schemas']['PcgCardAbility'] }) {
  return (
    <Stack key={ability.name} gap={'0.25rem'}>
      <Group gap={12}>
        <Badge color="red" style={{ '--badge-color': 'var(--gourmet-red-01)' }}>
          Ability
        </Badge>
        <Text ff={'var(--cgm-content-font-family)'} c={'var(--gourmet-red-01)'} fw="bold">
          {ability.name}
        </Text>
      </Group>
      <Text ff={'var(--cgm-content-font-family)'}>{renderRichPcgText(ability.text ?? '', true)}</Text>
    </Stack>
  );
}
