import { Group } from '@mantine/core';
import { QueryListButtons } from '@/parcels/overview/cards/QueryMenu/QueryListButtons/QueryListButtons.tsx';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';

export function QueryMenu({ query }: { query: ExplainSearchQuery & { statisticsId: string } }) {
  console.log('query', query);

  return (
    <Group ml={'1rem'}>
      <QueryListButtons query={query} size={18} />
    </Group>
  );
}
